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
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { create } from '@/services/breeding_record/BreedingRecordsServices';
import { useSnackbar } from 'notistack';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { useEffect, useState } from 'react';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import DropdownImage from '@/components/atoms/Input/dropdown/DropdownImage';
import  Router from 'next/router';
import { Prisma } from '@prisma/client';
import { index as getCowsFromDatabase } from '@/services/cow/CowServices';
import { useSession } from 'next-auth/react';

// TODO : SHOW WEANED-OFF CALVES

interface FormProps {
  record?: Prisma.FamilyBirthRecordCreateInput;
  families?: Prisma.FamilyCreateInput[];
}

const todayDate = new Date();  

function FamilyBreedingForm({ 
  record,
  families = [],
}:FormProps) {

  const methods = [
    {label: 'Select By NFC ID', value: 'Select By NFC ID'},
    {label: 'Select By Photo', value: 'Select By Photo'},
  ]
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = Router;
  
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [cows, setCows] = useState<any>([]);

  const { data: session } = useSession();
  const [initLoad, setInitLoad] = useState<boolean>(false);

  useEffect(() => {
    if (session != undefined && initLoad != true) {
      setInitLoad(true);
      record? getCows(record.family as any) : setCows([])

    }
  }, [session]);

  const addRequestSchema = Yup.object({
    option: Yup.string()
      .required(t('An Option is Required')),
  
    dateOfBirth : Yup.date()
      .typeError(t('Invalid Date'))
      .required(t('Date is Required')),
  
    aliveCalves: Yup.number()
      .typeError(t('Must be a number'))
      .min(0, t('Must be positive'))
      .required(t('Number of Calves Alive is Required')),
  
    deadCalves: Yup.number()
      .typeError(t('Must be a number'))
      .min(0, t('Must be positive'))
      .required(t('Number of Calves Dead is Required')),
  });

  const onFarmChange = async(farm: any, setFieldValue: any) => {
    getCows(farm, setFieldValue)

    //Used to validate user to contain a farm
    if (farm == "") {
      setShowDetails(false);
    }
    else {
      setShowDetails(true)
    }
    setFieldValue("farm", farm);
  }

  const onSubmit = async (values: any, setSubmitting: any) => {
    return await createRecord(values, setSubmitting)
  }

  const createRecord = (values: any, setSubmitting: any) => {
    return create(values, () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Record Has Been Created Successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      router.push(`/dashboard/family-birth-records`);
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    });
  }

  const getCows = (f: Prisma.FamilyCreateInput, setFieldValue: any = null) => {
    let query = {
      gender: 'Female',
      // familyIdSearch: f.id, 
    }

    getCowsFromDatabase(query, (cows: Prisma.CowCreateInput[]) => {

      setCows(cows)

    }, (error: any) => {
      console.error('err', error);
    });
  }

  return (
    <Formik
      initialValues={{
        option: record?.option || '' ,
        family: record?.family || "",
        status: record?.status || 'Pending',
        dateOfBirth: record?.dateOfBirth || todayDate,
        comment: record?.comment || '',
        aliveCalves: record?.aliveCalves || 0,
        deadCalves: record?.deadCalves || 0 ,
        cow: record?.cow || '',
      }}
      enableReinitialize
      validationSchema={addRequestSchema}
      onSubmit={ (values, { setSubmitting }) => onSubmit(values, setSubmitting)}
    >
      {({ errors,values, touched, isSubmitting, setFieldValue }) => (

        <Card
        sx={{
          p: 3
        }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Form>
                {
                record
                ?
                  <></>
                :
                  <DropdownStringField
                    label={t('Option')}
                    disabled = {record ? true : false}
                    items = {methods}
                    value = {values.option}
                    onChangeValue = {(option) => { setFieldValue('option', option)}}
                    hasError={errors.option && touched.option ? true : false}
                    errorMessage={errors.option}
                  />
                }
                
                <DropdownField
                  label={t('Family')}
                  disabled = {record ? true : false}
                  items = {families}
                  placeholder ={t('Select a farm')}
                  value = {values.family}
                  onChangeValue={(farm) => { onFarmChange(farm, setFieldValue) }}
                  hasError={errors.family && touched.family ? true : false}
                  errorMessage={errors.family}
                />
                

                {
                  (values.option === 'Select By NFC ID' && values.family !== "") || record
                  ? 
                    <DropdownField
                      label={t('Cow NFC ID')}
                      customLabel='nfcId'
                      disabled={record ? true : false}
                      items={cows}
                      value={values.cow}
                      onChangeValue={(cow) => { setFieldValue('cow', cow)} }
                      hasError={errors.cow && touched.cow ? true : false}
                      errorMessage={errors.cow}
                    />
                  :
                    <></>
                }

                {
                  (values.option === 'Select By Photo' && values.family !== "") || record
                  ? 
                    <DropdownImage
                      label={t('Cow Image')}
                      disabled={record ? true : false}
                      items={cows}
                      value={values.cow}
                      onChangeValue={( cow ) => { setFieldValue ('cow', cow)}}
                      hasError={errors.cow && touched.cow ? true : false}
                      errorMessage={errors.cow}
                    />
                  :
                    <></>
                }  

                {
                  values.cow 
                  ? 
                    <>
                      <Datepicker
                        value={values.dateOfBirth as any}
                        label={t('Date of Birth')}
                        maxDate={todayDate}
                        disabled = {record ? true : false}
                        onChangeDate={(dateOfBirth) => {{ setFieldValue('dateOfBirth', dateOfBirth) }}}
                        hasError={errors.dateOfBirth && touched.dateOfBirth ? true : false}
                        errorMessage = {errors.dateOfBirth}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextInputField
                            name='aliveCalves'
                            value={values.aliveCalves}
                            label={t('Number of Calves Born Alive')}
                            disabled = {record ? true : false}
                            onChangeText={(aliveCalves) => { setFieldValue ('aliveCalves', aliveCalves)}}
                            hasError={errors.aliveCalves && touched.aliveCalves ? true : false}
                            errorMessage={errors.aliveCalves}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextInputField
                            name='deadCalves'
                            value={values.deadCalves}
                            label={t('Number of Calves Born Dead')}
                            disabled = {record ? true : false}
                            onChangeText={(deadCalves) => {setFieldValue ('deadCalves', deadCalves)}}
                            hasError={errors.deadCalves && touched.deadCalves ? true : false}
                            errorMessage={errors.deadCalves}
                          />
                        </Grid>
                      </Grid>

                      <TextareaField
                        name='comment'
                        value={values.comment}
                        label={t('Comment')}
                        disabled = {record ? true : false}
                        onChangeText={(comment) => {setFieldValue ('comment', comment)}}
                        hasError={errors.comment && touched.comment ? true : false}
                        errorMessage={errors.comment}
                      />

                      {
                        record 
                        ?               
                          <></>
                        :
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
                            {('Submit')}
                          </Button> 
                      }
                    </>
                  : 
                    <></>
                }
                
              </Form>
            </Grid>
          </Grid>
        </Card>
      )}
    </Formik>
  );
}

export default FamilyBreedingForm;
