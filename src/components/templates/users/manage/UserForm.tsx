import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Slide,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import PasswordField from '@/components/atoms/Input/text/inputField/PasswordField';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { create, edit } from '@/services/user/UserServices';
import Router from 'next/router';
import { ASSISTANT_COUNTRY_LEAD_ROLE, COORDINATOR_ROLE, COUNTRY_LEAD_ROLE, COUNTRY_MANAGER_ROLE, FARM_LEAD_ROLE, FARM_STAFF_ROLE, OFFICE_ADMIN_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from '@/types/Common';
import DropdownMultiple from '@/components/atoms/Input/dropdown/DropdownMultiple';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { useSnackbar } from 'notistack';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import { useSession } from 'next-auth/react';
import { index as getFarmsFromDatabase } from '@/services/farm/FarmServices';
import { updateSession } from '@/helpers/app';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import { Prisma } from '@prisma/client';
import { useS3Upload } from 'next-s3-upload';
import { index as getFamilies, paginateDropdown } from '@/services/family/FamilyServices';
import router from 'next/router';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';

interface UserFormProps {
  user?: Prisma.UserCreateInput
  countries: Prisma.CountryCreateInput[],
  teamLeads: Prisma.UserCreateInput[],
}

function UserForm({
  user = undefined,
  countries,
  teamLeads,
}: UserFormProps) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = Router;

  const [initLoad, setInitLoad] = useState<boolean>(false);
  // const [showFarms, setShowFarms] = useState<boolean>(false);
  const [selectedFarms, setSelectedFarms] = useState<any>([]);
  const [affectedFamilies, setAffectedFamilies] = useState<any>([]);
  const [coordinators, setCoordinators] = useState<any>([]);
  const [showReassignDialog, setShowReassignDialog] = useState(false)
  const ref = useRef(null);
  const [userImage, setUserImage] = useState(null);
  const oldImage = user?.image;
  const { data: session } = useSession();

  let { uploadToS3 } = useS3Upload();

  const handleUpload = async (field: string, file: any, setFieldValue: any) => {


    if (file) {
      let { url } = await uploadToS3(file)
      setFieldValue(field, url)


    }
  }

  const addUserSchema = yup.object({
    edit: yup.boolean(),
    isSupervisor: yup.boolean(),
    farmRoleSelect: yup.boolean(),
    mainRoleSelect: yup.boolean(),

    firstName: yup
      .string()
      .required(t('firstName is required')),
    lastName: yup
      .string()
      .required(t('lastName is required')),
    email: yup
      .string()
      .required(t('Email is required'))
      .test(
        'isValidEmail',
        'Enter a valid email',
        (value) => {
          return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value + '@carechannels.org');
        }),
    password: yup
      .string()
      .min(8, t('Password should be of minimum 8 characters length'))
      .when("edit", {
        is: false,
        then: yup.string()
          .min(8, t('Password should be of minimum 8 characters length'))
          .required(t('Password is required'))
      }),
    role: yup
      .string()
      .when("farmRoleSelect", {
        is: false,
        then: yup.string()
          .required(t('Please choose at least one role/farm role'))
      }),
    status: yup
    .string()
    .required('Please select a status'),
    farm_role: yup
      .string()
      .when("mainRoleSelect", {
        is: false,
        then: yup.string()
          .required(t('Please choose at least one role/farm role'))
      }),
    team_lead: yup
      .object()
      .when("isSupervisor", {
        is: true,
        then: yup.object()
          .required(t('Team lead is required')),
      }),

    image: yup
      .mixed()
      .nullable()
  });

  useEffect(() => {
    setUserImage(user?.image ? true : false);
  }, [user?.image]);

  // useEffect(()=>{
  //   if(user?.farmRole){

  //     setShowFarms(true);
  //   } else {
  //     setShowFarms(false);
  //   }
  // }, [user?.farmRole])

  useEffect(() => {
    if (session != undefined && initLoad != true) {
      setInitLoad(true);
      getFarms((session as any)?.currentUser?.countries);
    }
  }, [session]);

  const statuses = [
    {
      label: "Active",
      value: "Active"
    },
    {
      label: "Inactive",
      value: "Inactive"
    }
  ]
  const upperRoles = [
    {
      label: "-",
      value: ""
    },
    {
      label: COUNTRY_MANAGER_ROLE,
      value: COUNTRY_MANAGER_ROLE,
    },
    {
      label: COUNTRY_LEAD_ROLE,
      value: COUNTRY_LEAD_ROLE,
    },
    {
      label: ASSISTANT_COUNTRY_LEAD_ROLE,
      value: ASSISTANT_COUNTRY_LEAD_ROLE,
    },
    {
      label: OFFICE_ADMIN_ROLE,
      value: OFFICE_ADMIN_ROLE,
    },
    {
      label: TEAM_LEAD_ROLE,
      value: TEAM_LEAD_ROLE,
    },
    {
      label: SUPERVISOR_ROLE,
      value: SUPERVISOR_ROLE,
    },
    {
      label: COORDINATOR_ROLE,
      value: COORDINATOR_ROLE,
    },
  ]

  const farmRoles = [
    {
      label: "-",
      value: ""
    },
    {
      label: FARM_LEAD_ROLE,
      value: FARM_LEAD_ROLE,
    },
    {
      label: FARM_STAFF_ROLE,
      value: FARM_STAFF_ROLE,
    },
  ]

  const getFarms = (countries: Prisma.CountryCreateInput[], setFieldValue: any = null) => {
    const countryNames = countries?.map((country) => country?.name);
    let query = {
      countries: countryNames,
      filterCountry: false,
      filterFarm: false
    }
    getFarmsFromDatabase(query, (farms: Prisma.FarmCreateInput[]) => {
      var filteredTiedFarms: any = [];

      _.forEach(ref.current.values.farms, function (n, key) {
        _.forEach(farms, function (n2, key2) {
          if (n.id === n2.id) {
            filteredTiedFarms.push(n);
            return;
          }
        });
      });
      if (setFieldValue) {
        setFieldValue('farms', filteredTiedFarms);
      }
      setSelectedFarms(farms);
    }, (error: any) => {
      console.error('err', error);
    });
  }

  const getCoordinators = async (localSearch: string = '', country: string = '') => {
    await paginateDropdown(user.id, localSearch, 'Coordinator', country, (data: any) => {
      setCoordinators(data || []);
      return data
    }, (err: any) => {
      console.error('err', err);
    });
  }

  const onCountryChange = async (countries: any, setFieldValue: any) => {
    setSelectedFarms([]);
    setFieldValue('countries', countries);

    getFarms(countries, setFieldValue);
  }

  const onRoleChange = async (role: any, setFieldValue: any) => {
    //Used to validate user to contain at least one type of role.
    if (role == "") {
      setFieldValue("mainRoleSelect", false);
    }
    else {
      setFieldValue("mainRoleSelect", true);
    }

    //If Supervisor is chosen, show Lead Supervisor dropdown + enable yup validation for teamLead + get Team Leads
    if (role == SUPERVISOR_ROLE) {
      setFieldValue("isSupervisor", true);
    }
    else {
      setFieldValue("isSupervisor", false)
      setFieldValue("team_lead", '')
    }

    setFieldValue("role", role);
    validateRoleChange(role)
  }

  const validateRoleChange = async (role: any) => {
    //if edit user and role changed to not coordinators
    if (user && role !== 'Coordinator') {
      let query = {
        status: 'Approved',
        filterCountry: true,
        filterFamily: true,
        deletedAt: true,
        coordinator: user.id
      }

      await getFamilies(query, (families: Prisma.FamilyCreateInput[]) => {
        //if there are families under this coordinator
        if (families.length > 0) {
          setAffectedFamilies(families)

          setShowReassignDialog(true)
        }
      }, (error: any) => {
        console.error('err', error);
      });
    } else {
      setAffectedFamilies([])
    }

  }

  const verifyNewCoordinators = (values: any) => {

    let err = false
    //check if any new coordinator field is undefined or null
    for (let i = 0; i < values.new_coordinators.length; i++) {
      if (values.new_coordinators[i] == undefined || null) {
        console.error('undefined or null found at', i)
        err = true
      }
    }


    //if no undefined and new_coordinators are complete
    if (err === false && values.new_coordinators.length > 0 && affectedFamilies.length === values.new_coordinators.length) {
      setShowReassignDialog(false)
      enqueueSnackbar(t('New coordinator(s) set.'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      return true
    }
    else {
      setShowReassignDialog(false)
      enqueueSnackbar(t('Reassignment incomplete. Coordinator must be replaced for all families'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      return false
    }
  }

  const onFarmRoleChange = async (role: any, setFieldValue: any) => {
    //Used to validate user to contain at least one type of role.
    if (role == "") {
      setFieldValue("farmRoleSelect", false);
      setFieldValue("farms", []);
      // setShowFarms(false);
    }
    else {
      setFieldValue("farmRoleSelect", true);
      // setShowFarms(true)
    }
    setFieldValue("farm_role", role);
  }

  const onSubmit = async (values: any, setSubmitting: any) => {

    if (!user) {
      return await createUser({ ...values, email: values.email + "@carechannels.org" }, setSubmitting);
    }

    //show reassign form if there are affected families and are unresolved
    if (affectedFamilies.length > 0 && verifyNewCoordinators(values) === false){
      setShowReassignDialog(true)
    } else {
      return await editUser(oldImage, { ...values, email: values.email + "@carechannels.org", affectedFamilies: affectedFamilies }, setSubmitting);
    }
  }

  function createUser(values: any, setSubmitting: any) {
    return create(values, async (user) => {
      setSubmitting(false);
      enqueueSnackbar(t('The user has been created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push("/dashboard/users");
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    })
  }

  function editUser(oldImage: any, values: any, setSubmitting: any): any {
    return edit(oldImage, values, async (user) => {
      setSubmitting(false);
      enqueueSnackbar(t('The user has been updated successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push("/dashboard/users");
      updateSession();
    }, (error: any) => {
      // setErrorMessage(error.data);
      // setSubmitting(false);
      // setHasError(true);
    })
  }

  return (
    <>
      <Formik
        initialValues={{
          isSupervisor: user?.role == SUPERVISOR_ROLE ? true : false,
          farmRoleSelect: (user?.farmRole && user?.farmRole != "") ? true : false,
          mainRoleSelect: (user?.role && user?.role != "") ? true : false,
          id: user?.id || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          password: '',
          role: user?.role || '',
          farm_role: user?.farmRole || '',
          team_lead: user?.teamLeadId ? { id: user?.teamLeadId } : '',
          countries: user?.countries || [],
          status: user?.status || "Active",
          farms: user?.farms || [],
          image: user?.image || null,
          edit: (user ? true : false),
          new_coordinators: []
        }}
        innerRef={ref}
        enableReinitialize
        validationSchema={addUserSchema}
        onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}
      >
        {({ errors, values, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <TextInputField
              name='firstName'
              placeholder={t('Enter First name')}
              label={t('First name')}
              value={values.firstName}
              onChangeText={(firstName) => { setFieldValue('firstName', firstName) }}
              hasError={errors.firstName && touched.firstName ? true : false}
              errorMessage={errors.firstName}
            />

            <TextInputField
              name='lastName'
              placeholder={t('Enter Last name')}
              label={t('Last name')}
              value={values.lastName}
              onChangeText={(lastName) => { setFieldValue('lastName', lastName) }}
              hasError={errors.lastName && touched.lastName ? true : false}
              errorMessage={errors.lastName}
            />

            <TextInputField
              name='email'
              placeholder={t('Enter email')}
              label={t('Email address')}
              value={values.email}
              onChangeText={(email) => { setFieldValue('email', email) }}
              hasError={errors.email && touched.email ? true : false}
              errorMessage={errors.email}
              disabled={values?.id ? true : false}
              enableDomainHelper
            />

            {userImage &&
              <div className="py-3" >
                <Typography variant='subtitle2'>
                  {t("Current Avatar Image") + ":"}
                </Typography>
                <img className="h-auto w-60 border-solid border-2 border-black" style={{ borderRadius: '50%' }} src={user?.image} alt="" />
                <Box className='pl-11'>
                  <Button
                    sx={{
                      mt: 1
                    }}
                    color="error"
                    onClick={() => { setUserImage(false); setFieldValue('image', null) }}
                    size="large"
                    variant="contained"
                  >
                    {t('Delete Image')}
                  </Button>
                </Box>
              </div>
            }

            {
              userImage === false &&

              <SingleFile
                cropper={true}
                onUpload={(image) => { handleUpload('image', image, setFieldValue) }}
                label={t('Avatar Image')}
                value={values.image}
                hasError={errors.image && touched.image ? true : false}
                errorMessage={errors.image}
              />
            }

            <PasswordField
              name='password'
              placeholder={t('Enter password')}
              label={t('Password')}
              value={values.password}
              onChangeText={(password) => { setFieldValue('password', password); }}
              hasError={errors.password && touched.password ? true : false}
              errorMessage={errors.password}
            />

            <DropdownStringField
              items={upperRoles}
              label={t('Role')}
              placeholder={t('Select a role')}
              value={values.role}
              onChangeValue={(role) => { onRoleChange(role, setFieldValue); }}
              hasError={errors.role && touched.role ? true : false}
              errorMessage={errors.role}
            />

            {values.role == SUPERVISOR_ROLE
              &&
              <DropdownField
                items={teamLeads}
                label={t('Team Lead')}
                placeholder={t('Select a lead')}
                customLabel={['firstName', 'lastName']}
                value={values.team_lead}
                onChangeValue={(team_lead: any) => setFieldValue('team_lead', team_lead)}
                hasError={errors.team_lead && touched.team_lead ? true : false}
                errorMessage={errors.team_lead}
              />
            }

            <DropdownStringField
              items={farmRoles}
              label={t('Farm Role')}
              placeholder={t('Select a farm_role')}
              value={values.farm_role}
              onChangeValue={(farm_role) => { onFarmRoleChange(farm_role, setFieldValue) }}
              hasError={errors.farm_role && touched.farm_role ? true : false}
              errorMessage={errors.farm_role}
            />

            <DropdownMultiple
              items={countries}
              label={t('Countries')}
              placeholder={t('Select countries')}
              values={values.countries as any}
              onChangeValue={(countries) => { onCountryChange(countries, setFieldValue) }}
            />

            {/* {
            showFarms
            ?
              <DropdownMultiple 
                items={selectedFarms}
                label={t('Farms')}
                placeholder={t('Select farms')}
                values={values.farms as any}
                onChangeValue={(farms) => { setFieldValue('farms', farms)}}
            />
            :
              <></>
          } */}

            <DropdownMultiple
              items={selectedFarms}
              label={t('Farms')}
              placeholder={t('Select farms')}
              values={values.farms as any}
              onChangeValue={(farms) => { setFieldValue('farms', farms) }}
            />

            <DropdownStringField
              items={statuses}
              label={t('Status')}
              placeholder={t('Select a status')}
              value={values.status}
              onChangeValue={(status) => { setFieldValue('status', status); }}
              hasError={errors.status && touched.status ? true : false}
              errorMessage={errors.status}
            />


            <Dialog
              maxWidth={'lg'}
              fullWidth={true}
              open={showReassignDialog === true}
              onClose={() => {setShowReassignDialog(false);}}

            >
              <DialogTitle>
                Reassign Families

                <IconButton
                  aria-label="close"
                  onClick={() =>{setShowReassignDialog(false)}}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>

              </DialogTitle>
              <Box sx={{ overflow: 'auto'}}>
                <TableContainer
                  sx={{
                    minWidth: 650,
                    //add maxheight 200
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('ID')}</TableCell>
                        <TableCell>{t('Family Name')}</TableCell>
                        <TableCell>{t('National ID')}</TableCell>
                        <TableCell>{t('New Coordinator')}</TableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        affectedFamilies.map((family, index) => {

                          return (
                            <>
                              <TableRow
                                hover
                                key={family.id}
                                selected={true}
                              >
                                <TableCell>
                                  <Typography noWrap variant="h5">
                                    {family.secondaryId}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography noWrap variant="h5">
                                    {family.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography noWrap variant="h5">
                                    {family.nationalID}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <DropdownInputField
                                    items={coordinators}
                                    label={t('New Coordinator')}
                                    customLabel='name'
                                    value={values.new_coordinators[index] as any}
                                    onCallData={(inputValue: string) => getCoordinators(inputValue, family.townVillage.district.country.name || '')}
                                    onChangeValue={(new_coordinator: any) => { setFieldValue(`new_coordinators[${index}]`, new_coordinator);}}
                                    onOpen={() => getCoordinators('', family.townVillage.district.country.name || '')}
                                  // hasError={errors.new_coordinators[index] && touched.new_coordinators[index] ? true : false}
                                  // errorMessage={errors.new_coordinators[index]}
                                  />
                                </TableCell>
                              </TableRow>
                            </>
                          )
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItem: 'center',
                  py: 4
                }}>

                <Button
                  variant='contained'
                  type="button"
                  color='primary'
                  size='large'
                  onClick={() => { verifyNewCoordinators(values) }}
                >
                  {t("Set new coordinators")}
                </Button>

              </Box>


            </Dialog>


            {
              hasError
                ?
                <FormHelperText error={true}>{errorMessage}</FormHelperText>
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
              {!user ? t('Create Account') : t('Edit Account')}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UserForm;
