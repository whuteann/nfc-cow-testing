import {
  Card,
  Grid,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { edit } from '@/services/cow_purchases/CowPurchasesServices';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';

interface ApprovalProps {
  request: Prisma.CowPurchaseRequestCreateInput;
}

function ApprovalForm({
  request,
}: ApprovalProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [RejectPopUp, setRejectPopUp] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let approval: any = null;

  const router = useRouter();
  const { t }: { t: any } = useTranslation();

  const editRequestSchema = Yup.object({
    rejectionReason: Yup.string()
      .when('rejectionMessage', {
        is : true,
        then : Yup.string().required(t('Enter Rejection Reason'))
      })
  });

  const onSubmit = async (values:any, setSubmitting:any) => {
    updateRequest(values, setSubmitting)
  };

  const updateRequest = (values:any , setSubmitting: any) => {
    const id = request?.id;
    const farm = (request?.farm as any).id
    const totalAmount = request?.noOfCows

    return edit(values, approval, id,  farm, totalAmount, () => {
      router.push(`/dashboard/cow-purchase-requests/approvals`);
      setSubmitting(false);
      
      enqueueSnackbar(t("The Request Has Been")+` ${approval} `+t("Successfully"), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    }, (error: any) => {
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
              country: (request?.farm as any).district.country || '',
              farm: request?.farm || '',
              noOfCows: request?.noOfCows || '',
              pricePerCow: request?.pricePerCow || '',
              reasonForPurchase: request?.reasonForPurchase || '',
              calculatedPurchasePrice: request?.calculatedPurchasePrice || '',
              rejectionReason: '',
              rejectionMessage: false
            }}
            enableReinitialize
            validationSchema={editRequestSchema}
            onSubmit={(values, {setSubmitting}) => onSubmit(values, setSubmitting)}
          >
          {({errors, touched, setFieldValue, values}) => (
          <Form>
            <TextInputField
              name='country'
              label={t('Country')}
              disabled = {true}
              placeholder ={t('Select a country')}
              value = {(request?.farm as any).district.country?.name || ''}
            />

            <TextInputField
              name='farm'
              label={t('Farm')}
              disabled = {true}
              placeholder ={t('Select a farm')}
              value = {(request?.farm as any).name || ''}
            />

            <TextInputField
              name='noOfCows'
              disabled = {true}
              value={values.noOfCows}
              label={t('Number of Cows')}
            />

            <TextInputField
              name='pricePerCow'
              disabled = {true}
              value={values.pricePerCow}
              label={t('Price Per Cow')}
            />

            <TextareaField
              name='reasonForPurchase'
              disabled = {true}
              value={values.reasonForPurchase}
              label={t('Reason for Purchase')}
            />

            <TextInputField
              name='calculatedPurchasePrice'
              disabled = {true}
              value={values.calculatedPurchasePrice}
              label={t('Calculated Purchase Price')}
            />

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
                    name='rejectionReason'
                    value={values.rejectionReason}
                    label={t('Rejection Reason')}
                    onChangeText={(rejectionReason) => { setFieldValue('rejectionReason', rejectionReason) }}
                    hasError={errors.rejectionReason && touched.rejectionReason ? true : false}
                    errorMessage={errors.rejectionReason}
                  />
                  <Button
                    sx={{
                      mt: 3
                    }}
                    color="primary"
                    type="submit"
                    onClick={() => { setFieldValue('rejectionMessage', true) ; approval = 'Rejected' ;}}
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
                        onClick={() => {setRejectPopUp(true);}}
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
                        onClick={() => {setFieldValue('rejectionMessage', false); approval = 'Approved'}}
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
