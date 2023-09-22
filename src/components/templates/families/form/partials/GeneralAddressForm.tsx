
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Card, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import { ITownVillage } from '@/models/TownVillage';

interface generalAddressProps {
  values: any, 
  townvillages: any, 
  setFieldValue: any, 
  errors: any, 
  touched: any,
  disabled?: boolean,
}

function GeneralAddressForm({
  values, 
  townvillages, 
  setFieldValue, 
  errors, 
  touched,
  disabled = false
}: generalAddressProps) {
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
        {t('Address Details')}
      </Typography>{' '}
    </Box>

    <TextInputField
      name='address'
      value={values.address}
      label={t('Address')}
      onChangeText={(address) => { setFieldValue('address', address); }}
      hasError={errors.address && touched.address ? true : false}
      errorMessage={errors.address}
      disabled={disabled}
    />

    <TextInputField
      name='unionCouncil'
      value={values.unionCouncil}
      label={t('Union Council')}
      onChangeText={(unionCouncil) => { setFieldValue('unionCouncil', unionCouncil) }}
      hasError={errors.unionCouncil && touched.unionCouncil ? true : false}
      errorMessage={errors.unionCouncil}
      disabled={disabled}
    />

    <TextInputField
      name='province'
      value={values.province}
      label={t('Province')}
      onChangeText={(province) => { setFieldValue('province', province) }}
      hasError={errors.province && touched.province ? true : false}
      errorMessage={errors.province}
      disabled={disabled}
    />

    <TextInputField
      name='nearestFamousLandmark'
      value={values.nearestFamousLandmard}
      label={t('Nearest/Famous Landmark')}
      onChangeText={(nearestFamousLandmard) => { setFieldValue('nearestFamousLandmard', nearestFamousLandmard) }}
      hasError={errors.nearestFamousLandmard && touched.nearestFamousLandmard ? true : false}
      errorMessage={errors.nearestFamousLandmard}
      disabled={disabled}
    />

    <TextInputField
      name='cityName'
      value={values.cityName}
      label={t('City')}
      onChangeText={(cityName) => { setFieldValue('cityName', cityName) }}
      hasError={errors.cityName && touched.cityName ? true : false}
      errorMessage={errors.cityName}
      disabled={disabled}
    />

    <TextInputField
      name='district'
      value={values.district}
      label={t('District')}
      placeholder={'Select a town first'}
      disabled={true}
    />

    <DropdownInputField
      items= {townvillages}
      label= {t("Village Name")}
      value= {values.townVillage}
      onChangeValue={(townVillage: any) => { setFieldValue('townVillage', townVillage || ''); setFieldValue('district', townVillage?.district?.name || "")}}
      hasError={errors.townVillage && touched.townVillage ? true : false}
      errorMessage={errors.townVillage}
      disabled={disabled}
    />
  </Card>
  )
}

export default GeneralAddressForm;
