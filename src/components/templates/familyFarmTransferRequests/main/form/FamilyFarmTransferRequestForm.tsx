import {
  CircularProgress,
  Card,
  Grid,
  Button,
  FormLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { create } from '@/services/family/FamilyFarmTransferServices';
import { useSnackbar } from 'notistack';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import { useState } from 'react';
import { IFarm } from '@/models/Farm';
import { useRouter } from 'next/router';
import { IFamilyCoordinator } from '@/models/Family';
import { countCows } from '@/services/cow/CowServices';
import { COW_DISPERSED } from '@/types/Status';

interface RequestProps {
  farms: IFarm[];
  familiesCoordinators: IFamilyCoordinator[];
}


function RequestForm({farms,familiesCoordinators}:RequestProps) {
  const router = useRouter();
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [totalCowsAvailable, setTotalCowsAvailable] = useState(0);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addRequestSchema = Yup.object({
    farm: Yup.object()
      .required(t('Farm is Required')),

    family: Yup.object()
      .required(t('Family is Required')),
  
    noOfCows: Yup.number()
    .typeError(t('Must be a number'))
    .required(t('Number of Cows is Required')),

  });

  const handleFamilyChange = (value: any, setFieldValue: any) => {
    setFieldValue("family", value)
    //Count Cows binded to chosen family
    if(value){
      countCows(value.id, 
      COW_DISPERSED,
        (noOfCows: any)=> {
          setTotalCowsAvailable(noOfCows || 0);
        },
        (error: any)=> {
          console.error(error)
        } )
    }
  }

  const onSubmit = async (values: any, setSubmitting: any) => {
    let overTransfer: boolean = false;
    const noOfCows = values.noOfCows;
    if(noOfCows>totalCowsAvailable){
      overTransfer = true;
    }

    if(overTransfer){
      enqueueSnackbar(t('Number of Cows cannot be more than Cows Available.'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }

    if(noOfCows === 0 ){
      enqueueSnackbar(t('Please transfer at least 1 cow'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      setSubmitting(false)
      return
    }
    return await createRequest(values, setSubmitting);
  }

  const createRequest = (values: any, setSubmitting: any) => {
    return create(values, () => {
      router.push("/dashboard/family-farm-transfer-requests");
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

  return (
    <Formik
      initialValues={{
        farm: '',
        family: '',
        noOfCows:  '',
      }}
      enableReinitialize
      validationSchema={addRequestSchema}
      onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values}) => (
        <Card
          sx={{
            p: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Form>
              <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DropdownInputField
                      label={t('Family')}
                      items={familiesCoordinators}
                      value={values.family}
                      onChangeValue={(value)=> handleFamilyChange(value, setFieldValue) }
                      hasError={errors.family && touched.family ? true : false}
                      errorMessage={errors.family}
                    />
                      {
                        <FormLabel>Cows Available: {totalCowsAvailable} </FormLabel>
                      }
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DropdownInputField
                      label={t('Farm')}
                      items={farms}
                      value={values.farm}
                      onChangeValue={( farm ) => { setFieldValue ('farm', farm)} }
                      hasError={errors.farm && touched.farm ? true : false}
                      errorMessage={errors.farm}
                    />
                  </Grid>
                </Grid>

                <TextInputField
                  name='numberOfCows'
                  value={values.noOfCows}
                  label={t('Number Of Cows')}
                  onChangeText={(noOfCows) => {setFieldValue ('noOfCows', noOfCows)}}
                  hasError={errors.noOfCows && touched.noOfCows ? true : false}
                  errorMessage={errors.noOfCows}
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
