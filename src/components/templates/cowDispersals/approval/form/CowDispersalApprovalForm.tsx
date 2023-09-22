
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { initialValues } from "./CowDispersalApprovalComponents"
import Router from 'next/router';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { updateRequest } from '@/services/cowdispersal/CowDispersalServices';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CowDispersalFamilyApprovalComponent from './CowDispersalFamilyApprovalComponent';
import * as yup from 'yup';

interface CowDispersalProps {
  singleCowDispersal: any,
}

function CowDispersalForm({ 
  singleCowDispersal,
}: CowDispersalProps) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = Router;

  const [RejectPopUp, setRejectPopUp] = useState(false);
  
  const {data : session} = useSession();
  let approval: any = null;

  const validationSchema = yup.object({
    rejectionMessage : yup.bool(),
    rejectionReason: yup.string().nullable()
    .when('rejectionMessage', {
      is: true,
      then: yup.string().required(t("Enter Rejection Reason"))
    })
  });

  const onSubmit = async (values: any, setSubmitting: any) => {
    editRequest(values, setSubmitting);
  }

  function editRequest (values: any , setSubmitting: any) {
    const id = singleCowDispersal.id;
    const rejectionReason = values.rejectionReason
    return updateRequest(id, values, approval, rejectionReason, async () => {
      setSubmitting(false)
      enqueueSnackbar(t("The Request Has Been")+` ${approval} `+t("Successfully"), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      
      router.push(`/dashboard/cow-dispersals/approvals`);
    }, (error: any) => {
      console.error(error)
    })
  };

  return (
    <Formik
      validateOnChange={ false }
      initialValues={ initialValues(singleCowDispersal) }
      validationSchema={validationSchema}
      onSubmit={ (values,{ setSubmitting }) => onSubmit(values, setSubmitting)}
      enableReinitialize
    >
    {({ errors, touched, isSubmitting, setFieldValue, values}) => (
    <>
      <Form>
      <Card
      sx={{
        p: 2,
        m: 1
      }}
      >
        <Box
        sx={{
          pl: 1,
        }}>
          <Typography component="span" variant="subtitle1">
            {t('General')}
          </Typography>{' '}

          <Grid container alignItems="center" gap={1} wrap="nowrap" >
            <Grid xs={6} item={true}>
              <Datepicker
                value={values.date}
                label={t("Disperse Date")}
                disabled={true}
              />
              
            </Grid>
            <Grid xs={6} item={true}>
            </Grid>
          </Grid>

          <CowDispersalFamilyApprovalComponent
            familyCoordinator={singleCowDispersal}  
          />
        </Box>
      </Card>

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
              startIcon={
                isSubmitting ? <CircularProgress size="1rem" /> : null
              }
              disabled={isSubmitting}
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
                  onClick={() => {
                    setRejectPopUp(true);
                    setFieldValue('rejectionMessage', true);
                  }}
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
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={isSubmitting}
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
    </>
    )}
  </Formik>
  )
}

export default CowDispersalForm;
