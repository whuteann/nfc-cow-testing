
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Card, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';

interface townAddressProps {
  values: any,
  townvillages: any,
  setFieldValue: any,
  errors: any,
  touched: any,
  disabled?: boolean,
}

function TownAddressForm({
  values,
  townvillages, 
  setFieldValue, 
  errors, 
  touched,
  disabled = false,
}:townAddressProps) {
  const { t }: { t: any } = useTranslation();

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
        {t('Village Details')}
      </Typography>{' '}
    </Box>

    <TextInputField
      name='policeStationThanaName'
      value={values.policeStationThanaName}
      label={t('Police Station/Thana Name')}
      onChangeText={(policeStationThanaName) => { setFieldValue('policeStationThanaName', policeStationThanaName) }}
      hasError={errors.policeStationThanaName && touched.policeStationThanaName ? true : false}
      errorMessage={errors.policeStationThanaName}
      disabled={disabled}
    />

    <TextInputField
      name='postOfficeName'
      value={values.postOfficeName}
      label={t('Post Office Name')}
      onChangeText={(postOfficeName) => { setFieldValue('postOfficeName', postOfficeName) }}
      hasError={errors.postOfficeName && touched.postOfficeName ? true : false}
      errorMessage={errors.postOfficeName}
      disabled={disabled}
    />

    <TextInputField
      name='district'
      value={values.district}
      label={t('District')}
      placeholder={'Select a village first'}
      disabled={true}
    />

    <DropdownInputField
      items= {townvillages}
      label= {t("Village Name")}
      onChangeValue={(townVillage) => { 
        townVillage ? setFieldValue('townVillage', townVillage) : setFieldValue('townVillage', '')

        setFieldValue('district', townVillage?.district?.name);
      }}
      value={values.townVillage}
      hasError={errors.townVillage && touched.townVillage ? true : false}
      errorMessage={errors.townVillage}
      disabled={disabled}
    />
  
    </Card>
  )
}

export default TownAddressForm;
