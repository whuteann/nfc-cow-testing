
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { addCowDispersalSchema, initialValues } from "./CowDispersalAssignComponents";
import Router from 'next/router';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import PakistanForm from './partials/pakistan/PakistanForm';
import BangladeshForm from './partials/bangladesh/BangladeshForm';
import { completeCowDispersal } from '@/services/cowdispersal/CowDispersalServices';

import { ScrollToFieldError } from '@/components/atoms/Formik/ScrollToFieldError';
import { Prisma } from '@prisma/client';
import { values } from 'lodash';
import { useEffect, useState } from 'react';

interface CowDispersalProps {
  cowDispersal: Prisma.CowDispersalCreateInput,
}

function CowDispersalAssignForm({
  cowDispersal,
}: CowDispersalProps) {
  const { t }: { t: any } = useTranslation();
  const router = Router;
  const { enqueueSnackbar } = useSnackbar();

  const [cows, setCows] = useState(null)

  const onSubmit = async (values: any, setSubmitting: any, setErrors: any) => {
    return assignCows(values, setSubmitting, setErrors)
  }

  function assignCows(values: any, setSubmitting: any, setErrors: any) {
    setCows(values.cows)

    let successText: string = '';
    //Set Edit to true or false
    values.edit = false;
    successText = t("New Cows Has Been Created and Assigned Successfully");

    //Check for duplicates if choosing exisiting cows
    let duplicateCows = false
    const cows = values.cows

    cows.forEach((cow: any, index: any) => {
      const nfcId = cow.nfc
      const cowIndex = index
      cows.forEach((cow: any, index: any) => {
        if (cowIndex != index && cow.nfcId === nfcId) {
          duplicateCows = true
        }
      });
    })

    if (duplicateCows) {
      setSubmitting(false);
      enqueueSnackbar(t('Duplicate Cows Found, Please Make Sure All Cows Chosen Are Different'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      return
    }

    if (values.cows.length > cowDispersal?.noOfCows) {
      setSubmitting(false);
      enqueueSnackbar(t("You cannot assign more than") + ` ${cowDispersal?.noOfCows} ` + t("cows"), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      return
    }

    return completeCowDispersal(cowDispersal, values, () => {
      setSubmitting(false);
      enqueueSnackbar(t(successText), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push(`/dashboard/cow-dispersals/assign-cows`);
    }, (error: any) => {
      console.error(error);
      const obj = JSON.parse(error);

      setErrors("nfcId", obj?.data);

      enqueueSnackbar(t(`${obj?.data}`), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    });
  }

  return (
    <Formik
      validateOnChange={true}
      initialValues={initialValues(cowDispersal)}
      validationSchema={addCowDispersalSchema(t)}
      onSubmit={(values, { setSubmitting, setErrors }) => onSubmit(values, setSubmitting, setErrors)}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue, setErrors, values }) => (
        <>
          <Form>
            <ScrollToFieldError />
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
                  {t('Cow Dispersal Data')}
                </Typography>{' '}

                <Grid container alignItems="center" gap={1} wrap="nowrap" >
                  <Grid xs={6} item={true}>
                    <Datepicker
                      value={values?.date}
                      label={t("Disperse Date")}
                      disabled={true}
                    />

                  </Grid>
                  <Grid xs={6} item={true}>
                  </Grid>
                </Grid>

                <Grid container alignItems="center" gap={1} wrap="nowrap" >
                  <Grid xs={4} item={true}>
                    <TextInputField
                      name='family'
                      value={values?.family}
                      label={t("Family Name")}
                      disabled={true}
                    />
                  </Grid>

                  <Grid xs={4} item={true}>
                    <TextInputField
                      name='village_town'
                      value={values?.townVillage}
                      label={t("Village / Town")}
                      disabled={true}
                    />
                  </Grid>

                  <Grid xs={4} item={true}>
                    <TextInputField
                      name="cowsDispersed"
                      value={values?.noOfCows}
                      label={t("Number of Cows Dispersed")}
                      disabled={true}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>

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
                  {t('Cow')}
                </Typography>{' '}

                <Grid container alignItems="center" gap={1} wrap="nowrap" >
                  <Grid xs={12} item={true}>
                    <TextInputField
                      name='country'
                      label={t('Country')}
                      placeholder={t('Select a country.')}
                      value={`${values.country.name}`}
                      disabled={true}
                      hasError={errors.country && touched.country ? true : false}
                      errorMessage={errors.country}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {
              values?.country?.name == "Pakistan"
                ?
                <PakistanForm
                  cowDispersal={cowDispersal}
                  values={values}
                  setFieldValue={setFieldValue}
                  setErrors={setErrors}
                  errors={errors}
                  touched={touched}
                />
                :
                <BangladeshForm
                  cowDispersal={cowDispersal}
                  values={values}
                  setFieldValue={setFieldValue}
                  setErrors={setErrors}
                  errors={errors}
                  touched={touched}
                />
            }
            {
              values.status == "Completed"
                ?
                <></>
                :
                <Button
                  sx={{
                    mt: 3
                  }}
                  color="primary"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={(isSubmitting || values.cows.length < 1) ? true : false}
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                >
                  {t('Submit')}
                </Button>
            }
          </Form>
        </>
      )}
    </Formik>
  )
}

export default CowDispersalAssignForm;
