import {
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import PasswordField from '@/components/atoms/Input/text/inputField/PasswordField';
import { editPassword } from '@/services/user/UserServices';
import Router from 'next/router';
import { COORDINATOR_ROLE, COUNTRY_MANAGER_ROLE, FARM_STAFF_ROLE, SUPERVISOR_ROLE } from '@/types/Common';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';
import { updateSession } from '@/helpers/app';

const userRoles = [
  {
    label: COUNTRY_MANAGER_ROLE,
    value: COUNTRY_MANAGER_ROLE,
  },
  {
    label: SUPERVISOR_ROLE,
    value: SUPERVISOR_ROLE,
  },
  {
    label: FARM_STAFF_ROLE,
    value: FARM_STAFF_ROLE,
  },
  {
    label: COORDINATOR_ROLE,
    value: COORDINATOR_ROLE,
  },
]

interface formProps {
  user?: Prisma.UserCreateInput
}

function ChangePasswordForm ({
  user,
}: formProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { t }: { t: any } = useTranslation();
  const router = Router;


  const onSubmitPasswordForm = async (values: any, setSubmitting: any, resetForm: any) => {
    return editPassword(values, async (user) => {
      setSubmitting(false);
      resetForm();
      await updateSession();
      router.push("/");
      enqueueSnackbar(t('The user has been updated successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    }, (error: any) => {
      enqueueSnackbar(error, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false);
    })
  }


  const PasswordForm = () => {
    return(
      <div>
      <Formik
        initialValues={{
          id: user?.id || '',
          oldPassword: '', 
          newPassword: '', 
          confirmPassword: '', 
        }}
        enableReinitialize
        validationSchema={
          yup.object({          
            oldPassword: yup
            .string()
            .min(8, t('Password should be of minimum 8 characters length')),
            newPassword: yup
            .string()
            .min(8, t('Password should be of minimum 8 characters length')),
            confirmPassword: yup
            .string()
            .oneOf([yup.ref('newPassword'), null], 'New Password and Confirm Password must match')
          })
        }
        onSubmit={ (values, { setSubmitting, resetForm }) => onSubmitPasswordForm(values, setSubmitting, resetForm)}
      >
        {({ errors, values, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <Card       
            sx={{
              p: 2,
              m: 1
            }}>
  
              <Box>
                <Typography variant="h3" component="h3" gutterBottom>
                  {t("Change new password")}
                </Typography>
              </Box>

              <PasswordField
                name='oldPassword'
                placeholder={t('Old password')}
                label={t('Old Password')}
                value={values.oldPassword}
                onChangeText={(oldPassword) => { setFieldValue('oldPassword', oldPassword) }}
                hasError={errors.oldPassword && touched.oldPassword ? true : false}
                errorMessage={errors.oldPassword}
              />

              <PasswordField
                name='newPassword'
                placeholder={t('New password')}
                label={t('New Password')}
                value={values.newPassword}
                onChangeText={(newPassword) => { setFieldValue('newPassword', newPassword) }}
                hasError={errors.newPassword && touched.newPassword ? true : false}
                errorMessage={errors.newPassword}
              />

              <PasswordField
                name='confirmPassword'
                placeholder={t('Confirm password')}
                label={t('Confirm Password')}
                value={values.confirmPassword}
                onChangeText={(confirmPassword) => { setFieldValue('confirmPassword', confirmPassword) }}
                hasError={errors.confirmPassword && touched.confirmPassword ? true : false}
                errorMessage={errors.confirmPassword}
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
                type ="submit"
                fullWidth
                size ="large"
                variant="contained"
              >
                {('Change Password')}
              </Button>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
    )  
  }

  return (
    <div>
      <PasswordForm/>
    </div>
  )
}

export default ChangePasswordForm;
