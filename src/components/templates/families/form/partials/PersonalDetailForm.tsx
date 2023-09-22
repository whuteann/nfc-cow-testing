import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import { useEffect, useState } from 'react';

import { useS3Upload } from "next-s3-upload";
import { deleteFileHelper } from '@/helpers/S3Helper';

interface personalDetailProps {
  single_family: any,
  coordinators: any,
  values: any,
  setFieldValue: any,
  errors: any,
  touched: any,
  disabled?: boolean,
  replaceNfc?: boolean,
  nfcError?: boolean
}

function PersonalDetailForm({
  single_family,
  coordinators,
  values,
  setFieldValue,
  errors,
  touched,
  disabled = false,
  replaceNfc = false,
  nfcError = false,
}: personalDetailProps) {
  const { t }: { t: any } = useTranslation();
  const [headShot, setHeadshot] = useState(null)

  useEffect(() => {
    setHeadshot(single_family?.headshot ? true : false)
  }, [single_family?.headshot]);

  let { uploadToS3 } = useS3Upload();

  const handleUpload = async (field: string, file: any, setFieldValue: any) => {


    if (file){
      let { url } = await uploadToS3(file) 
      setFieldValue(field, url)
    
    }
  }

  return (
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
          {t('Personal Details')}
        </Typography>{' '}
      </Box>

      <TextInputField
        name='name'
        value={values.name}
        label={t('Name')}
        onChangeText={(name) => { setFieldValue('name', name) }}
        hasError={errors.name && touched.name ? true : false}
        errorMessage={errors.name}
        disabled={disabled}
      />

      {single_family
        &&
        <TextInputField
          name='nfcID'
          value={values.nfcID}
          label={("nfcID" in single_family && single_family.nfcID !== null && single_family.nfcID !== "") && replaceNfc ? t('Old NFC ID') : t('NFC ID')}
          disabled={true}
          hasError={errors.nfcID && touched.nfcID ? true : false}
          errorMessage={errors.nfcID}
        />
      }

      {single_family
        &&
        replaceNfc
        &&
        ("nfcID" in single_family && single_family.nfcID !== null && single_family.nfcID !== "")
        &&
        <TextInputField
          name='newNfcID'
          value={values.newNfcID}
          label={t('New NFC ID')}
          onChangeText={(newNfcID) => { setFieldValue('newNfcID', newNfcID) }}
          hasError={nfcError}
          errorMessage={"NFC ID cannot be blank"}
        />
      }

      <TextInputField
        name='nationalID'
        value={values.nationalID}
        label={t('National ID')}
        onChangeText={(nationalID) => { setFieldValue('nationalID', nationalID) }}
        hasError={errors.nationalID && touched.nationalID ? true : false}
        errorMessage={errors.nationalID}
        disabled={disabled}
      />

      <TextInputField
        name='notes'
        value={values.notes}
        label={t('Notes')}
        onChangeText={(notes) => { setFieldValue('notes', notes) }}
        hasError={errors.notes && touched.notes ? true : false}
        errorMessage={errors.notes}
        disabled={disabled}
      />

      <TextInputField
        name='contact'
        value={values.contact}
        label={t('Contact')}
        onChangeText={(contact) => { setFieldValue('contact', contact) }}
        hasError={errors.contact && touched.contact ? true : false}
        errorMessage={errors.contact}
        disabled={disabled}
      />

      <TextInputField
        name='religion'
        value={values.religion}
        label={t('Religion')}
        onChangeText={(religion) => { setFieldValue('religion', religion) }}
        hasError={errors.religion && touched.religion ? true : false}
        errorMessage={errors.religion}
        disabled={disabled}
      />

      {headShot ?
        <>
          <div className="py-3">
            <Typography variant='subtitle2'>
              {t("Current Family Chief Headshot")}:
            </Typography>
            <img className="h-auto w-60 border-solid border-2 border-black" style={{ borderRadius: '50%' }} src={single_family?.headshot} alt="" />
            {
              !disabled &&
              <Button
                sx={{
                  mt: 1
                }}
                color="error"
                onClick={() => { setHeadshot(false); setFieldValue("headshot", null) }}
                size="large"
                variant="contained"
              >
                {t('Delete Image')}
              </Button>
            }
          </div>
        </>
        :
        <SingleFile
          cropper={true}
          onUpload={(headshot) => { handleUpload('headshot', headshot, setFieldValue) }}
          value={values.headshot}
          label={t('Family Chief Headshot')}
          hasError={errors.headshot && touched.headshot ? true : false}
          errorMessage={errors.headshot}
        />
      }

      <DropdownInputField
        items={coordinators}
        label={t("Coordinator")}
        onChangeValue={(coordinator) => { coordinator ? setFieldValue('coordinator', coordinator) : setFieldValue('coordinator', '') }}
        value={values.coordinator}
        hasError={errors.coordinator && touched.coordinator ? true : false}
        errorMessage={errors.coordinator}
        disabled={disabled}
      />

    </Card>
  )
}

export default PersonalDetailForm;
