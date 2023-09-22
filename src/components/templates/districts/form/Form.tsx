import {
  CircularProgress,
  Card,
  Grid,
  Button,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import {Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { create, edit } from '@/services/district/DistrictServices';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';

interface formProps {
  district?: Prisma.DistrictCreateInput;
  countries: Prisma.CountryCreateInput[];
}

function DistrictForm({
  district,
  countries
}:formProps) {

  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const addDistrictSchema = Yup.object({
    name: Yup.string()
      .min(1, t('Must be 1 character or more'))
      .required(t('District name is required')),
    country: Yup.object().shape({
      id: Yup.string().required(t('Country is required'))
    })
  });

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (values: any, setSubmitting: any) => {
    if(!district) {
      return await createDistrict(values, setSubmitting);
    }
    
    return await updateDistrict(values, setSubmitting);
  }

  const createDistrict = (data: any, setSubmitting: any) => {
    return create(data, () => {
      router.push(`/dashboard/districts`);
      setSubmitting(false);
      
      enqueueSnackbar(t('The district has been created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    });
  }

  const updateDistrict = (data: any, setSubmitting: any) => {
    return edit(data, () => {
      router.push(`/dashboard/districts`);
      setSubmitting(false);
      
      enqueueSnackbar(t('The district has been updated successfully'), {
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
            id: district?.id || '',
            country: (!district ? countries.length === 1 && countries[0] : district?.country) || {},
            name: district?.name || '',
          }}
          enableReinitialize
          validationSchema={addDistrictSchema}
          onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values}) => (
            <Form>

            <DropdownField
              label={t('Country')}
              disabled = { countries.length === 1 ? true : false}
              items = {countries}
              placeholder ={t('Select a country')}
              value = {values.country}
              onChangeValue = {( country ) => { setFieldValue ('country', country)} }
              hasError={errors.country && touched.country ? true : false}
              errorMessage={(errors.country as any)?.id}

            />

            <TextInputField
              name='name'
              value={values.name}
              label={t('District Name')}
              onChangeText={(name) => { setFieldValue('name', name) }}
              hasError={errors.name && touched.name ? true : false}
              errorMessage={errors.name}
            />
      
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
          )}
        </Formik>
        </Grid>
      </Grid>
    </Card>
  );
}

export default DistrictForm;
