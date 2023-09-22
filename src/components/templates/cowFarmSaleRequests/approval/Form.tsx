import {
  Card,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { edit } from '@/services/cow_farm_sales/CowFarmSalesServices';
import { useSnackbar } from 'notistack';
import { useSession } from 'next-auth/react';
import { Prisma } from '@prisma/client';

interface ApprovalProps {
  cowFarmSaleRequest: Prisma.CowFarmSaleRequestCreateInput;
}

function ApprovalForm({
  cowFarmSaleRequest
}: ApprovalProps) {

  const router = useRouter();
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();

  let approval: any = null;

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [RejectPopUp, setRejectPopUp] = useState(false);

  const editRequestSchema = Yup.object({
    rejectedReason: Yup.string()
      .when('rejectionMessage', {
        is: true,
        then: Yup.string().required(t('Enter Rejected Reason'))
      })
  });

  const onSubmit = async (values: any, setSubmitting: any) => {
    updateRequest(values, setSubmitting)
  };

  const updateRequest = (values: any, setSubmitting: any) => {
    // const id = cowFarmSaleRequest.id;
    // const rejectedReason = values.rejectedReason;

    return edit(values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t("The Request Has Been") + ` ${approval} ` + t("Successfully"), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      
      router.push(`/dashboard/cow-farm-sale-requests/approvals`);
    }, (error: any) => {
      enqueueSnackbar(t('Something went wrong, please try again'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    });
  }

  return (
    <Card
      sx={{
        p: 3
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              id: cowFarmSaleRequest?.id || '',
              farm: (cowFarmSaleRequest?.farm as any)?.name || '',
              quantity: cowFarmSaleRequest?.quantity || '',
              rejectedReason: '',
              rejectionMessage: false,
              createdBy: cowFarmSaleRequest?.createdBy,
              cows: cowFarmSaleRequest?.cows || [],
            }}
            enableReinitialize
            validationSchema={editRequestSchema}
            onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <TextInputField
                  name='farms'
                  label={t('Farm')}
                  disabled={true}
                  value={values.farm}
                  hasError={errors.farm && touched.farm ? true : false}
                  errorMessage={errors.farm}
                />

                <TextInputField
                  name='quantity'
                  value={values.quantity}
                  label={t('Quantity')}
                  disabled={true}
                  onChangeText={(quantity) => { setFieldValue('quantity', quantity) }}
                  hasError={errors.quantity && touched.quantity ? true : false}
                  errorMessage={errors.quantity}
                />

                <Typography component="span" variant="subtitle1">
                  {t('Cows Details')}
                </Typography>

                {cowFarmSaleRequest &&
                  (cowFarmSaleRequest?.cows as any)?.map((cow, index) => (
                      <TextInputField
                        key={index}
                        name='cowNfcId'
                        label={t('NFC ID')}
                        value={cow.nfcId}
                        disabled={true}
                      />
                  ))}

                {
                  RejectPopUp
                    ?
                    <>
                      <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>
                          <Button
                            sx={{
                              mt: 3
                            }}
                            color="error"
                            size="large"
                            fullWidth
                            variant="contained"
                          >
                            {t('Reject')}
                          </Button>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Button
                            sx={{
                              mt: 3
                            }}
                            color="secondary"
                            onClick={(event) => { event.preventDefault(); setRejectPopUp(false) }}
                            size="large"
                            fullWidth
                            variant="contained"
                          >
                            {t('Cancel')}
                          </Button>
                        </Grid>

                      </Grid>

                      <TextareaField
                        name='rejectedReason'
                        value={values.rejectedReason}
                        label={t('Rejected Reason')}
                        onChangeText={(rejectedReason) => { setFieldValue('rejectedReason', rejectedReason) }}
                        hasError={errors.rejectedReason && touched.rejectedReason ? true : false}
                        errorMessage={errors.rejectedReason}
                      />

                      <Button
                        sx={{
                          mt: 3
                        }}
                        color="primary"
                        type="submit"
                        onClick={() => { setFieldValue('rejectionMessage', true); setFieldValue('approval', 'Rejected'); approval = 'Rejected'; }}
                        size="large"
                        fullWidth
                        variant="contained"
                      >
                        {t('Submit')}
                      </Button>
                    </>
                    :
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Button
                            sx={{
                              mt: 3
                            }}
                            color="error"
                            onClick={() => { setRejectPopUp(true); }}
                            size="large"
                            fullWidth
                            variant="contained"
                          >
                            {t('Reject')}
                          </Button>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Button
                            sx={{
                              mt: 3
                            }}
                            color="success"
                            type="submit"
                            onClick={() => { setFieldValue('rejectionMessage', false); setFieldValue('approval', 'Approved'); approval = 'Approved' }}
                            size="large"
                            fullWidth
                            variant="contained"
                          >
                            {t('Approve')}
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                }
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ApprovalForm;