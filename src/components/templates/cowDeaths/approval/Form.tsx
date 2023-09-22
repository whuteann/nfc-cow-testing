import {
  Card,
  Grid,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { useEffect, useState } from 'react';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { editStatus } from '@/services/cow_deaths/CowDeathsServices';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { ICow } from '@/models/Cow';
import { IFamilyCoordinator } from '@/models/Family';
import { IFarm } from '@/models/Farm';
import { id } from 'date-fns/locale';


// TODO : SHOW WEANED-OFF CALVES

interface FormProps {
  record ?: any;
  cows?: ICow[];
  farms?: IFarm[];
  type?: "View" | "Approval" | "Rejection";
  families?: IFamilyCoordinator[];
  farm?: any;
  disabled?: boolean;
  setFarm?: (farm:any)=>void;
  setFamily?: (family:any)=>void;
}

const todayDate = new Date();

function CowDeathApprovalForm({ 
  record = null,
  cows = [],
  farms = [],
  families = [],
  disabled = false,
}:FormProps) {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const [cowPic, setCowPic] = useState(null)
  const [report, setReport] = useState(null)

  useEffect(() => {
    setCowPic(record?.cowPic ? true : false)
  }, [record?.cowPic]);

  useEffect(() => {
    setReport(record?.report ? true : false)
  }, [record?.report]);
  
  const { enqueueSnackbar } = useSnackbar();

  // let approval: any = null;

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [RejectPopUp, setRejectPopUp] = useState(false);

  const onSubmit = async (values:any, setSubmitting:any) => {
    updateRequest(values, setSubmitting)
  };

  const updateRequest = (values:any , setSubmitting: any) => {
    // const id = record?.id;
    // const rejectedReason = values.rejectedReason

    if(values.farm){
      delete values.checkType;
      delete values.family;
    }else{
      delete values.checkType;
      delete values.farm;
    }

    return editStatus(values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Record Has Been Updated Successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      router.push(`/dashboard/cow-deaths/approvals`);
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
    

    // return editStatus(values, approval, id, rejectedReason, () => {
    //   setSubmitting(false);
    //   enqueueSnackbar(t('The Record Has Been Updated Successfully'), {
    //     variant: 'success',
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right'
    //     },
    //   });

    //   router.push(`/dashboard/cow-deaths/approvals`);
    // }, (error: any) => {
    //   enqueueSnackbar(t('Something went wrong, please try again'), {
    //   variant: 'error',
    //   anchorOrigin: {
    //     vertical: 'top',
    //     horizontal: 'right'
    //   },
    // });

    // setErrorMessage(error.data);
    // setSubmitting(false);
    // setHasError(true);
    // });
  }

  return (
    <Formik
      initialValues={{
        id: record?.id || '',
        type: record?.type || "",
        option: record?.option || '' ,
        farm: record?.farm || undefined,
        family: record?.family || undefined,
        cow: record?.cow || undefined,
        deathCause: record?.deathCause || "",
        dateODeath: record?.dateODeath || todayDate,
        cowPic: record?.cowPic || undefined,
        report: record?.report || undefined,
        checkType: false,
        rejectedReason: "",
      }}
      enableReinitialize
      onSubmit={ (values, { setSubmitting }) => {
        onSubmit(values, setSubmitting);
      }}
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
                      name="nfcId"
                      type="text"
                      value={values?.cow?.nfcId || ''}
                      label={t("Cow NFC ID")}
                      disabled={true}
                    />
                    <Typography variant='subtitle2'>
                      {t("Cow Photo")}:
                    </Typography>
                    <img className="h-auto w-[200px] border-solid border-2 border-black" style={{ borderRadius: '50%' }} src = {values?.cow?.cowPhoto} alt="" />     
                  </>
              

                

                <>
                  <Datepicker
                    value={values.dateODeath}
                    label={t('Date of Death')}
                    maxDate={todayDate}
                    disabled = {record ? true : false}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      {
                        record && record?.cowPic
                        ?
                          record?.cowPic.filename
                          ?
                          <div>
                            <div className='my-5'>
                              <a className='text-[18px] underline' href={record?.cowPic.link}>{record?.cowPic.filename}</a>
                            </div>
                          </div>
                          :
                          (
                            <>
                              <img className="h-auto w-60 border-solid border-2 border-black" src = {record?.cowPic} alt="" />
                            </>
                          )
                        :
                          <></>
                      }
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {
                        record && record?.report
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
                              <img className="h-auto w-60 border-solid border-2 border-black" src = {record?.report} alt="" />
                            </>
                          )
                        :
                          <></>
                      }
                    </Grid>
                  </Grid>

                  <TextareaField
                    name='deathCause'
                    value={values.deathCause}
                    label={t('Death Cause')}
                    disabled = {record ? true : false}
                  />
                </>

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
                        name='rejectedReason'
                        value={values.rejectedReason}
                        label={t('Rejected Reason')}
                        onChangeText={(rejectedReason) => { setFieldValue('rejectedReason', rejectedReason) }}
                        hasError={errors.rejectedReason && touched.rejectedReason ? true : false}
                        errorMessage={errors.rejectedReason}
                      />
                      <Button
                        sx={{
                          mt: 3
                        }}
                        color="primary"
                        type="submit"
                        onClick={(approval) => {setFieldValue('approval', 'Rejected') }}
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
                            onClick={() => {setRejectPopUp(true);}}
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
                            type="submit"
                            onClick={(approval) => {setFieldValue('approval', 'Approved') }}
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
            </Grid>
          </Grid>
        </Card>
      )}
    </Formik>
  );
}

export default CowDeathApprovalForm;
