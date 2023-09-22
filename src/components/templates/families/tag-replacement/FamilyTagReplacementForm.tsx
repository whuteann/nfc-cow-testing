import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Button, CircularProgress, Grid } from '@mui/material';
import PersonalDetailForm from '../form/partials/PersonalDetailForm';
import { useSnackbar } from 'notistack';
import { addFamilySchema, initialValues } from "../form/FamilyComponents"
import { updateFamilyCoordinatorNfc } from '@/services/family/FamilyServices';
import Router from 'next/router';
import { IFamilyCoordinator } from '@/models/Family';
import { Prisma } from '@prisma/client';
import { id } from 'date-fns/locale';

interface FamilyProps {
  single_family?: Prisma.FamilyCreateInput,
  coordinators: Prisma.UserCreateInput[],
  userCountries: Prisma.CountryCreateInput[],
}

function FamilyTagReplacementForm({
  single_family,
  userCountries,
  coordinators,
}: FamilyProps) {
  const { t }: { t: any } = useTranslation();
  const router = Router;

  // Coordinator Responsive Array Object
  const [coordinatorDropdown, setCoordinatorDropdown] = useState<Prisma.UserCreateInput[]>(coordinators);

  const { enqueueSnackbar } = useSnackbar();

  const oldHeadshot = single_family?.headshot
  const oldFamilyPhoto = single_family?.familyPhoto
  const oldHousePhoto = single_family?.housePhoto
  const oldContractForm = single_family?.contractForm
  const oldApplicationForm = single_family?.applicationForm

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
    values.status = single_family.status;

    return await editFamily(single_family.id, values, setSubmitting, setFieldError);
  }

  function editFamily(id: any, values: any, setSubmitting: any, setFieldError: any) {
    return updateFamilyCoordinatorNfc(id, values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The family has been successfully updated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      router.push("/dashboard/families/tag-replacement")
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
      initialValues={initialValues(single_family as any, userCountries.length === 1 && userCountries[0])}
      validationSchema={addFamilySchema(t)}
      enableReinitialize
      onSubmit={(values, { setSubmitting, setFieldError }) => onSubmit(values, setSubmitting, setFieldError)}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <>
          <Form>
            <Grid container spacing={2}>
              {
                (values.country === "Pakistan" || (values.country === "Bangladesh" && values.houseType != ''))
                &&
                <Grid item xl={12}>
                  <PersonalDetailForm
                    single_family={single_family}
                    coordinators={coordinatorDropdown}
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    replaceNfc={true}
                    nfcError={nfcError}
                    disabled
                  />
                </Grid>
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

export default FamilyTagReplacementForm;
