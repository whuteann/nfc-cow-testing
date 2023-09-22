import {
  CircularProgress,
  Card,
  Grid,
  Button,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { create, edit } from '@/services/country/CountryServices';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';

interface formProps {
  country?: Prisma.CountryCreateInput;
}

function CountryForm({country}: formProps) {

  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const addCountrySchema = Yup.object({
    name: Yup.string()
        .min(1, t('Must be 1 character or more'))
        .required(t('Required')),
  });

  const onSubmit = async (values: any, setSubmitting: any) => {
    if(!country) {
      return await createCountry(values, setSubmitting);
    }
    
    return await updateCountry(values, setSubmitting);
  }

  function createCountry (values: any, setSubmitting: any) {
    return create(values, () => {
      router.push(`/dashboard/countries`);
      
      enqueueSnackbar(t('The country has been created successfully'), {
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

  function updateCountry (values: any, setSubmitting: any) {
    return edit(values, () => {
      router.push(`/dashboard/countries`);
      
      enqueueSnackbar(t('The country has been updated successfully'), {
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
              id: country?.id || undefined,
              name: country?.name|| ''
            }}
            validationSchema={addCountrySchema}
            onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
            enableReinitialize
          >
          {({ errors, touched, isSubmitting, setFieldValue, values}) => (
          <Form>

          <TextInputField
              name='name'
              value={values.name}
              label={t('Country Name')}
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

export default CountryForm;
