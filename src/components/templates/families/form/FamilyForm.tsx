import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import GeneralAddressForm from './partials/GeneralAddressForm';
import PersonalDetailForm from './partials/PersonalDetailForm';
import FamilyDetailForm from './partials/FamilyDetailForm';
import { useSnackbar } from 'notistack';
import TownAddressForm from './partials/TownAddressForm';
import VillageAddressForm from './partials/VillageAddressForm';
import { addFamilySchema, initialValues } from "./FamilyComponents"
import { addFamilyCoordinator, updateFamilyCoordinator } from '@/services/family/FamilyServices';
import Router from 'next/router';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Prisma } from '@prisma/client';
import { Dropdown } from '@/types/Common';
import { useS3Upload } from 'next-s3-upload';

interface CoordinatorProps {
  single_family?: Prisma.FamilyCreateInput,
  coordinators?: Prisma.FamilyCreateInput[],
  countries: Prisma.CountryCreateInput[],
  countriesDropdown?: Dropdown[],
  townvillages: Prisma.TownVillageCreateInput,
}

function FamilyForm({
  single_family,
  coordinators,
  countries,
  countriesDropdown,
  townvillages
}: CoordinatorProps) {
  const { t }: { t: any } = useTranslation();
  const router = Router;

  const { enqueueSnackbar } = useSnackbar();

  const [coordinatorDropdown, setCoordinatorDropdown] = useState<any[]>(coordinators);
  const [townVillageDropdown, setTownVillageDropdown] = useState<any[]>(townvillages as any);

  let { uploadToS3 } = useS3Upload();

  const oldHeadshot = single_family?.headshot;
  const oldFamilyPhoto = single_family?.familyPhoto;
  const oldHousePhoto = single_family?.housePhoto;
  const oldContractForm = single_family?.contractForm;
  const oldApplicationForm = single_family?.applicationForm;

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

  function filterResetTownVillageDropdown(country: any, type: any, TownVillages: any = townvillages, Coordinators: Prisma.FamilyCreateInput[] = coordinators, setFieldValue?: any) {
    if (country === "Pakistan") {
      let filteredTV = TownVillages.filter(((p: any) => p.district.country.name === "Pakistan"));
      setTownVillageDropdown(filteredTV);
      setCoordinatorDropdown(Coordinators.filter(((p: any) => p.townVillage.district.country.name === "Pakistan")));

      if (!setFieldValue) {
        return;
      }

      setFieldValue("generalDetails", true);
      setFieldValue("villageDetails", false);
      setFieldValue("townDetails", false);
    } else if (country === "Bangladesh" && type === "Town") {
      setTownVillageDropdown(TownVillages.filter(((p: any) => p.district.country.name === "Bangladesh" && p.townVillage === "Town")));
      setCoordinatorDropdown(Coordinators.filter(((p: any) => p.townVillage.district.country.name === "Bangladesh")));

      if (!setFieldValue) {
        return
      }

      setFieldValue("generalDetails", false);
      setFieldValue("townDetails", true)
      setFieldValue("villageDetails", false)
      resetVillageValues(setFieldValue)
    } else if (country === "Bangladesh" && type === "Village") {
      setTownVillageDropdown(TownVillages.filter(((p: any) => p.district.country.name === "Bangladesh" && p.townVillage === "Village")))
      setCoordinatorDropdown(Coordinators.filter(((p: any) => p.townVillage.district.country.name === "Bangladesh")))

      if (!setFieldValue) {
        return
      }

      setFieldValue("generalDetails", false);
      setFieldValue("villageDetails", true)
      setFieldValue("townDetails", false)
      resetTownValues(setFieldValue)
    } else {
      setTownVillageDropdown([])
    }
  }

  function handleCountryChange(value: any, values: any, setFieldValue: any) {
    if (value == values.country) {
      return;
    }

    setFieldValue("houseType", '');
    setFieldValue('townVillage', '');
    setFieldValue('coordinator', '');

    resetGeneralValues(setFieldValue);
    resetVillageValues(setFieldValue);
    resetTownValues(setFieldValue);

    if (value == "Pakistan") {
      filterResetTownVillageDropdown("Pakistan", null, townvillages, coordinators, setFieldValue);
    } else {
      setFieldValue("generalDetails", false);
      setFieldValue("villageDetails", false);
      setFieldValue("townDetails", false);
    }

    setFieldValue("country", value);
  }

  function handleHouseTypeChange(value: any, values: any, setFieldValue: any) {
    if (value == values.houseType) {
      return;
    }
    setFieldValue("country", values.country);
    setFieldValue("houseType", value);
    setFieldValue("townVillage", '');
    setFieldValue('coordinator', '');

    if (value == "Town") {
      filterResetTownVillageDropdown("Bangladesh", "Town", townvillages, coordinators, setFieldValue)
    }
    else if (value == "Village") {
      filterResetTownVillageDropdown("Bangladesh", "Village", townvillages, coordinators, setFieldValue)
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

  const handleUpload = async (field: string, file: any, setFieldValue: any) => {


    if (file) {
      let { url } = await uploadToS3(file)
      setFieldValue(field, url)

    }
  }


  const onSubmit = async (values: any, setSubmitting: any, setFieldError: any) => {
    if (!single_family) {
      return createFamily(values, setSubmitting, setFieldError);
    }

    return editFamily(single_family.id, values, setSubmitting, setFieldError);
  }

  async function createFamily(values: any, setSubmitting: any, setFieldError: any) {

    return addFamilyCoordinator(values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Family has been successfully added'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      router.push("/dashboard/families");
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

  function editFamily(id: any, values: any, setSubmitting: any, setFieldError: any) {
    return updateFamilyCoordinator(oldHeadshot, oldFamilyPhoto, oldHousePhoto, oldContractForm, oldApplicationForm, id, values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Family has been successfully updated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push("/dashboard/families")
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
      initialValues={initialValues(single_family as any, countries.length === 1 && countries[0])}
      validationSchema={addFamilySchema(t)}
      enableReinitialize
      onSubmit={(values, { setSubmitting, setFieldError }) => onSubmit(values, setSubmitting, setFieldError)}
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
                disabled={countriesDropdown.length === 1 ? true : false}
                placeholder={t('Select a country')}
                value={values.country}
                onChangeValue={(value) => handleCountryChange(value, values, setFieldValue)}
                hasError={errors.country && touched.country ? true : false}
                errorMessage={errors.country}
              />

              {
                single_family
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
                    items={houseTypes}
                    label={t('House Type')}
                    value={values.houseType}
                    onChangeValue={(value) => handleHouseTypeChange(value, values, setFieldValue)}
                    hasError={errors.houseType && touched.houseType ? true : false}
                    errorMessage={errors.houseType}
                  />
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
                <></>
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
                <></>
              }

              {
                (values.country === "Pakistan" || (values.country === "Bangladesh" && values.houseType != ''))
                  ?
                  <>
                    <Grid item xs={12} md={6}>
                      <PersonalDetailForm
                        single_family={single_family}
                        coordinators={coordinatorDropdown}
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FamilyDetailForm
                        single_family={single_family}
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

export default FamilyForm;
