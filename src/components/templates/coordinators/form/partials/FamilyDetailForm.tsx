import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, FormHelperText, Grid, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { FieldArray } from 'formik';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import { useEffect, useState } from 'react';
import { useS3Upload } from 'next-s3-upload';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';



interface familyDetailProps {
  values: any,
  single_coordinator: any,
  setFieldValue: any,
  errors: any,
  touched: any,
  disabled?: boolean,
}

function FamilyDetailForm({
  values,
  single_coordinator,
  setFieldValue,
  errors,
  touched,
  disabled = false,
}: familyDetailProps) {
  const { t }: { t: any } = useTranslation();

  const [familyPhoto, setFamilyPhoto] = useState(null)
  const [housePhoto, setHousePhoto] = useState(null)
  const [applicationForm, setApplicationForm] = useState(null)

  useEffect(() => {
    setFamilyPhoto(single_coordinator?.familyPhoto ? true : false)
    setHousePhoto(single_coordinator?.housePhoto ? true : false)
    setApplicationForm(single_coordinator?.applicationForm ? true : false)
  }
    , [single_coordinator?.familyPhoto, single_coordinator?.housePhoto, single_coordinator?.applicationForm]);

  let { uploadToS3 } = useS3Upload();

  const handleUpload = async (field: string, file: any, setFieldValue: any) => {

    if (file) {
      let { url } = await uploadToS3(file)
      setFieldValue(field, url)

      if(field == "applicationForm"  && file.type == "application/pdf"){
        setFieldValue("applicationFormFilename", file.name)
      }

    }
  }

  function changeGender(value: any, child: any, setFieldValue: any) {
    child.childGender = value
    setFieldValue("values.children", child)
  }

  function changeDateOfBirth(value: any, child: any, setFieldValue: any) {
    child.dateOfBirth = value;
    setFieldValue("values.children", child);
  }

  return (
    <>
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
            {t('Family Details')}
          </Typography>{' '}
        </Box>

        <TextInputField
          name='spouseName'
          value={values.spouseName}
          label={t('Spouse Name')}
          onChangeText={(spouseName) => { setFieldValue('spouseName', spouseName); }}
          hasError={errors.spouseName && touched.spouseName ? true : false}
          errorMessage={errors.spouseName}
          disabled={disabled}
        />

        {familyPhoto ?
          <>
            <div className="py-3">
              <Typography variant='subtitle2'>
                {t("Current Coordinator Family Photo")}:
              </Typography>
              <img className="h-auto w-60 border-solid border-2 border-black" src={single_coordinator?.familyPhoto} alt="" />
              {
                disabled ?
                  <></>
                  :
                  <>
                    <Box className='pl-11'>
                      <Button
                        sx={{
                          mt: 1
                        }}
                        color="error"
                        onClick={() => { setFamilyPhoto(false); setFieldValue('familyPhoto', null) }}
                        size="large"
                        variant="contained"
                      >
                        {t('Delete Image')}
                      </Button>
                    </Box>
                  </>
              }
            </div>
          </>
          :

          <SingleFile
            cropper={false}
            onUpload={(familyPhoto) => { handleUpload('familyPhoto', familyPhoto, setFieldValue) }}
            value={values.familyPhoto}
            label={t('Family Photo')}
            hasError={errors.familyPhoto && touched.familyPhoto ? true : false}
            errorMessage={errors.familyPhoto}
          />

        }

        {housePhoto ?
          <>
            <div className="py-3">
              <Typography variant='subtitle2'>
                {t("Current Coordinator House Photo")}:
              </Typography>
              <img className="h-auto w-60 border-solid border-2 border-black" src={single_coordinator?.housePhoto} alt="" />
              {
                disabled ?
                  <></>
                  :
                  <>
                    <Box className='pl-11'>
                      <Button
                        sx={{
                          mt: 1
                        }}
                        color="error"
                        onClick={() => { setHousePhoto(false); setFieldValue('housePhoto', null) }}
                        size="large"
                        variant="contained"
                      >
                        {t('Delete Image')}
                      </Button>
                    </Box>
                  </>
              }
            </div>
          </>

          :

          <SingleFile
            cropper={false}
            onUpload={(housePhoto) => { handleUpload('housePhoto', housePhoto, setFieldValue) }}
            value={values.housePhoto}
            label={t('House Photo')}
            hasError={errors.housePhoto && touched.housePhoto ? true : false}
            errorMessage={errors.housePhoto}
          />
        }

        {applicationForm ?
          <>
            <div className="py-3">
              <Typography variant='subtitle2'>
                {t("Current Coordinator Application Form")}:
              </Typography>

              {
                single_coordinator?.applicationFormFilename !== ""
                  ?
                  <div>
                    <div className='my-5'>
                      <a className='text-[18px] underline' href={single_coordinator?.applicationForm}>{single_coordinator?.applicationFormFilename}</a>
                    </div>
                    <Button
                      sx={{
                        mt: 1
                      }}
                      color="error"
                      onClick={() => { setApplicationForm(false); setFieldValue('applicationForm', null) }}
                      size="large"
                      variant="contained"
                    >
                      {t('Delete File')}
                    </Button>
                  </div>
                  :
                  <>
                    <img className="h-auto w-60 border-solid border-2 border-black" src={single_coordinator?.applicationForm} alt="" />
                    {
                      disabled ?
                        <>
                          {/* <Box
              display="flex"
              alignItems="center"
              >
              <Enlarge
                image = {single_coordinator?.applicationForm}
              />
              <Button
                sx={{
                  mt: 1,
                  ml: 1,
                  px: 2
                }}
                color="primary"
                onClick={() => {downloadFileHelper(single_coordinator?.applicationForm, single_coordinator?.secondaryId, "_Coordinator_Application_Form")}}
                size="large"
                variant="contained"
              >
                {t('Download')}
              </Button>
            </Box> */}
                        </>
                        :
                        <Button
                          sx={{
                            mt: 1,
                            ml: 5,
                          }}
                          color="error"
                          onClick={() => { setApplicationForm(false); setFieldValue('applicationForm', null) }}
                          size="large"
                          variant="contained"
                        >
                          {t('Delete Image')}
                        </Button>
                    }
                  </>
              }

            </div>
          </>
          :

          <SingleFile
            cropper={false}
            acceptPDF={true}
            onUpload={(applicationForm) => { handleUpload('applicationForm', applicationForm, setFieldValue) }}
            value={values.applicationForm}
            label={t('Application Form')}
            hasError={errors.applicationForm && touched.applicationForm ? true : false}
            errorMessage={errors.applicationForm}
          />
        }

        <TextInputField
          name='typeOfAnimalAllowed'
          value={values.typeOfAnimalAllowed}
          label={t('Type of Animal Allowed')}
          onChangeText={(typeOfAnimalAllowed) => { setFieldValue('typeOfAnimalAllowed', typeOfAnimalAllowed) }}
          hasError={errors.typeOfAnimalAllowed && touched.typeOfAnimalAllowed ? true : false}
          errorMessage={errors.typeOfAnimalAllowed}
          disabled={true}
        />

        <TextInputField
          name='noAnimalsAllocated'
          value={values.noAnimalsAllocated}
          label={t('No. Animals Allocated')}
          type='number'
          onChangeText={(noAnimalsAllocated) => { setFieldValue('noAnimalsAllocated', noAnimalsAllocated); }}
          hasError={errors.noAnimalsAllocated && touched.noAnimalsAllocated ? true : false}
          errorMessage={errors.noAnimalsAllocated}
          disabled={disabled}
        />

      </Card>

      <Card
        sx={{
          p: 2,
          m: 1,
          mt: 2,
        }}
      >

        <FieldArray
          name="children"
          render={arrayHelpers => (
            <>
              <Grid container>
                <Box
                  sx={{
                    pl: 1,
                    flexGrow: 1
                  }}>
                  <Typography component="span" variant="subtitle1">
                    {t('Children')}
                  </Typography>{' '}
                </Box>
                <Box
                  marginRight={4}
                >
                  {
                    !disabled &&
                    <Button
                      variant="contained"
                      type="button"
                      color='primary'
                      onClick={() => arrayHelpers.push({ childGender: '', dateOfBirth: '' })}
                    >
                      {t("Add")}
                    </Button>
                  }
                </Box>
              </Grid>
              {values.children.map((child: any, index: any) => (
                <Grid container key={index} alignItems="center" gap={1} wrap="nowrap" >
                  <Grid xs={10} item={true} display={"flex"} flexDirection={"row"}>
                    <Grid xs={10} mr={2}>
                      <DropdownStringField
                        key={`children[${index}].childGender`}
                        items={childrenGenders}
                        label={t('Gender')}
                        placeholder='Male'
                        value={child.childGender}
                        onChangeValue={(value) => changeGender(value, child, setFieldValue)}
                        hasError={errors && errors.children && errors.children[index] && errors.children[index].childGender ? true : false}
                        errorMessage={errors && errors.children && errors.children[index] && errors.children[index].childGender ? errors.children[index].childGender : ""}
                        disabled={disabled}
                      />
                    </Grid>

                    <Grid xs={10}>
                      <Datepicker
                        key={`children[${index}].dateOfBirth`}
                        label={t('Date of Birth')}
                        value={child.dateOfBirth}
                        maxDate={new Date()}
                        disabled={disabled}
                        onChangeDate={(value) => { { changeDateOfBirth(value, child, setFieldValue) } }}
                        hasError={errors && errors.children && errors.children[index] && errors.children[index].dateOfBirth ? true : false}
                        errorMessage={errors && errors.children && errors.children[index] && errors.children[index].dateOfBirth ? errors.children[index].dateOfBirth : ""}
                      />
                    </Grid>

                  </Grid>

                  <Grid alignContent='flex-end' style={{ marginRight: 'auto', marginLeft: 'auto' }} item={true}>
                    {
                      !disabled &&
                      <Button
                        variant='outlined'
                        type="button"
                        color='error'
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        {t("Remove")}
                      </Button>
                    }
                  </Grid>
                </Grid>
              ))}

            </>
          )}
        />
      </Card>
    </>
  )
}

const childrenGenders = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  }
]

export default FamilyDetailForm;