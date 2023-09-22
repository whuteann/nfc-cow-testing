
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { addCowDispersalSchema, initialValues } from "./FamilyTransferRequestComponents"
import Router from 'next/router';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';

import { IFamilyCoordinator } from '@/models/Family';

import { countCows } from '@/services/cow/CowServices';
import { addFamilyTransferRequest } from '@/services/family_transfer/FamilyTransferServices';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { COW_DISPERSED } from '@/types/Status';
import router from 'next/router';

interface FamilyTransferRequestProps {
  families: IFamilyCoordinator[],
}

function FamilyTransferRequestForm({
  families, 
}: FamilyTransferRequestProps) {

  const { t }: { t: any } = useTranslation();
  const router = Router;
  const { enqueueSnackbar } = useSnackbar();

  const [families1, setFamilies1] = useState<IFamilyCoordinator[]>([]);
  const [families2, setFamilies2] = useState<IFamilyCoordinator[]>([]);
  const [cowsAvailable, setCowsAvailable] = useState<number>(0);
  const [slotsAvailable, setSlotsAvailable] = useState<number>(0);

  const handleFamilyChange = (value: any, setFieldValue: any, familiesDropdown: any) => {
    //Remove chosen family from another family dropdown.
    let newFamilies: IFamilyCoordinator[] = [];

    //Remove chosen family from original families array + assign it into newFamilies array
    families.forEach((family: IFamilyCoordinator)=> {
      if(family != value){
        newFamilies = [...newFamilies, family];
      }
    })

    // Set updated newFamilies array into another families dropdown.
    // Update field value.
    if (familiesDropdown == "family1") {
      setFamilies2(newFamilies);
      setFieldValue("family1", value)
      //Count Cows binded to chosen family

      countCows(value.id, 
      COW_DISPERSED,
      (noOfCows: any)=> {
        setCowsAvailable(noOfCows || 0);
      },
      (error: any)=> {
        console.error(error)
      } )
    }
    else {
      setFamilies1(newFamilies);
      setSlotsAvailable(value.noAnimalsAllocated);
      setFieldValue("family2", value)
    }

  }

  function onSubmit (values: any, setSubmitting: any, setFieldError: any){
    let overTransfer: boolean = false;

    const noOfCows = values.noOfCows;
    if(noOfCows>cowsAvailable || noOfCows>slotsAvailable){
      overTransfer = true;
    }
    
    if(overTransfer){
      enqueueSnackbar(t('Number of Cows cannot be more than Cows Available or/and Slots Available.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }

    if(noOfCows === 0 ){
      enqueueSnackbar(t('Please transfer at least 1 cow'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }
    
    createFamilyTransferRequest(values, setSubmitting)
    setSubmitting(false)

  }

  function createFamilyTransferRequest (values: any, setSubmitting: any) {

    const family1Country = values.family1.townVillage.district.country.name;
    const family2Country = values.family2.townVillage.district.country.name;

    if(family1Country == family2Country){
      return addFamilyTransferRequest(values, () => {
        setSubmitting(false);
        enqueueSnackbar(t('The Family Transfer Request Has Been Created Successfully'), {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
        });
        router.push("/dashboard/family-transfer-requests")
      }, (error: any) => {
        console.error(error)
        setSubmitting(false);
      });
    }else{
      enqueueSnackbar(t('Please select families within the same country.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }
  }

  useEffect(() => {
    if(families1.length == 0 || families2.length == 0){
      setFamilies1(families);
      setFamilies2(families);
    }
  }, [families])
  

  return (
    <Formik
      initialValues={initialValues()}
      validationSchema={addCowDispersalSchema(t)}
      onSubmit={ (values: any, { setSubmitting, setFieldError}: any) => onSubmit(values, setSubmitting, setFieldError)}
    >
    {({ errors, touched, isSubmitting, setFieldValue, setFieldError, values}: any) => (
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

            <Grid container alignItems="center" gap={1} wrap={"nowrap"}>
              <Grid xs={6} item={true}>
                <Typography component="span" variant="subtitle1">
                  {t('Transfer from')}
                </Typography>{' '}
                <DropdownField 
                  value={values.family1}
                  items={families1}
                  label={t("Current Family")}
                  onChangeValue={(value: IFamilyCoordinator)=> handleFamilyChange(value, setFieldValue, "family1") }
                  hasError={errors.family1 && touched.family1 ? true : false}
                  errorMessage={errors.family1}
                />
              </Grid>

              <Grid xs={6} item={true}>
                <Typography component="span" variant="subtitle1">
                  {t('To')}
                </Typography>{' '}
                <DropdownField 
                  value={values.family2}
                  items={families2}
                  label={t("New Family")}
                  onChangeValue={(value: IFamilyCoordinator)=> handleFamilyChange(value, setFieldValue, "family2") }
                  hasError={errors.family2 && touched.family2 ? true : false}
                  errorMessage={errors.family2}
                />
              </Grid>
            </Grid>

            <Grid container alignItems="center" gap={1} wrap={"nowrap"}>
              <Grid xs={6} item={true}>
                <Typography component="span" variant="subtitle1">
                  {t('Cows Available: ') + cowsAvailable}
                </Typography>{' '}
              </Grid>
              <Grid xs={6} item={true}>
                <Typography component="span" variant="subtitle1">
                  {t('Slots Available: ') + slotsAvailable}
                </Typography>{' '}
              </Grid>
            </Grid>

            <Grid container alignItems="center" gap={1} wrap={"nowrap"}>
              <Grid xs={6} item={true}>
                <Datepicker
                  value={values.date}
                  label={t("Transfer Date")}
                  onChangeDate={(value: any)=>setFieldValue("date", value)}
                  hasError={errors.date && touched.date ? true : false}
                  errorMessage={errors.date}
                />
              </Grid>
              <Grid xs={6} item={true}>
                <TextInputField 
                  name="Slots Available"
                  value={values.noOfCows}
                  label={t("Number of Cows: ")}
                  onChangeText={(value: any) => {
                    setFieldValue("noOfCows", value);
                  }}
                  hasError={errors.noOfCows && touched.noOfCows ? true : false}
                  errorMessage={errors.noOfCows}
                />
              </Grid>
            </Grid>
          </Box>
        </Card>

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

export default FamilyTransferRequestForm;
