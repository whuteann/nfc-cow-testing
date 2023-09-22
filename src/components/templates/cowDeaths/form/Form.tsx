import {
  CircularProgress,
  Card,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { create } from '@/services/cow_deaths/CowDeathsServices';
import { useSnackbar } from 'notistack';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { useEffect, useState } from 'react';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import Router from 'next/router';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import DropdownInputImage from '@/components/atoms/Input/dropdown/DropdownInputImage';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { index as getCowsFromDatabase } from '@/services/cow/CowServices';
import { useS3Upload } from 'next-s3-upload';
import { COW_ALIVE, COW_DISPERSED, COW_INFARM, COW_PENDING } from '@/types/Status';

// TODO : SHOW WEANED-OFF CALVES

interface FormProps {
  record?: any;
  id?: string;
  cows?: Prisma.CowCreateInput[];
  farms?: Prisma.FarmCreateInput[];
  type?: "View" | "Rejection" | "Create";
  families?: Prisma.FamilyCreateInput[];
  farm?: any;
  disabled?: boolean;
  getCows?: (search?: string) => void;
  setFarm?: (farm: any) => void;
  setFamily?: (family: any) => void;
}

const todayDate = new Date();

function CowDeathForm({
  type = "View",
  record = null,
  id = "",
  farms = [],
  families = []
}: FormProps) {
  const { t }: { t: any } = useTranslation();
  const router = Router;

  const [cows, setCows] = useState<any>([])
  const [cowPic, setCowPic] = useState(null)
  const [report, setReport] = useState(null)

  const { data: session } = useSession();
  const [initLoad, setInitLoad] = useState<boolean>(false);

  useEffect(() => {
    if (session != undefined && initLoad != true) {
      setInitLoad(true);
      if (record) {
        switch (record.type) {
          case 'Family':
            getCowsByFamily(record.family)
            break;

          case 'Farm':
            getCowsByFarm(record.farm)
            break;
        }
      }
      else {
        setCows([])
      }

    }
  }, [session]);

  useEffect(() => {
    setCowPic(record?.cowPic ? true : false)
  }, [record?.cowPic]);

  useEffect(() => {
    setReport(record?.report ? true : false)
  }, [record?.report]);

  let { uploadToS3 } = useS3Upload();

  const handleUpload = async (field: string, file: any, setFieldValue: any) => {


    if (file) {
      let { url } = await uploadToS3(file)
      setFieldValue(field, url)
    }

    if (field == "report" && file.type == "application/pdf") {
      setFieldValue("reportFilename", file.name)
    }
  }

  const { enqueueSnackbar } = useSnackbar();

  // const [farmDropdown, setFarmDropdown] = useState<any[]>(farms);
  // const [familyDropdown, setFamilyDropdown] = useState<any[]>([]);

  // const oldHeadshot = single_family?.headshot;
  // const oldFamilyPhoto = single_family?.familyPhoto;
  // const oldHousePhoto = single_family?.housePhoto;
  // const oldContractForm = single_family?.contractForm;
  // const oldApplicationForm = single_family?.applicationForm;

  const types = [
    {
      label: 'Family',
      value: 'Family'
    },
    {
      label: 'Farm',
      value: 'Farm'
    },
  ]

  const methods = [
    {
      label: 'Select By NFC ID',
      value: 'Select By NFC ID'
    },
    {
      label: 'Select By Photo',
      value: 'Select By Photo'
    },
  ]


  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cowDeathFormSchema = Yup.object(
    {
      type: Yup.string()
        .required(t('A Type is Required')),

      option: Yup.string()
        .required(t('An Option is Required')),

      farm: Yup.object()
        .when('checkType', {
          is: true,
          then: Yup.object().required(t("A Farm is Required"))
        }),

      family: Yup.object()
        .when('checkType', {
          is: false,
          then: Yup.object().required(t("A Family is Required"))
        }),

      cow: Yup.object()
        .required(t('A Cow is Required')),

      dateOfDeath: Yup.date()
        .typeError(t('Invalid Date'))
        .required(t('Date is Required')),

      cowPic: Yup.mixed().required(t('Insert Cow Photo')),
      report: Yup.mixed().required(t('Insert Report')),
    }
  );

  function handleTypeChange(value: any, values: any, setFieldValue: any) {
    if (value == values.type) {
      return;
    }

    setFieldValue('cow', "");
    setFieldValue("family", "");
    setFieldValue("farm", "");

    // setFamily(null);
    // setFarm(null);

    setFieldValue('cowPic', null);
    setFieldValue('report', null);

    if (value == "Farm") {
      setFieldValue("checkType", true);
    } else {
      setFieldValue("checkType", false);
    }

    setFieldValue('type', value);
  }

  function handleOptionChange(value: any, values: any, setFieldValue: any) {
    setFieldValue('option', value);
    setFieldValue('cow', '');
  }

  function handleFamilyChange(value: any, values: any, setFieldValue: any) {
    getCowsByFamily(value, setFieldValue)

    setFieldValue('family', value);
    // setFamily(family); 
    setFieldValue('cow', '');
    setFieldValue('cowPic', null);
    setFieldValue('report', null);
  }

  function handleFarmChange(value: any, values: any, setFieldValue: any) {
    getCowsByFarm(value, setFieldValue)

    setFieldValue('farm', value);
    // setFarm(farm); 
    setFieldValue('cow', '');
    setFieldValue('cowPic', null);
    setFieldValue('report', null);
  }

  function handleNfcChange(value: any, values: any, setFieldValue: any) {
    setFieldValue('cow', value);
    setFieldValue('cowPic', null);
    setFieldValue('report', null);
  }

  // useEffect(()=>{
  //   setCowPic(record?.cowPic ? true : false);
  //   setReport(record?.report ? true : false);
  // },[record?.cowPic, record?.report])

  const onSubmit = async (values: any, setSubmitting: any, setFieldError: any) => {

    if (values.checkType) {
      delete values.checkType;
      delete values.family;
    } else {
      delete values.checkType;
      delete values.farm;
    }

    return createRecord(values, setSubmitting, setFieldError);
  }

  const createRecord = (values: any, setSubmitting: any, setFieldError: any) => {
    return create(values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Record Has Been Created Successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      router.push(`/dashboard/cow-deaths`);
    }, (error: any) => {
      enqueueSnackbar(t('Something went wrong, please try again'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    });

  }

  const getCowsByFamily = (localFamily: Prisma.FamilyCreateInput, setFieldValue: any = null) => {

    let query = {
      familyIdSearch: localFamily ? localFamily.id : '',
      isAliveOnly: true,
      filterCountry: true,
      status: [COW_INFARM, COW_DISPERSED, COW_PENDING, COW_ALIVE]
    }

    getCowsFromDatabase(query, (cows: Prisma.CowCreateInput[]) => {
      setCows(cows)

    }, (error: any) => {
      console.error('err', error);
    });
  }

  const getCowsByFarm = (localFarm: Prisma.FarmCreateInput, setFieldValue: any = null) => {

    let query = {
      farmIdSearch: localFarm ? localFarm.id : '',
      isAliveOnly: true,
      filterCountry: true,
      status: [COW_INFARM, COW_DISPERSED, COW_PENDING, COW_ALIVE]
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
        type: record?.type || "",
        option: record?.option || '',
        family: record?.family || undefined,
        farm: record?.farm || undefined,
        cow: record?.cow || undefined,
        deathCause: record?.deathCause || "",
        dateOfDeath: record?.dateOfDeath || todayDate,
        cowPic: record?.cowPic || undefined,
        report: record?.report || undefined,
        checkType: false,
      }}
      validationSchema={cowDeathFormSchema}
      enableReinitialize
      onSubmit={(values, { setSubmitting, setFieldError }) => onSubmit(values, setSubmitting, setFieldError)}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Card
          sx={{
            p: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Form>

                {
                  type != "Create"
                    ?
                    <>
                      {
                        values.type
                          ?
                          <>
                            {
                              values.type == "Family"
                                ?
                                <>
                                  <TextInputField
                                    name="family"
                                    type="text"
                                    value={values?.family?.name || ''}
                                    label={t("Family")}
                                    disabled={true}
                                  />
                                </>
                                :
                                <>
                                  <TextInputField
                                    name="farm"
                                    type="text"
                                    value={values?.farm?.name || ''}
                                    label={t("Farm")}
                                    disabled={true}
                                  />
                                </>
                            }
                          </>
                          :
                          <>
                          </>
                      }
                      <TextInputField
                        name="nfcID"
                        type="text"
                        value={values?.cow?.nfcId || ''}
                        label={t("Cow NFC ID")}
                        disabled={true}
                      />
                      <Typography variant='subtitle2'>
                        {t("Cow Photo")}:
                      </Typography>
                      <img className="h-auto w-[200px] border-solid border-2 border-black" style={{ borderRadius: '50%' }} src={values?.cow?.cowPhoto} alt="" />
                    </>
                    :
                    <>
                      <DropdownStringField
                        label={t('Type')}
                        disabled={record ? true : false}
                        items={types}
                        value={values.type}
                        onChangeValue={(value) => handleTypeChange(value, values, setFieldValue)}
                        hasError={errors.type && touched.type ? true : false}
                        errorMessage={errors.type}
                      />

                      <DropdownStringField
                        label={t('Option')}
                        disabled={record ? true : false}
                        items={methods}
                        value={values.option}
                        onChangeValue={(value) => handleOptionChange(value, values, setFieldValue)}
                        hasError={errors.option && touched.option ? true : false}
                        errorMessage={errors.option}
                      />

                      {
                        values.type
                          ?
                          <>
                            {
                              values.type == "Family"
                                ?
                                <>
                                  <DropdownField
                                    label={t('Family')}
                                    disabled={record ? true : false}
                                    items={families}
                                    placeholder={t('Select a Family')}
                                    value={values.family}
                                    onChangeValue={(value) => handleFamilyChange(value, values, setFieldValue)}
                                    hasError={errors.family && touched.family ? true : false}
                                    errorMessage={errors.family}
                                  />
                                </>
                                :
                                <>
                                  <DropdownField
                                    label={t('Farm')}
                                    disabled={record ? true : false}
                                    items={farms}
                                    placeholder={t('Select a farm')}
                                    value={values.farm}
                                    onChangeValue={(value) => handleFarmChange(value, values, setFieldValue)}
                                    hasError={errors.farm && touched.farm ? true : false}
                                    errorMessage={errors.farm}
                                  />
                                </>
                            }
                          </>
                          :
                          <>
                          </>
                      }


                      {
                        values.option === 'Select By NFC ID' && (values.farm !== "" || values.family !== "")
                          ?
                          <DropdownInputField
                            label={t('Cow NFC ID')}
                            customLabel='nfcId'
                            disabled={record ? true : false}
                            items={cows}
                            value={values.cow}
                            onChangeValue={(value) => handleNfcChange(value, values, setFieldValue)}
                            // onCallData={(inputValue: string) => getCows(inputValue)}
                            hasError={errors.cow && touched.cow ? true : false}
                            errorMessage={errors.cow}
                          />
                          :
                          <></>
                      }

                      {
                        values.option === 'Select By Photo' && (values.farm !== "" || values.family !== "")
                          ?
                          <DropdownInputImage
                            label={t('Cow Image')}
                            disabled={record ? true : false}
                            imageName={"cowPhoto"}
                            customLabel={"nfcId"}
                            items={cows}
                            value={values.cow.nfcId}
                            onChangeValue={(value) => handleNfcChange(value, values, setFieldValue)}
                            // onCallData={(inputValue: string) => getCows(inputValue)}
                            hasError={errors.cow && touched.cow ? true : false}
                            errorMessage={errors.cow}
                          />
                          :
                          <></>
                      }
                    </>
                }


                {
                  values.cow
                    ?
                    <>
                      <Datepicker
                        value={values.dateOfDeath}
                        label={t('Date of Death')}
                        maxDate={todayDate}
                        disabled={record ? true : false}
                        onChangeDate={(dateOfDeath) => { { setFieldValue('dateOfDeath', dateOfDeath) } }}
                        hasError={errors.dateOfDeath && touched.dateOfDeath ? true : false}
                        errorMessage={errors.dateOfDeath}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          {
                            cowPic
                              ?
                              <>
                                <div className="py-3">
                                  <Typography variant='subtitle2'>
                                    {t("Current Cow Pic")}:
                                  </Typography>
                                  {
                                    record?.cowPic
                                      ?
                                      <>
                                        <img className="h-auto w-60 border-solid border-2 border-black" src={record?.cowPic} alt="" />
                                      </>
                                      :
                                      <></>
                                  }
                                </div>
                              </>
                              :
                              <SingleFile
                                cropper={false}
                                onUpload={(cowPic) => { handleUpload('cowPic', cowPic, setFieldValue) }}
                                value={values.cowPic}
                                label={t('Cow Pic')}
                                hasError={errors.cowPic && touched.cowPic ? true : false}
                                errorMessage={errors.cowPic}
                              />
                          }
                        </Grid>

                        <Grid item xs={12} md={6}>
                          {
                            report

                              ?
                              <>
                                <div className="py-3">
                                  <Typography variant='subtitle2'>
                                    {t("Current Report")}:
                                  </Typography>
                                  {
                                    record?.report
                                      ?
                                      record?.reportFilename
                                        ?
                                        <div>
                                          <div className='my-5'>
                                            <a className='text-[18px] underline' href={record?.report}>{record?.reportFilename}</a>
                                          </div>
                                        </div>
                                        :
                                        (
                                          <>
                                            <img className="h-auto w-60 border-solid border-2 border-black" src={record?.report} alt="" />
                                          </>
                                        )
                                      :
                                      <></>
                                  }
                                </div>
                              </>
                              :
                              <SingleFile
                                cropper={false}
                                acceptPDF={true}
                                onUpload={(report) => { handleUpload('report', report, setFieldValue) }}
                                value={values.report}
                                label={t('Report')}
                                hasError={errors.report && touched.report ? true : false}
                                errorMessage={errors.report}
                              />
                          }
                        </Grid>
                      </Grid>

                      <TextareaField
                        name='deathCause'
                        value={values.deathCause}
                        label={t('Death Cause')}
                        disabled={record ? true : false}
                        onChangeText={(deathCause) => { setFieldValue('deathCause', deathCause) }}
                        hasError={errors.deathCause && touched.deathCause ? true : false}
                        errorMessage={errors.deathCause}
                      />

                      {
                        type == "Rejection"
                          ?
                          <TextareaField
                            name='rejectedReason'
                            value={record ? record.rejectedReason : "-"}
                            label={t('Rejected Reason')}
                            disabled={record ? true : false}
                            onChangeText={(rejectedReason) => { setFieldValue('rejectedReason', rejectedReason) }}
                            hasError={errors.deathCause && touched.deathCause ? true : false}
                            errorMessage={errors.deathCause}
                          />
                          :
                          <></>
                      }

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

export default CowDeathForm;
