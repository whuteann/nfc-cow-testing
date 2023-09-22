import * as Yup from 'yup';
import { FC, useState } from 'react';
import { Form, Formik } from 'formik';
import Link from 'src/components/atoms/Link';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import PasswordField from '@/components/atoms/Input/text/inputField/PasswordField';
import { login } from '@/services/auth/AuthServices';
import { useRouter } from 'next/router';

const LoginForm: FC = (props) => {
  const { t }: { t: any } = useTranslation();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .max(255)
      .required(t('The username field is required')),
    password: Yup.string()
      .max(255)
      .required(t('The password field is required')),
    terms: Yup.boolean().oneOf(
      [true],
      t('You must agree to our terms and conditions')
    )
  });

  const onSubmit = async (values: any, setSubmitting: any) => {
    await login(`${values.email.trim()}@carechannels.org`, values.password, (url: string) => {
      setHasError(false);
      setErrorMessage('');
      router.push(url);
    }, (error: string) => {
      setHasError(true);
      setErrorMessage(error);
    });
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
         <Form>
            <TextInputField
              name='email'
              placeholder='Enter username'
              label='Username'
              onChangeText={(email) => { setFieldValue('email', email) }}
              hasError={errors.email && touched.email ? true : false}
              errorMessage={errors.email}
              enableDomainHelper={true}
            />

            <PasswordField
              name='password'
              placeholder='Enter password'
              label='Password'
              onChangeText={(password) => { setFieldValue('password', password) }}
              hasError={errors.password && touched.password ? true : false}
              errorMessage={errors.password}
            />

            <Box alignItems="center" display="flex" justifyContent="space-between">
              <Typography variant="body2">
                <Link href="/auth/recover-password">
                  <b>{t('Lost password?')}</b>
                </Link>
              </Typography>
            </Box>

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
              {t('Sign in')}
            </Button>

            {
              hasError 
              ?
                <FormHelperText error={true}>{ errorMessage }</FormHelperText>
              :
                <></>
            }
         </Form>
      )}
    </Formik>
  );
};

export default LoginForm;