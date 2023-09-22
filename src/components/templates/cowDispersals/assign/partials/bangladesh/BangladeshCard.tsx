import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import DropdownInputImage from '@/components/atoms/Input/dropdown/DropdownInputImage';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import { BANGLADESH_HEIGHT_UNIT, BANGLADESH_WEIGHT_UNIT } from '@/constants/units';
import { paginateDropdown } from '@/services/cow/CowServices';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { values } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useS3Upload } from 'next-s3-upload';
import { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { TbCurrencyTaka } from 'react-icons/tb';
import { changeCreateCowBool, cowOptions, changeNFCID, changeCowPrice, changeWeight, cowsGenders, changeGender, changeTransportPrice, changeTaxPrice, changeCoordinatorHelperExpenses, changeDispersalDate, changeSignedLegalDoc, changeCow, changeColour, changeHeight, changePurchaseDate, changeSignedDispersalAgreement, changeCowWithFamilyPhoto, changeCowPhoto, changeMonths, changeYear } from '../subFormComponents';

interface cardProps {
  index: number,
  cow: any,
  values: any,
  errors: any,
  touched: any,
  setFieldValue: any,
  setErrors: any,
  arrayHelpers: any,
}

const BangladeshCard = ({
  index,
  cow,
  values,
  errors,
  touched,
  setFieldValue,
  setErrors,
  arrayHelpers
}: cardProps) => {
  const { t }: { t: any } = useTranslation();

  const [search, setSearch] = useState('');
  const [cows, setCows] = useState([]);

  let { uploadToS3 } = useS3Upload();

  const handleUpload = async (field: any, cow: any, file: any, setFieldValue: any) => {


    if (file) {
      let { url } = await uploadToS3(file)

      if (field === 'cowPhoto') {
        changeCowPhoto(url, cow, setFieldValue)
      }

      if (field === 'cowWithFamilyPhoto') {
        changeCowWithFamilyPhoto(url, cow, setFieldValue)
      }

      if (field === 'newLegalPhoto') {
        changeSignedDispersalAgreement(url, cow, setFieldValue)
        if (file.type == "application/pdf") {
          cow.signedDispersalAgreementFilename = file.name;
        }
      }


    }
  }


  const onCowOptionChange = (value: any) => {
    getCows();
    changeCow({}, setFieldValue);
    setFieldValue(`cows.${index}.cowOption`, value);
  }

  const [maxPurchaseDate, setMaxPurchaseDate] = useState(new Date(values.date))

  useEffect(() => {
    if (cow.dispersalDate) {
      setMaxPurchaseDate(new Date(cow.dispersalDate))
    }
  }, [cow.dispersalDate])

  const changeCow = (value: any, setFieldValue: any) => {
    //Real Data
    cow.id = value?.id || null;
    cow.nfcId = value?.nfcId || null;
    cow.cowPhoto = value?.cowPhoto || null;
    cow.cowPrice = value?.cowPrice || "";
    cow.weight = value?.weight || "";
    cow.gender = value?.gender || null;
    cow.dispersalDate = value?.dispersalDate || null;
    cow.newCowPhoto = value?.newCowPhoto || null;
    cow.cowWithFamilyPhoto = value?.cowWithFamilyPhoto || null;

    if (values.pakistanCheck == true) {
      cow.transportPrice = value?.transportPrice || "";
      cow.taxPrice = value?.taxPrice || "";
      cow.coordinatorHelperExpenses = value?.coordinatorHelperExpenses ||"";
      cow.signedLegalDoc = value?.signedLegalDoc || null;
    } else {
      cow.ageYear = value?.ageYear || "";
      cow.ageMonth = value?.ageMonth || "";

      cow.height = value?.height || "";
      cow.purchaseDate = value?.purchaseDate || null;
      cow.signedDispersalAgreement = value?.signedDispersalAgreement || null;
      cow.colour = value?.colour || null;
    }

    setFieldValue(`cows.${index}`, cow);
  }

  const getCows = async (localSearch: string = '') => {
    await paginateDropdown(values.country.id, localSearch != '' ? localSearch : search, "", (data: any) => {

      setCows(data || []);
    }, (err: any) => {
      console.error('err', err);
    });
  }


  return (
    <Card
      sx={{
        p: 2,
        m: 1
      }}
    >
      <Grid container sx={{
        mt: 0,
      }}>
        <Box
          sx={{
            pl: 1,
            flexGrow: 1
          }}>
          <Typography component="span" variant="subtitle1">
            {t("Cow") + ` ${index + 1}`}
          </Typography>{' '}
        </Box>

        <Box
          marginRight={2}
        >
          {
            cow.status == "Dispersed"
              ?
              <></>
              :
              <Button
                variant='contained'
                type="button"
                color={cow.createCow == false ? 'success' : 'secondary'}
                onClick={() => { changeCreateCowBool(cow.createCow, cow, setFieldValue, setErrors) }}
              >
                {cow.createCow == false ? t('New Cow') : t('Existing Cow')}
              </Button>
          }
        </Box>

        <Box
          marginRight={0}
        >
          {
            cow.status == "Dispersed"
              ?
              <></>
              :
              <Button
                variant='outlined'
                type="button"
                color='error'
                onClick={() => { arrayHelpers.remove(index) }}
              >
                {t("Remove")}
              </Button>
          }
        </Box>
      </Grid>

      <Grid container key={index} alignItems="center" spacing={1} columns={12}>
        {
          cow.createCow == false &&
          <>
            <Grid xs={12} item={true}>
              <div id={`cows.${index}.cowOption`} />
              <DropdownStringField
                items={cowOptions}
                value={cow.cowOption}
                label={t("Select Option")}
                placeholder={t("Option")}
                onChangeValue={(value) => { onCowOptionChange(value) }}
                hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowOption && touched && touched.cows && touched.cows[index] && touched.cows[index].cowOption ? true : false}
                errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowOption ? errors?.cows[index]?.cowOption : ""}
              />
            </Grid>
            <Grid xs={12} item={true}>
              <div id={`cows.${index}.nfcId`} />
              {
                cow.cowOption
                  ?
                  <>
                    {
                      cow.cowOption === "Select By NFC ID"
                        ?
                        <DropdownInputField
                          label={t('Cow NFC ID')}
                          customLabel='nfcId'
                          items={cows}
                          value={cow}
                          onChangeValue={(chosenCow) => {
                            changeCow(chosenCow, setFieldValue);
                          }}
                          onCallData={(inputValue: string) => getCows(inputValue)}
                          hasError={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcId && touched && touched.cows && touched.cows[index] && touched.cows[index].nfcId ? true : false}
                          errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcId ? errors?.cows[index]?.nfcId : ""}
                        />
                        :
                        <DropdownInputImage
                          label={t('Cow Image')}
                          customLabel='nfcId'
                          items={cows}
                          value={cow}
                          onChangeValue={(chosenCow) => {
                            changeCow(chosenCow, setFieldValue);
                          }}
                          imageName='cowPhoto'
                          onCallData={(inputValue: string) => getCows(inputValue)}
                          hasError={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcId && touched && touched.cows && touched.cows[index] && touched.cows[index].nfcId ? true : false}
                          errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcId ? errors?.cows[index]?.nfcId : ""}
                        />
                    }
                  </>
                  :
                  <></>
              }
            </Grid>
          </>
        }

        {
          cow.createCow == true &&
          <>
            <Grid xs={12} md={(cow.createCow == true || values.cows[index].nfcId) ? 6 : 12} item={true}>
              <div id={`cows.${index}.nfcId`} />
              <TextInputField
                name="nfcId"
                type="text"
                value={cow.nfcId || ''}
                label={t("Cow NFC ID")}
                onChangeText={(value) => changeNFCID(value, cow, setFieldValue)}
                hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].nfcId && touched && touched.cows && touched.cows[index] && touched.cows[index].nfcId ? true : false}
                errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].nfcId ? errors?.cows[index]?.nfcId : ""}
              />
            </Grid>

            {
              (cow.createCow == true || values.cows[index].nfcId) &&
              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.cowPrice`} />
                <TextInputField
                  name="cowPrice"
                  type="number"
                  value={cow.cowPrice || '0'}
                  disabled={cow.status == "Dispersed"}
                  label={t("Price of Cow")}
                  hasIcon={true}
                  icon={
                    values.pakistanCheck === false
                      ?
                      <IconContext.Provider value={{ size: '25px' }}>
                        <div>
                          <TbCurrencyTaka />
                        </div>
                      </IconContext.Provider>
                      :
                      <p className="text-base">Rs</p>
                  }
                  iconPosition={"left"}
                  onChangeText={(value) => changeCowPrice(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPrice && touched && touched.cows && touched.cows[index] && touched.cows[index].cowPrice ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPrice ? errors?.cows[index]?.cowPrice : ""}
                />
              </Grid>
            }

            <Grid xs={12} item={true}>
              <div id={`cows.${index}.cowPhoto`} />
              <SingleFile
                cropper={true}
                shape={"rect"}
                onUpload={(cowPhoto) => {
                  handleUpload('cowPhoto', cow, cowPhoto, setFieldValue)
                }}
                label={t('Cow Photo')}
                value={values.cowPhoto}
                hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPhoto && touched && touched.cows && touched.cows[index] && touched.cows[index].cowPhoto ? true : false}
                errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPhoto ? errors?.cows[index]?.cowPhoto : ""}
              />
            </Grid>
          </>
        }
      </Grid>
      {
        cow.status == "Dispersed"
          ?
          <>
            <Grid xs={12} item={true}>
              <TextInputField
                name="nfcId"
                type="text"
                value={cow.nfcId || ''}
                label={t("Cow NFC ID")}
                disabled={true}
              />
              <Typography variant='subtitle2'>
                {t("Current Cow Photo") + ":"}
              </Typography>
              <img className="h-auto w-[200px] border-solid border-2 border-black" src={cow?.cowPhoto} alt="" />
            </Grid>
          </>
          :
          <></>
      }

      {
        cow.createCow == true || values.cows[index].nfcId
          ?
          <>
            <Grid container alignItems="center" spacing={1}>
              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.ageYear`} />
                <TextInputField
                  name="year"
                  type="number"
                  value={cow.ageYear || 0}
                  disabled={!cow.createCow || cow.status == "Dispersed"}
                  label={t("Year")}
                  onChangeText={(value) => changeYear(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].ageYear && touched && touched.cows && touched.cows[index] && touched.cows[index].ageYear ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].ageYear ? errors?.cows[index]?.ageYear : ""}
                />
              </Grid>
              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.ageMonth`} />
                <TextInputField
                  name="month"
                  type="number"
                  value={cow.ageMonth || 0}
                  disabled={!cow.createCow || cow.status == "Dispersed"}
                  label={t("Month")}
                  onChangeText={(value) => changeMonths(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].ageMonth && touched && touched.cows && touched.cows[index] && touched.cows[index].ageMonth ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].ageMonth ? errors?.cows[index]?.ageMonth : ""}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.gender`} />
                <DropdownStringField
                  key={`cows[${index}].cowGender`}
                  items={cowsGenders}
                  label={t('Gender')}
                  placeholder='Male'
                  value={cow.gender || ''}
                  disabled={!cow.createCow || cow.status == "Dispersed"}
                  onChangeValue={(value) => changeGender(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].gender && touched && touched.cows && touched.cows[index] && touched.cows[index].gender ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].gender ? errors?.cows[index]?.gender : ""}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.height`} />
                <TextInputField
                  name="height"
                  type="number"
                  value={cow.height || ''}
                  disabled={cow.status == "Dispersed"}
                  label={t("Height")}
                  hasIcon={true}
                  icon={<p className="text-base">{BANGLADESH_HEIGHT_UNIT}</p>}
                  iconPosition={"right"}
                  onChangeText={(value) => changeHeight(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].height && touched && touched.cows && touched.cows[index] && touched.cows[index].height ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].height ? errors?.cows[index]?.height : ""}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.weight`} />
                <TextInputField
                  name="weight"
                  type="number"
                  value={cow.weight || ''}
                  disabled={cow.status == "Dispersed"}
                  label={t("Weight")}
                  hasIcon={true}
                  icon={<p className="text-base">{BANGLADESH_WEIGHT_UNIT}</p>}
                  iconPosition={"right"}
                  onChangeText={(value) => changeWeight(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].weight && touched && touched.cows && touched.cows[index] && touched.cows[index].weight ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].weight ? errors?.cows[index]?.weight : ""}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.dispersalDate`} />
                <Datepicker
                  key={`cows[${index}].dispersalDate`}
                  value={cow.dispersalDate || ''}
                  disabled={cow.status == "Dispersed"}
                  label={t('Date of Dispersal')}
                  onChangeDate={(value) => changeDispersalDate(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].dispersalDate && touched && touched.cows && touched.cows[index] && touched.cows[index].dispersalDate ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].dispersalDate ? errors?.cows[index]?.dispersalDate : ""}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>

                <div id={`cows.${index}.purchaseDate`} />
                <Datepicker
                  key={`cows[${index}].purchaseDate`}
                  value={cow.purchaseDate || ''}
                  disabled={cow.status == "Dispersed"}
                  label={t('Date of Purchase')}
                  onChangeDate={(value) => changePurchaseDate(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].purchaseDate && touched && touched.cows && touched.cows[index] && touched.cows[index].purchaseDate ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].purchaseDate ? errors?.cows[index]?.purchaseDate : ""}
                  maxDate={maxPurchaseDate}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.colour`} />
                <TextInputField
                  name="colour"
                  value={cow.colour || ''}
                  disabled={cow.status == "Dispersed"}
                  label={t("Colour")}
                  onChangeText={(value) => changeColour(value, cow, setFieldValue)}
                  hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].colour && touched && touched.cows && touched.cows[index] && touched.cows[index].colour ? true : false}
                  errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].colour ? errors?.cows[index]?.colour : ""}
                />
              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.signedDispersalAgreement`} />
                {
                  cow.status == "Dispersed"
                    ?
                    <>
                      <Typography variant='subtitle2' style={{ marginBottom: 10 }}>
                        {t("Signed Dispersal Agreement")}:
                      </Typography>

                      {
                        cow.signedDispersalAgreementFilename
                          ?
                          <div className='my-5'>
                            <a className='text-[18px] underline' href={cow.signedDispersalAgreement}>{cow.signedDispersalAgreementFilename}</a>
                          </div>
                          :
                          <img className="h-auto w-60 border-solid border-2 border-black" src={cow.signedDispersalAgreement} alt="" />
                      }
                    </>
                    :
                    <SingleFile
                      cropper={false}
                      acceptPDF={true}
                      onUpload={(newLegalPhoto) => {
                        handleUpload('newLegalPhoto', cow, newLegalPhoto, setFieldValue);
                      }}
                      label={t("Signed Dispersal Agreement")}
                      value={cow.signedDispersalAgreement || ''}
                      hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].signedDispersalAgreement && touched && touched.cows && touched.cows[index] && touched.cows[index].signedDispersalAgreement ? true : false}
                      errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].signedDispersalAgreement ? errors?.cows[index]?.signedDispersalAgreement : ""}
                    />
                }

              </Grid>

              <Grid xs={12} md={6} item={true}>
                <div id={`cows.${index}.cowWithFamilyPhoto`} />
                {
                  cow.status == "Dispersed"
                    ?
                    <>
                      <Typography variant='subtitle2' style={{ marginBottom: 10 }}>
                        {t("Cow With Family Photo")}:
                      </Typography>
                      <img className="h-auto w-60 border-solid border-2 border-black" src={cow.cowWithFamilyPhoto} alt="" />
                    </>
                    :
                    <SingleFile
                      cropper={false}
                      onUpload={(cowWithFamilyPhoto) => {
                        handleUpload('cowWithFamilyPhoto', cow, cowWithFamilyPhoto, setFieldValue)
                      }}
                      label={t('Cow With Family Photo')}
                      value={cow.cowWithFamilyPhoto || ''}
                      hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowWithFamilyPhoto && touched && touched.cows && touched.cows[index] && touched.cows[index].cowWithFamilyPhoto ? true : false}
                      errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowWithFamilyPhoto ? errors?.cows[index].cowWithFamilyPhoto : ""}
                    />
                }

              </Grid>
            </Grid>
          </>
          :
          <></>
      }
    </Card>
  );
}

export default BangladeshCard;