import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import GeneralAddressForm from './partials/GeneralAddressForm';
import PersonalDetailForm from './partials/PersonalDetailForm';
import FamilyDetailForm from './partials/FamilyDetailForm';
import { useSnackbar } from 'notistack';
import TownAddressForm from './partials/TownAddressForm';
import VillageAddressForm from './partials/VillageAddressForm';
import { addCoordinatorSchema, initialValues } from "./CoordinatorComponents"
import { addFamilyCoordinator, updateFamilyCoordinator } from '@/services/family/FamilyServices';
import Router from 'next/router';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Prisma } from '@prisma/client';
import { Dropdown } from '@/types/Common';

interface CoordinatorProps {
  single_coordinator?: Prisma.FamilyCreateInput,
  supervisors?: Prisma.UserCreateInput[],
  countries: Prisma.CountryCreateInput[],
  countriesDropdown?: Dropdown[],
  townvillages: Prisma.TownVillageCreateInput,
}

function CoordinatorForm({
  single_coordinator,
  supervisors,
  countries,
  countriesDropdown,
  townvillages
}: CoordinatorProps) {
  const { t }: { t: any } = useTranslation();

  const router = Router;
  const [townVillageDropdown, setTownVillageDropdown] = useState(townvillages as any);
  const [supervisorsDropdown, setSupervisorsDropdown] = useState(supervisors as any);
  const { enqueueSnackbar } = useSnackbar();

  const oldHeadshot = single_coordinator?.headshot
  const oldFamilyPhoto = single_coordinator?.familyPhoto
  const oldHousePhoto = single_coordinator?.housePhoto
  const oldContractForm = single_coordinator?.contractForm
  const oldApplicationForm = single_coordinator?.applicationForm

  const coordinatorTypes = [
    {
      label: "Normal",
      value: "Normal",
    },
    {
      label: "Tent Maker",
      value: "Tent Maker",
    }
  ]

  const houseTypes = [
    {
      label: "Town",
      value: "Town",
    },
    {
      label: "Village",
      value: "Village",
    }
  ]

  const statuses = [
    {
      label: "Active",
      value: "Active",
    },
    {
      label: "Inactive",
      value: "Inactive",
    }
  ]

  async function filterResetTownVillageDropdown(townvillages: any, country: any, type?: any, setFieldValue?: any) {
    if (country === "Pakistan") {
      setTownVillageDropdown(townvillages.filter(((p: any) => p.district.country.name === "Pakistan")));

      if (!setFieldValue) {
        return;
      }

      setFieldValue("generalDetails", true)
      setFieldValue("villageDetails", false)
      setFieldValue("townDetails", false)
    } else if (country === "Bangladesh" && type === "Town") {
      setTownVillageDropdown(townvillages.filter(((p: any) => p.district.country.name === "Bangladesh" && p.townVillage === "Town")))

      if (!setFieldValue) {
        return;
      }

      setFieldValue("generalDetails", false);
      setFieldValue("townDetails", true)
      setFieldValue("villageDetails", false)
      resetVillageValues(setFieldValue)
    } else if (country === "Bangladesh" && type === "Village") {
      setTownVillageDropdown(townvillages.filter(((p: any) => p.district.country.name === "Bangladesh" && p.townVillage === "Village")))

      if (!setFieldValue) {
        return;
      }

      setFieldValue("generalDetails", false);
      setFieldValue("villageDetails", true)
      setFieldValue("townDetails", false)
      resetTownValues(setFieldValue)
    } else {
      setTownVillageDropdown([])
    }
  }

  function filterResetSupervisorDropdown(supervisors, country, setFieldValue) {
    if (country === "Pakistan") {
      setSupervisorsDropdown(supervisors.filter(((sv: any) => sv.countries.some((country) => { return country.name === 'Pakistan' }))));

      if (!setFieldValue) {
        return;
      }

    } else if (country === "Bangladesh") {
      setSupervisorsDropdown(supervisors.filter(((sv: any) => sv.countries.some((country) => { return country.name === 'Bangladesh' }))));

      if (!setFieldValue) {
        return;
      }

    } else {
      setSupervisorsDropdown([])
    }
  }

  function handleCountryChange(value: any, values: any, setFieldValue: any) {
    if (value == values.country) {
      return;
    }

    setFieldValue("houseType", '');
    setFieldValue("coordinatorType", '');
    setFieldValue('townVillage', '');
    setFieldValue('overseeTownsVillages', []);

    resetGeneralValues(setFieldValue);
    resetVillageValues(setFieldValue);
    resetTownValues(setFieldValue);

    if (value == "Pakistan") {
      filterResetTownVillageDropdown(townvillages, "Pakistan", '', setFieldValue);
      filterResetSupervisorDropdown(supervisors, "Pakistan", setFieldValue)

    }
    else {
      filterResetSupervisorDropdown(supervisors, "Bangladesh", setFieldValue)
      setFieldValue("generalDetails", false);
      setFieldValue("villageDetails", false);
      setFieldValue("townDetails", false);
    }

    setFieldValue("country", value);

  }

  function handleHouseTypeChange(value: any, values: any, setFieldValue: any) {
    if (value == values.houseType) {
      return
    }

    setFieldValue("country", values.country)
    setFieldValue("coordinatorType", values.coordinatorType)
    setFieldValue("houseType", value)

    if (value == "Town") {
      filterResetTownVillageDropdown(townvillages, values.country, "Town", setFieldValue)
    }
    else if (value == "Village") {
      filterResetTownVillageDropdown(townvillages, values.country, "Village", setFieldValue)
    }
  }

  function resetTownValues(setFieldValue: any) {
    setFieldValue("flatNumber", '')
    setFieldValue("buildingName", '')
    setFieldValue("areaName", '')
    setFieldValue("address", '')
    setFieldValue("district", '')
    setFieldValue("townVillage", '')
  }

  function resetVillageValues(setFieldValue: any) {
    setFieldValue("district", '')
    setFieldValue("townVillage", '')
    setFieldValue("policeStationThanaName", '')
    setFieldValue("postOfficeName", '')
  }

  function resetGeneralValues(setFieldValue: any) {
    setFieldValue("address", '')
    setFieldValue("unionCouncil", '')
    setFieldValue("district", '')
    setFieldValue("townVillage", '')
    setFieldValue("province", '')
    setFieldValue("nearestFamousLandmard", '')
    setFieldValue("cityName", '')
  }

  const onSubmit = async (values: any, setSubmitting: any, setFieldError: any) => {
    if (!single_coordinator) {
      return createCoordinator(values, setSubmitting, setFieldError);
    }

    return editCoordinator(single_coordinator.id, values, setSubmitting, setFieldError);
  }

  function createCoordinator(values: any, setSubmitting: any, setFieldError: any) {

    return addFamilyCoordinator(values, async () => {
      setSubmitting(false)
      enqueueSnackbar(t('The Coordinator has been successfully added'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      })
      router.push("/dashboard/coordinators")
    }, (error: any) => {
      switch (error.data) {
        case 'National ID already exist.':
          setFieldError('nationalID', error.data.nationalID)
          enqueueSnackbar(t('Please enter a unique National ID'), {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
          });
          break
        default:
          enqueueSnackbar(t('Something went wrong, please try again'), {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
          });
      }

    })
  }

  function editCoordinator(id: any, values: any, setSubmitting: any, setFieldError: any) {
    return updateFamilyCoordinator(oldHeadshot, oldFamilyPhoto, oldHousePhoto, oldContractForm, oldApplicationForm, id, values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Coordinator has been successfully updated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push("/dashboard/coordinators")
    }, (error: any) => {
      switch (error.data) {
        case 'National ID already exist.':
          setFieldError('nationalID', error.data.nationalID)
          enqueueSnackbar(t('Please enter a unique National ID'), {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
          });
          break
        default:
          enqueueSnackbar(t('Something went wrong, please try again'), {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            },
          });
      }

    })
  }


  return (
    <Formik
      initialValues={initialValues(single_coordinator as any, countries.length === 1 && countries[0])}
      validationSchema={addCoordinatorSchema(t)}
      onSubmit={(values, { setSubmitting, setFieldError }) => onSubmit(values, setSubmitting, setFieldError)}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
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
              </Box>

              <DropdownStringField
                items={countriesDropdown}
                label={t('Country')}
                disabled={countries.length === 1 ? true : false}
                placeholder={t('Select a country')}
                value={values.country}
                onChangeValue={(value) => handleCountryChange(value, values, setFieldValue)}
                hasError={errors.country && touched.country ? true : false}
                errorMessage={errors.country}
              />

              {
                single_coordinator
                  ?
                  <DropdownStringField
                    items={statuses}
                    label={t('Status')}
                    placeholder={t('Please enter status')}
                    value={values.status == "Inactive" ? values.status : "Active"}
                    onChangeValue={(value) => setFieldValue("status", value)}
                    hasError={errors.status && touched.status ? true : false}
                    errorMessage={errors.status}
                  />
                  :
                  <></>
              }


              {(values.country === "Bangladesh")
                ?
                <>
                  <DropdownStringField
                    items={coordinatorTypes}
                    label={t('Coordinator Type')}
                    value={values.coordinatorType}
                    onChangeValue={(value) => setFieldValue("coordinatorType", value)}
                    hasError={errors.coordinatorType && touched.coordinatorType ? true : false}
                    errorMessage={errors.coordinatorType}
                  />
                  {
                    (values.coordinatorType != '')
                      ?
                      <DropdownStringField
                        items={houseTypes}
                        label={t('House Type')}
                        value={values.houseType}
                        onChangeValue={(value) => handleHouseTypeChange(value, values, setFieldValue)}
                        hasError={errors.houseType && touched.houseType ? true : false}
                        errorMessage={errors.houseType}
                      />
                      :
                      <>
                      </>
                  }
                </>
                :
                <>
                </>
              }

            </Card>

            <Grid container spacing={2}>

              {(values.country === "Pakistan")
                ?
                <Grid item xs={12} md={12}>
                  <GeneralAddressForm
                    values={values}
                    townvillages={townVillageDropdown}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </Grid>
                :
                <>

                </>
              }

              {(values.houseType != "")
                ?
                <Grid item xs={12} md={12}>
                  {(values.houseType === "Town")
                    ?
                    <TownAddressForm
                      values={values}
                      townvillages={townVillageDropdown}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                    :
                    <VillageAddressForm
                      values={values}
                      townvillages={townVillageDropdown}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  }
                </Grid>
                :
                <>
                </>
              }

              {
                ((values.country === "Pakistan") || (values.country === "Bangladesh" && values.houseType != ''))
                  ?
                  <>
                    <Grid item xs={12} md={6}>
                      <PersonalDetailForm
                        single_coordinator={single_coordinator}
                        supervisors={supervisorsDropdown}
                        townvillages={townVillageDropdown}
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FamilyDetailForm
                        single_coordinator={single_coordinator}
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>
                  </>
                  :
                  <></>
              }
            </Grid>

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

export default CoordinatorForm;
