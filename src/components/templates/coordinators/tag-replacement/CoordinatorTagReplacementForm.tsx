import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Button, CircularProgress, Grid } from '@mui/material';
import PersonalDetailForm from '../form/partials/PersonalDetailForm';
import { useSnackbar } from 'notistack';
import { addCoordinatorSchema, initialValues } from "../form/CoordinatorComponents"
import { updateFamilyCoordinatorNfc } from '@/services/family/FamilyServices';
import Router from 'next/router';
import { IFamilyCoordinator } from '@/models/Family';
import { IUser } from '@/models/User';
import { Prisma } from '@prisma/client';
import { useState } from 'react';

interface CoordinatorProps {
  single_coordinator?: Prisma.FamilyCreateInput,
  supervisors?: Prisma.UserCreateInput[],
  userCountries?: Prisma.CountryCreateInput[],
}

function CoordinatorTagReplacementForm({ single_coordinator, supervisors, userCountries }: CoordinatorProps) {

  // TO DO
  // Filter Supervisors via Country (client side)



  const { t }: { t: any } = useTranslation();

  const router = Router;

  const { enqueueSnackbar } = useSnackbar();

  const oldHeadshot = single_coordinator?.headshot
  const oldFamilyPhoto = single_coordinator?.familyPhoto
  const oldHousePhoto = single_coordinator?.housePhoto
  const oldContractForm = single_coordinator?.contractForm
  const oldApplicationForm = single_coordinator?.applicationForm

  const [nfcError, setNfcError] = useState(false);

  const onSubmit = async (values: any, setSubmitting: any, setFieldError: any) => {
    if (!values.newNfcID || values.newNfcID?.trim() == '') {
      setNfcError(true);
      return enqueueSnackbar(t('Blank NFC ID is not allowed.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    }

    setNfcError(false);

    // const result = await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families?nfcID=${values.newNfcID}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then(async (res: any) => {
    //     if (!res.ok) {
    //       return Promise.reject(res);
    //     }

    //     return res.json();
    //   })
    //   .catch(error => {
    //   });

    // if (result.data.length != 0) {
    //   return enqueueSnackbar('NFC ID ' + values.newNfcID + t(' has already been taken. Please enter a new NFC ID.'), {
    //     variant: 'error',
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right'
    //     },
    //   });
    // }

    values.nfcID = values.newNfcID;
    values.status = single_coordinator.status;

    //Convert supervisor object to objectID only.
    values.supervisor = values.supervisor.id;

    editCoordinator(single_coordinator.id, values, setSubmitting, setFieldError);
  }

  function editCoordinator(id: any, values: any, setSubmitting: any, setFieldError: any) {
    return updateFamilyCoordinatorNfc(id, values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The coordinator has been successfully updated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      router.push("/dashboard/coordinators/tag-replacement")
    }, (error: any) => {
      if (!error.data.nfcID){
        enqueueSnackbar(t('Something went wrong, please try again'), {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
        });
      } else {
        setFieldError('nfcID', error.data.nfcID)
        enqueueSnackbar(t('Please enter a unique National ID'), {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
        });
      }
    })
  }

  return (
    <Formik
      initialValues={initialValues(single_coordinator as any, userCountries.length === 1 && userCountries[0])}
      validationSchema={addCoordinatorSchema(t)}
      onSubmit={(values, { setSubmitting, setFieldError }) => onSubmit(values, setSubmitting, setFieldError)}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <>
          <Form>
            <Grid container spacing={2}>
              {
                ((values.country === "Pakistan") || (values.country === "Bangladesh" && values.houseType != ''))
                &&
                <>
                  <Grid item xl={12}>
                    <PersonalDetailForm
                      single_coordinator={single_coordinator}
                      supervisors={supervisors}
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      disabled
                      nfcError={nfcError}
                      replaceNfc={true}
                    />
                  </Grid>
                </>
              }
            </Grid>

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
              fullWidth
              size="large"
              variant="contained"
            >
              {t('Submit')}
            </Button>

          </Form>

        </>
      )}
    </Formik>
  )
}

export default CoordinatorTagReplacementForm;
