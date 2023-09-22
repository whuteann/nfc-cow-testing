import {
  CircularProgress,
  Card,
  Grid,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { create } from '@/services/cow_farm_sales/CowFarmSalesServices';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import CowFarmSalesRequestForm from '../partials/CowFarmSaleRequestsForm';
import { Prisma } from '@prisma/client';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';

interface RequestProps {
  farms: Prisma.FarmCreateInput[];
}

function RequestForm({ farms }: RequestProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addRequestSchema = Yup.object({
    farm: Yup.object()
      .required(t('Farm is Required')),

    cows: Yup.array().of(
      Yup.object().shape(
        {
          cowOption: Yup.string()
            .required(t("Select a Cow option")),
          nfcId: Yup.string().required(t("Insert Cow NFC ID")),
        }
      )
    )
  });

  const onSubmit = async (values: any, setSubmitting: any) => {

    const uniqueCows = new Set(values.cows.map((cow: Prisma.CowCreateInput) => cow.nfcId));
    if (values.cows.length !== uniqueCows.size)
      return enqueueSnackbar(t('Duplicate cows found'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    return await createRequest(values, setSubmitting);
  }

  const createRequest = (values: any, setSubmitting: any) => {
    return create(values, () => {
      router.push("/dashboard/cow-farm-sale-requests");
      setSubmitting(false);

      enqueueSnackbar(t('The Request Has Been Created Successfully'), {
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

  const onFarmChange = async(farm: any, values: any, setFieldValue: any) => {
    let newCows  = [];

    if (values.cows){
      newCows = values.cows.filter((cow) =>{
        if(farm){
          if (cow.farmId == farm.id){
            return cow;
          }
        }
      })
    }

    setFieldValue('cows', newCows)
    setFieldValue('farm', farm)
  }


  return (
    <Formik
      initialValues={{
        farm: '',
        cows: []
      }}
      enableReinitialize
      validationSchema={addRequestSchema}
      onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting) }
    >
      {({ errors, touched, isSubmitting, setFieldValue, setErrors, values }) => (
        <Card
          sx={{
            p: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Form>
                <DropdownField
                  label={t('Farm')}
                  items={farms}
                  value={values.farm}
                  onChangeValue={(farm) => { onFarmChange(farm, values, setFieldValue) }}
                  hasError={errors.farm && touched.farm ? true : false}
                  errorMessage={errors.farm}
                />

                {values.farm 
                  ?
                  <CowFarmSalesRequestForm
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    setErrors={setErrors}
                    touched={touched}
                  />
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
                  disabled={isSubmitting || values.cows.length == 0}
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

export default RequestForm;
