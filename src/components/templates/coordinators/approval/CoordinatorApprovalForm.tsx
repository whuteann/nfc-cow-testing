
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
// import GeneralAddressForm from './partials/GeneralAddressForm';
import GeneralAddressForm from '../form/partials/GeneralAddressForm';
import PersonalDetailForm from '../form/partials/PersonalDetailForm';
import FamilyDetailForm from '../form/partials/FamilyDetailForm';
import TownAddressForm from '../form/partials/TownAddressForm';
import VillageAddressForm from '../form/partials/VillageAddressForm';
import { useSnackbar } from 'notistack';
import { coordinatorApprovalSchema, approvalInitialValues } from "./CoordinatorApprovalComponents"
import { updateRequest } from '@/services/family/FamilyServices';
import Router from 'next/router';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Prisma } from '@prisma/client';
import { Dropdown } from '@/types/Common';

interface CoordinatorProps {
  single_coordinator? : Prisma.FamilyCreateInput,
  supervisors? : Prisma.UserCreateInput[],
  countries: Prisma.CountryCreateInput[],
  countriesDropdown?: Dropdown[],
  townvillages: Prisma.TownVillageCreateInput,
}

function CoordinatorApprovalForm({ 
  single_coordinator, 
  supervisors, 
  countries, 
  countriesDropdown,
  townvillages 
}: CoordinatorProps) {
  const { t }: { t: any } = useTranslation();
  const router = Router;

  const [RejectPopUp, setRejectPopUp] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  let approval: any = null;

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

  const onSubmit = async (values: any, setSubmitting: any) => {
    editRequest(values, setSubmitting)
  }

  function editRequest (values: any, setSubmitting: any) {
    const id = single_coordinator.id;

    return updateRequest(approval, id, values, async () => {
      setSubmitting(false)
      enqueueSnackbar(t("The Request Has Been")+` ${approval} `+t("Successfully"), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
    });
      router.push(`/dashboard/coordinators/approvals`);
    }, (error: any) => {
      enqueueSnackbar(t(error.data), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      })
    })
  };

  return (
    <Formik
      initialValues={approvalInitialValues(single_coordinator)}
      validationSchema={coordinatorApprovalSchema(t)}
      onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
      enableReinitialize
    >
    {({ errors, touched, isSubmitting, setFieldValue, values}) => (
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
        placeholder={t('Select a country')}
        value={values.country}
        disabled={true}
        hasError={errors.country && touched.country ? true : false}
        errorMessage={errors.country}
      />

      {(values.country === "Bangladesh")
        ?
          <>
            <DropdownStringField 
              items={houseTypes}
              label={t('House Type')} 
              value={values.houseType}
              disabled={true}
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
              townvillages={townvillages}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched} 
              disabled={true}
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
              townvillages={townvillages} 
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              disabled={true} 
            />
            :
            <VillageAddressForm 
              values={values} 
              townvillages={townvillages}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              disabled={true} 
            />
          }
          </Grid>
        :
        <>
        </>
      }

      {
        (values.country === "Pakistan" || (values.country === "Bangladesh" && values.houseType != ''))
        ?
          <>
          <Grid item xs={12} md={6}>
            <PersonalDetailForm 
              single_coordinator={single_coordinator}
              townvillages={townvillages}
              supervisors={supervisors}
              values={values} 
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </Grid>
          
          <Grid item xs={6}>
            <FamilyDetailForm 
              values={values}
              single_coordinator={single_coordinator}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </Grid>
          </>
        :
        <></>
      }
      </Grid>
      {
        RejectPopUp
        ?
        <>
          <Grid container spacing={2}>
            
            <Grid item xs={12} md={6}>
              <Button
                sx={{
                  mt: 3
                }}
                color="error"
                size="large"
                fullWidth
                variant="contained"
              >
                {t('Reject')}
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                sx={{
                  mt: 3
                }}
                color="secondary"
                onClick={(event) => { event.preventDefault(); setRejectPopUp(false) }}
                size="large"
                fullWidth
                variant="contained"
              >
                {t('Cancel')}
              </Button>
            </Grid>
            
          </Grid>

          <TextareaField

            name='rejectionReason'
            value={values.rejectionReason}
            label={t('Rejection Reason')}
            onChangeText={(rejectionReason) => { setFieldValue('rejectionReason', rejectionReason) }}
            hasError={errors.rejectionReason && touched.rejectionReason ? true : false}
            errorMessage={errors.rejectionReason}

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
            type="submit"
            onClick={() => { setFieldValue('rejectionMessage', true) ; approval = 'Rejected' ;}}
            size="large"
            fullWidth
            variant="contained"
          >
            {t('Submit')}
          </Button>
        </>
        : 
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button
                sx={{
                  mt: 3
                }}
                color="error"
                onClick={() => {
                  setRejectPopUp(true);
                  setFieldValue('rejectionMessage', true);
                }}
                size="large"
                fullWidth
                variant="contained"
              >
                {t('Reject')}
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                sx={{
                  mt: 3
                }}
                color="success"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                type="submit"
                onClick={() => {setFieldValue('rejectionMessage', false); approval = 'Approved'}}
                size="large"
                fullWidth
                variant="contained"
              >
                {t('Approve')}
              </Button>
            </Grid>
          </Grid>
        </>
      }
    </Form>

    </>
    )}
  </Formik>
  )
}

export default CoordinatorApprovalForm;
