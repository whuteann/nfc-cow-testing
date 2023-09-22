
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { addCowDispersalSchema, initialValues } from "./CowDispersalComponents"
import Router from 'next/router';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import CowDispersalFamilyComponent from './partials/CowDispersalFamilyComponent';
import { addCowDispersal } from '@/services/cowdispersal/CowDispersalServices';

import { ITownVillage } from '@/models/TownVillage';
import { IFamilyCoordinator } from '@/models/Family';

import { 
  familyAdvanceFilter,
} from '@/services/family/FamilyServices';

interface CowDispersalProps {
  townvillages: ITownVillage[],
  families: any[],
}

function CowDispersalForm({
  townvillages, 
  families
}: CowDispersalProps) {
  const { t }: { t: any } = useTranslation();
  const router = Router;
  const { enqueueSnackbar } = useSnackbar();

  const [townVillageDropdown, setTownVillageDropdown] = useState<ITownVillage[]>([]);
  const [familyCoordinatorDropdown, setFamilyCoordinatorDropdown] = useState<IFamilyCoordinator[]>();

  useEffect(()=>{
    setFamilyCoordinatorDropdown(families);
  },[families])

  const familyTypes = [
    {
      label: "All",
      value: "All",
    },
    {
      label: "New",
      value: "New",
    },
    {
      label: "Old with cows dispersed currently",
      value: "Old with cows dispersed currently",
    },
    {
      label: "Old with no cows dispersed currently",
      value: "Old with no cows dispersed currently",
    },
    
  ]  

  function onSubmit (values: any, setSubmitting: any, setFieldError: any){
    let overDispersed: boolean = false;
    const familiesCoordinators: any = values.familiesCoordinators;
    for(var i=0; i<familiesCoordinators.length; i++){
      if(familiesCoordinators[i].family.noAnimalsAllocated < parseInt(familiesCoordinators[i].noOfCows)){
        overDispersed= true;
      }
    }

    if(overDispersed){
      enqueueSnackbar(t('No of Cows cannot be more than No. Animals Allocated'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }

    if(values.familiesCoordinators.length === 0 ){
      enqueueSnackbar(t('Please disperse at least 1 record'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }
    
    createCowDispersal(values, setSubmitting)
  }

  function createCowDispersal (values: any, setSubmitting: any) {
    return addCowDispersal(values, () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Cow Dispersal Record Has Been Created Successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push("/dashboard/cow-dispersals")
    }, (error: any) => {
      console.error(error)
      setSubmitting(false);
    });
  }

  
  const handleFilterChange = async (data: any, setFieldValue: any) => {
    await familyAdvanceFilter(data.familyType, data.townVillage?.id || '', data.name, (familiesCoordinators: IFamilyCoordinator[]) => {
      setFamilyCoordinatorDropdown(familiesCoordinators);
    }, (error: any) => {
      console.error('err', error);
    });
  }
  

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
            <Typography component="span" variant="subtitle1">
              {t('General')}
            </Typography>{' '}

            <Grid container alignItems="center" gap={1} wrap="nowrap" >
              <Grid xs={6} item={true}>
                <Datepicker
                  value={values.date}
                  label={t("Disperse Date")}
                  onChangeDate={(value)=>setFieldValue("date", value)}
                  hasError={errors.date && touched.date ? true : false}
                  errorMessage={errors.date}
                />
                
              </Grid>
              <Grid xs={6} item={true}>
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
              {t('Advanced Filter')}
            </Typography>{' '}

            <Grid container alignItems="center" gap={1} wrap="nowrap" >
              <Grid xs={4} item={true}>
                <DropdownStringField 
                  value={values.familyType}
                  items={familyTypes}
                  label={t("Family Types")}
                  onChangeValue={(value: any) => {
                    setFieldValue("familyType", value);
                    
                    let data = {
                      familyType: value,
                      townVillage: values.townVillage,
                      name: values.name
                    }

                    handleFilterChange(data, setFieldValue);
                  }}
                />
              </Grid>
            
              <Grid xs={4} item={true}>
                <DropdownField 
                  value={values.townVillage}
                  items={townvillages}
                  label={t("Village / Town")}
                  onChangeValue={(value: any) => {
                    setFieldValue("townVillage", value);

                    let data = {
                      familyType: values.familyType,
                      townVillage: value,
                      name: values.name
                    }

                    handleFilterChange(data, setFieldValue);
                  }}
                />
              </Grid>

              <Grid xs={4} item={true}>
                <TextInputField 
                  name="name"
                  value={values.name}
                  label={t("Name")}
                  onChangeText={(value: any) => {
                    setFieldValue("name", value);
                    let data = {
                      familyType: values.familyType,
                      townVillage: values.townVillage,
                      name: value
                    }

                    handleFilterChange(data, setFieldValue);
                  }}
                />
              </Grid>
            </Grid>

            <CowDispersalFamilyComponent
              values={values}
              filteredFamiliesCoordinators={familyCoordinatorDropdown}
              setFieldValue={setFieldValue}
              setFieldError={setFieldError}
              errors={errors}
              touched={touched}
            /> 
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

export default CowDispersalForm;
