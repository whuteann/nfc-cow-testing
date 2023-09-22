import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import PasswordField from '@/components/atoms/Input/text/inputField/PasswordField';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import {edit, editPassword } from '@/services/user/UserServices';
import Router from 'next/router';
import { COORDINATOR_ROLE, COUNTRY_MANAGER_ROLE, FARM_STAFF_ROLE, SUPERVISOR_ROLE } from '@/types/Common';
import _ from 'lodash';
import { useState } from 'react';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { useSnackbar } from 'notistack';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import { IUser } from '@/models/User';
import { useSession } from 'next-auth/react';
import { updateSession } from '@/helpers/app';
import { Prisma } from '@prisma/client';
import { useS3Upload } from 'next-s3-upload';

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

function ProfileForm ({
  user,
}: formProps) {
  const router = Router;
  const [modifiedUser, setModifiedUser] = useState(user);

  const { enqueueSnackbar } = useSnackbar();
  const { t }: { t: any } = useTranslation();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  let { uploadToS3 } = useS3Upload();

  const handleUpload = async (field: string, file: any, setFieldValue: any, values) => {

    if (file){
      let { url } = await uploadToS3(file)    
      setFieldValue(field, url)
      setModifiedUser({
        // ...modifiedUser,
        ...values,
        image: url
      })

    }
  }

  const oldImage = user?.image

  const updateData = (newUser: any) => {
    return({
      id: newUser?.id || '',
      userImage: newUser?.image ? true : false,
      image: newUser?.image || null,
      firstName: newUser?.firstName || '',
      lastName: newUser?.lastName || '',
      email: newUser?.email || '',
      role: newUser?.role || '',
      countries: newUser?.countries || [],
      farms: newUser?.farms || [],
    })
  }

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required(t('firstName is required')),
    lastName: yup
      .string()
      .required(t('lastName is required')),
    email: yup
      .string()
      .email(t('Enter a valid email'))
      .required(t('Email is required')),
    role: yup
      .string().required(t('Role is required')),
    image: yup
      .mixed()
      .nullable(),
  })

  const onSubmitPasswordForm = async (values: any, setSubmitting: any, resetForm: any) => {
    return editPassword(values, async (user) => {
      setSubmitting(false);
      resetForm();
      await updateSession();
      enqueueSnackbar(t('The user has been updated successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    }, (error: any) => {
      enqueueSnackbar(t('Old Password does not match with current password'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false);
    })
  }

  const onSubmitGeneralForm = async (values: any, setSubmitting: any) => {
    return edit(oldImage, values, async (user) => {
      setSubmitting(false);
      enqueueSnackbar(t('The user has been updated successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      updateSession();
      router.push("/")
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    })
  }

  const GeneralForm = ({
    user
  } : any) => {
    return(
      <div>
      <Formik
        initialValues={{
          id: user?.id || '',
          userImage: user?.image ? true : false,
          image: user?.image || null,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          role: user?.role ? user?.role : user?.farmRole,
          countries: user?.countries || [],
          farms: user?.farms || [],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => onSubmitGeneralForm(values, setSubmitting)}
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
                {t("User Profile")}
              </Typography>
              <Typography variant="subtitle2">
                {t("Edit general details")}
              </Typography>
            </Box>
            {
              values.userImage && 
              <div className="py-3" >
                <div className='py-2 flex justify-center'>
                  <Typography variant='subtitle2'>
                      {t("Current Avatar Image")+":"}
                  </Typography>
                </div>

                <div className='flex justify-center'>
                  <Avatar sx = {{width: 150, height: 150, fontSize: '60px'}} className="border-solid border-2 border-black" src = {user?.image} alt=""> 
                    {user?.firstName[0]}  
                  </Avatar>
                </div>

                <div className='flex justify-center'>
                  { 
                    values.userImage && 
                    <Box>
                      <Button
                        sx={{
                          mt: 1
                        }}
                        color="error"
                        onClick={() => {
                          setFieldValue('image', null);
                          setFieldValue("userImage", false)
                        }}
                        size="large"
                        variant="contained"
                      >
                        {t('Delete Image')}
                      </Button>
                    </Box>
                  }
                </div>
              </div>
            }
          {
            !values.userImage && 
            <SingleFile
              cropper={true}
              onUpload = {(image) => { handleUpload('image', image, setFieldValue, values) }}
              label = {t('Avatar Image')}
              value = {values.image}
              hasError={errors.image && touched.image ? true : false}
              errorMessage={errors.image}
              enablePreview={false}
            />
          }
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInputField
                name='firstName'
                placeholder={t('Enter First name')}
                label={t('First name')}
                disabled={true}
                value={values.firstName}
                onChangeText={(firstName) => { setFieldValue('firstName', firstName)}}
                hasError={errors.firstName && touched.firstName ? true : false}
                errorMessage={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInputField
                name='lastName'
                placeholder={t('Enter Last name')}
                disabled={true}
                label={t('Last name')}
                value={values.lastName}
                onChangeText={(lastName) => { setFieldValue('lastName', lastName)}}
                hasError={errors.lastName && touched.lastName ? true : false}
                errorMessage={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInputField
                name='email'
                placeholder={t('Enter email')}
                label={t('Email address')}
                value={values.email}
                disabled={true}
                onChangeText={(email) => { setFieldValue('email', email) }}
                hasError={errors.email && touched.email ? true : false}
                errorMessage={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}> 
              <DropdownStringField 
                disabled = {true}
                items={userRoles}
                label={t('Role')}
                placeholder={t('Select a role')}
                value={values.role}
                onChangeValue={(role) => { setFieldValue('role', role)}}
                hasError={errors.role && touched.role ? true : false}
                errorMessage={errors.role}
              />
            </Grid>
          </Grid>
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
            {('Edit Account')}
          </Button>
        </Card>
      </Form>
      )}
    </Formik>
    </div>
    );
  };

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
      <GeneralForm user = {modifiedUser}/>
      <PasswordForm/>
    </div>
  )
}

export default ProfileForm;
