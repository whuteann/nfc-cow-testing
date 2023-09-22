import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Card, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import { PlayDisabledTwoTone } from '@mui/icons-material';

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
}: townAddressProps) {
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
          {t('Town Details')}
        </Typography>{' '}
      </Box>

      <TextInputField
        name='flatNumber'
        value={values.flatNumber}
        label={t('Flat Number')}
        onChangeText={(flatNumber) => { setFieldValue('flatNumber', flatNumber) }}
        hasError={errors.flatNumber && touched.flatNumber ? true : false}
        errorMessage={errors.flatNumber}
        disabled={disabled}
      />

      <TextInputField
        name='buildingName'
        value={values.buildingName}
        label={t('Building Name')}
        onChangeText={(buildingName) => { setFieldValue('buildingName', buildingName) }}
        hasError={errors.buildingName && touched.buildingName ? true : false}
        errorMessage={errors.buildingName}
        disabled={disabled}
      />

      <TextInputField
        name='address'
        value={values.address}
        label={t('Address')}
        onChangeText={(address) => { setFieldValue('address', address) }}
        hasError={errors.address && touched.address ? true : false}
        errorMessage={errors.address}
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
        label= {t("Town Name")}
        onChangeValue={(townVillage) => { 
          townVillage ? setFieldValue('townVillage', townVillage) : setFieldValue('townVillage', '')

          setFieldValue('district', townVillage?.district?.name);
        }}
        value={values.townVillage}
        hasError={errors.townVillage && touched.townVillage ? true : false}
        errorMessage={errors.townVillage}
        disabled={disabled}
      />

      <TextInputField
        name='areaName'
        value={values.areaName}
        label={t('Area Name')}
        onChangeText={(areaName) => { setFieldValue('areaName', areaName) }}
        hasError={errors.areaName && touched.areaName ? true : false}
        errorMessage={errors.areaName}
        disabled={disabled}
      />
    </Card>
  )
}

export default TownAddressForm;
