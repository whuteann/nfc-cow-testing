import {
  CircularProgress,
  Card,
  Grid,
  Button,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import {useEffect, useState } from 'react';
import { addTownVillage, updateTownVillage } from '@/services/townvillage/TownVillageServices';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import { index as getDistricts } from '@/services/district/DistrictServices';
import { useSnackbar } from 'notistack';
import router from 'next/router';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Prisma } from '@prisma/client';

interface TownVillageProps {
  single_townvillage?: Prisma.TownVillageCreateInput;
  countries: Prisma.CountryCreateInput[];
}

function TownVillageForm({ 
  single_townvillage, 
  countries 
}:TownVillageProps) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //District dropdown items
  const [districts, setDistricts] = useState([]);

  const townvillage = [
    {
      label: 'Town',
      value: 'Town',
    },
    {
      label: 'Village',
      value: 'Village',
    },
  ]

  //Formik Schema
  const addTownVillageSchema = Yup.object({
    country: Yup.object().required(t('Country is required')),
    district: Yup.object().required(t("District is required")),
    townVillage: Yup.string()
      .min(1, t('Must be 1 character or more'))
      .required(t('Choose a Town/Village type')),
    name: Yup.string()
      .min(1, t('Must be 1 character or more'))
      .required(t('Enter Town/Village name')),
  });

  //Country Dropdown OnChange Function
  async function handleCountryChange(value: any, setFieldValue: any){
    if (value === undefined || ""){
      return;
    }

    setFieldValue("country", value)
    setFieldValue("district",'')
    
    // If chosen country is Pakistan, set townVillage as Village by default
    if (value.name === "Pakistan"){
      setFieldValue("townVillage", 'Village')
    } else {
      setFieldValue("townVillage", '')
    }

    let data = {
      country: value?.name
    }

    getDistricts(data, (districts: Prisma.DistrictCreateInput[]) => {
      setDistricts(districts)
    }, (error: any) => {
      console.error('err', error);
    });
  }

  //District Dropdown OnChange Function
  function handleDistrictChange(value: string, errors: any, values: any, setFieldValue: any){
    if (value == undefined||""){
      return;
    }

    setFieldValue("district", value)
  }

  //Submit Function
  const onSubmit = async (values: any, setSubmitting: any) => {
    return !single_townvillage ?
    createTownVillage(values,setSubmitting)
    : editTownVillage(values,setSubmitting)
  }
  
  //Create Function
  function createTownVillage (values: any,setSubmitting: any) {
    return addTownVillage(values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Town/Village has been successfully added'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push(`/dashboard/townvillages`);
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    })
  }

  //Edit Function
  function editTownVillage (values: any, setSubmitting: any) {
    return updateTownVillage(values , async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Town/Village has been successfully updated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push(`/dashboard/townvillages`);
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    })
  }

  useEffect(() => {
    if(single_townvillage || countries.length === 1) {
      let query = {
        country: (countries.length === 1 ? countries[0].name : (single_townvillage?.district as any)?.country?.name) 
      }

      getDistricts(query, (districts: Prisma.DistrictCreateInput[]) => {
        setDistricts(districts);
      }, (error: any) => {
        console.error('err', error);
      });
    }
  }, [single_townvillage, countries]);

  return (
    <Formik
      initialValues={{
        id: single_townvillage?.id || '',
        country: (single_townvillage?.district as any)?.country || countries?.length === 1 && countries[0] || '',
        district: single_townvillage?.district || '',
        townVillage: single_townvillage?.townVillage || countries[0]?.name === 'Pakistan' && 'Village' || '',
        name: single_townvillage?.name || '',
      }}
      enableReinitialize
      validationSchema={addTownVillageSchema}
      onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
      >
      {({ errors, touched, isSubmitting, setFieldValue, values}) => (
      <Card
        sx={{
          p: 3
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Form>

            <DropdownField 
              items={countries}
              disabled = { countries.length === 1 ? true : false}
              label={t('Country')} 
              placeholder={t('Select a country')}
              value={values.country}
              onChangeValue={(value)=>handleCountryChange(value, setFieldValue)}
              hasError={errors.country && touched.country ? true : false}
              errorMessage={errors.country}
            />

            { values?.country != ''
              ?
                <DropdownField 
                  items={districts}
                  label={t('District')} 
                  placeholder={t('Select a district')}
                  value={values.district}
                  onChangeValue={(value)=>handleDistrictChange(value, errors, values, setFieldValue)}
                  hasError={errors.district && touched.district ? true : false}
                  errorMessage={errors.district}
                />
              :
              <>
              </>
            }
              
              { values?.country == '' || values?.country?.name == 'Pakistan'
                ?
                  <></>
                :
                <DropdownStringField 
                  items={townvillage}
                  label={t('Town/Village')} 
                  value={values.townVillage}
                  onChangeValue={(value)=>setFieldValue("townVillage",value)}
                  hasError={errors.townVillage && touched.townVillage ? true : false}
                  errorMessage={errors.townVillage}
                />
              }

              { values?.country != '' && values?.district != '' 
                ?
                  <TextInputField
                    name='name'
                    value={values.name}
                    label={values.country==="Pakistan" ? t('Village Name'): t('Town/Village Name')}
                    onChangeText={(name) => { setFieldValue('name', name) }}
                    hasError={errors.name && touched.name ? true : false}
                    errorMessage={errors.name}
                  />
                :
                <></>
              }
              
              {
                hasError 
                ?
                  <FormHelperText error={true}>{ errorMessage }</FormHelperText>
                :
                  <></>
              }
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
          
          </Grid>
        </Grid>
      </Card>
    )}
    </Formik>
  );
}

export default TownVillageForm;
