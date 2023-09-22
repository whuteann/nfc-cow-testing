import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { FieldArray } from 'formik';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import {
  cowOptions,
  cowsGenders,
  newBangladeshCow,
  changeCreateCowBool,
  changeOption,
  changeCow,
  changeNFCID,
  changeCowPhoto,
  changeCowPrice,
  changeWeight,
  changeGender,
  changeDispersalDate,
  changeCowFamilyPhoto,
  changeAge,
  changeHeight,
  changePurchaseDate,
  changeSignedDispersalAgreement,
  changeColour,
}
from './subFormComponents'
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import DropdownImage from '@/components/atoms/Input/dropdown/DropdownImage';

function BangladeshForm({ completedStatus, values, allUnassignedCows, allCows, setFieldValue, setErrors, errors, touched }:any) {
  const { t }: { t: any } = useTranslation();

  return (
    <>
    <FieldArray
      name="cows"
      render={arrayHelpers => (
        <div>
          <Card
          sx={{
            p: 2,
            m: 1
          }}
          >
            <Grid container>
              <Box
              sx={{
                pl: 1,
                flexGrow:1
              }}>
                <Typography component="span" variant="subtitle1">
                  {t('Cow Details')}
                </Typography>{' '}
              </Box>
              {
                completedStatus == true
                ?
                  <></>
                :
                  <Box
                    marginRight={4}
                  >
                    <Button
                      variant='contained'
                      type="button" 
                      color='primary' 
                      onClick={() => arrayHelpers.push(newBangladeshCow(values.country, values.family))}
                    >
                      {t("Add")}
                    </Button>
                  </Box>
              }
              
            </Grid>
          </Card>
          {values?.cows?.map((cow: any, index: any) => (
            <Card
            key={index}
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
                  flexGrow:1
                }}>
                  <Typography component="span" variant="subtitle1">
                    {t("Cow")+` ${index+1}`}
                  </Typography>{' '}
                </Box>

                {
                  completedStatus == true
                  ?
                    <></>
                  :
                    <>
                      <Box
                        marginRight={2}
                      >
                        <Button
                          variant='contained'
                          type="button" 
                          color={cow.createCow == false ? 'success' : 'error'}
                          onClick={() => changeCreateCowBool(cow.createCow, cow, setFieldValue, setErrors)}
                        >
                          {cow.createCow == false ? t('New Cow') : t('Existing Cow')}
                        </Button>
                      </Box>
                      <Box
                        marginRight={0}
                      >
                        <Button 
                        variant='outlined'
                        type="button" 
                        color='error' 
                        onClick={() => arrayHelpers.remove(index)}
                        >
                          {t("Remove")}
                        </Button>
                      </Box>
                    </>
                }
                
              </Grid>
              
              <Grid container key={index} alignItems="center" gap={1} columns={12}>
                {cow.createCow==false 
                  ?
                  <>
                    <Grid xs={12} item={true}>
                      <DropdownStringField
                        items={cowOptions}
                        value={cow.cowOption}
                        label={t("Select Option")}
                        placeholder={t("Option")}
                        disabled={completedStatus}
                        onChangeValue={(value)=>changeOption(value, cow, setFieldValue)}
                        hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowOption && touched && touched.cows && touched.cows[index] && touched.cows[index].cowOption? true : false}
                        errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowOption ? errors?.cows[index]?.cowOption : ""}
                      />
                    </Grid>
                    <Grid xs={12} item={true}>
                    {values.cows[index].cowOption ?
                    <>
                      {
                        values.cows[index].cowOption === "Select By NFC ID"
                        
                        ?

                        <DropdownField

                          label={t('Cow NFC ID')}
                          disabled = {completedStatus}
                          items = {(completedStatus ? allCows : allUnassignedCows)}
                          value = {cow.chosenCow}
                          onChangeValue = {( chosenCow ) => { changeCow(chosenCow,values,cow,allUnassignedCows,setFieldValue)} }
                          hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].chosenCow && touched && touched.cows && touched.cows[index] && touched.cows[index].chosenCow ? true : false}
                          errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].chosenCow ? errors?.cows[index]?.chosenCow : ""}
                        />
                        
                          :

                        <DropdownImage

                          label={t('Cow Image')}
                          disabled = {completedStatus}
                          items = {(completedStatus ? allCows : allUnassignedCows)}
                          value = {cow.chosenCow}
                          onChangeValue = {( chosenCow ) => { changeCow(chosenCow,values,cow,allUnassignedCows,setFieldValue)} }
                          hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].chosenCow && touched && touched.cows && touched.cows[index] && touched.cows[index].chosenCow ? true : false}
                          errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].chosenCow ? errors?.cows[index]?.chosenCow : ""}

                        />  

                      }
                    </>                        
                    :
                    <></>
                    }
                    </Grid>
                  </>
                  :
                  <>
                    <Grid xs={12} item={true}>
                      <TextInputField
                        name="nfcID"
                        value={cow.nfcID}
                        label={t("NFC ID")}
                        placeholder={t("Enter NFC ID")}
                        disabled={completedStatus}
                        onChangeText={(value)=>changeNFCID(value, cow, setFieldValue)}
                        hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].nfcID && touched && touched.cows && touched.cows[index] && touched.cows[index].nfcID ? true : false}
                        errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].nfcID ? errors?.cows[index]?.nfcID : ""}
                      />
                    </Grid>
                    <Grid xs={12} item={true}>
                      {completedStatus== true ?
                        <div className="py-3" >
                          <Typography variant='subtitle2'>
                            {t("Current Cow Image")}:
                          </Typography>
                          <img className="h-auto w-60 border-solid border-2 border-black" style={{ borderRadius: '50%'}} src = {cow?.cowPhoto} alt="" />
                        </div>

                      :
                      <SingleFile
                        cropper={true}
                        onUpload = {(cowPhoto) => { 
                          cow.cowPhoto = cowPhoto
                          setFieldValue("values.cows", cow)
                        }}
                        label = {t('Cow Photo')}
                        value = {values.cowPhoto}
                        hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPhoto && touched && touched.cows && touched.cows[index] && touched.cows[index].cowPhoto ? true : false}
                        errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPhoto ? errors?.cows[index]?.cowPhoto : ""}
                      />
                      }
                    </Grid>
                  </>
                }
              </Grid>

              {cow.createCow == true || values.cows[index].nfcID 
              
              ? 

              <>

              <Grid container alignItems="center" gap={1} wrap="nowrap">
                <Grid xs={6} item={true}>
                  <TextInputField 
                    name="cowPrice"
                    type="number"
                    value={cow.cowPrice}
                    label={t("Price of Cow")}
                    disabled={completedStatus}
                    onChangeText={(value)=>{changeCowPrice(value, cow, setFieldValue) ;}}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPrice && touched && touched.cows && touched.cows[index] && touched.cows[index].cowPrice ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowPrice ? errors?.cows[index]?.cowPrice : ""}
                  />
                </Grid>
                <Grid xs={6} item={true}>
                  <TextInputField 
                    name="age"
                    type="number"
                    value={cow.age}
                    label={t("Age")}
                    disabled={completedStatus}
                    onChangeText={(value)=>changeAge(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].age && touched && touched.cows && touched.cows[index] && touched.cows[index].age ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].age ? errors?.cows[index]?.age : ""}
                  />
                </Grid>
              </Grid>

              <Grid container alignItems="center" gap={1} wrap="nowrap">
                <Grid xs={6} item={true}>
                  <DropdownStringField 
                    key= {`cows[${index}].cowGender`}
                    items={cowsGenders}
                    label={t('Gender')}
                    placeholder='Male'
                    disabled={completedStatus}
                    value={cow.gender}
                    onChangeValue= {(value)=>changeGender(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].gender && touched && touched.cows && touched.cows[index] && touched.cows[index].gender ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].gender ? errors?.cows[index]?.gender : ""}
                  />
                </Grid>
                <Grid xs={6} item={true}>
                  <TextInputField 
                    name="height"
                    type="number"
                    value={cow.height}
                    label={t("Height")}
                    disabled={completedStatus}
                    onChangeText={(value)=>changeHeight(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].height && touched && touched.cows && touched.cows[index] && touched.cows[index].height ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].height ? errors?.cows[index]?.height : ""}
                  />
                </Grid>
              </Grid>

              <Grid container alignItems="center" gap={1} wrap="nowrap">
                <Grid xs={6} item={true}>
                  <TextInputField 
                    name="weight"
                    type="number"
                    value={cow.weight}
                    label={t("Weight")}
                    disabled={completedStatus}
                    onChangeText={(value)=>changeWeight(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].weight && touched && touched.cows && touched.cows[index] && touched.cows[index].weight ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].weight ? errors?.cows[index]?.weight : ""}
                  />
                </Grid>
                <Grid xs={6} item={true}>
                  <Datepicker
                    key={`cows[${index}].purchaseDate`}
                    value={cow.purchaseDate}
                    label={t('Date of Purchase')}
                    disabled={completedStatus}
                    onChangeDate={(value)=>changePurchaseDate(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].purchaseDate && touched && touched.cows && touched.cows[index] && touched.cows[index].purchaseDate ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].purchaseDate ? errors?.cows[index]?.purchaseDate : ""}
                  />
                </Grid>
              </Grid>

              <Grid container alignItems="center" gap={1} wrap="nowrap">
                <Grid xs={6} item={true}>
                  <Datepicker
                    key={`cows[${index}].dispersalDate`}
                    value={cow.dispersalDate}
                    label={t('Date of Dispersal')}
                    disabled={completedStatus}
                    onChangeDate={(value)=>changeDispersalDate(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].dispersalDate && touched && touched.cows && touched.cows[index] && touched.cows[index].dispersalDate ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].dispersalDate ? errors?.cows[index]?.dispersalDate : ""}
                  />
                </Grid>
                <Grid xs={6} item={true}>
                  <TextInputField 
                    name="signedDispersalAgreement"
                    value={cow.signedDispersalAgreement}
                    label={t("Signed Dispersal Agreement")}
                    disabled={completedStatus}
                    onChangeText={(value)=>changeSignedDispersalAgreement(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].signedDispersalAgreement && touched && touched.cows && touched.cows[index] && touched.cows[index].signedDispersalAgreement ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].signedDispersalAgreement ? errors?.cows[index]?.signedDispersalAgreement : ""}
                  />
                  
                </Grid>
              </Grid>

              <Grid container alignItems="center" gap={1} wrap="nowrap">
                <Grid xs={6} item={true}>
                  <TextInputField 
                    name="colour"
                    value={cow.colour}
                    label={t("Colour")}
                    disabled={completedStatus}
                    onChangeText={(value)=>changeColour(value, cow, setFieldValue)}
                    hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].colour && touched && touched.cows && touched.cows[index] && touched.cows[index].colour ? true : false}
                    errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].colour ? errors?.cows[index]?.colour : ""}
                  />
                </Grid>
              </Grid>



              <Grid container alignItems="center" gap={1} columns = {12}>
                <Grid xs={12} item={true}>
                  {completedStatus== true || !cow.createCow ?
                      <div className="py-3" >
                        <Typography variant='subtitle2'>
                          {t("Current New Cow Image")}:
                        </Typography>
                        <img className="h-auto w-60 border-solid border-2 border-black" style={{ borderRadius: '50%'}} src = {cow?.newCowPhoto} alt="" />
                      </div>

                      :

                      <SingleFile
                        cropper={true}
                        onUpload = {(newCowPhoto) => { 
                          cow.newCowPhoto = newCowPhoto
                          setFieldValue("values.cows", cow)
                        }}
                        label = {t('New Cow Photo')}
                        value = {values.newCowPhoto}
                        hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].newCowPhoto && touched && touched.cows && touched.cows[index] && touched.cows[index].newCowPhoto ? true : false}
                        errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].newCowPhoto ? errors?.cows[index]?.newCowPhoto : ""}
                      />
                    }

                  </Grid>
                  <Grid xs={12} item={true}>
                  {completedStatus== true || !cow.createCow  ?
                      <div className="py-3" >
                        <Typography variant='subtitle2'>
                          {t("Current Family Image")}:
                        </Typography>
                        <img className="h-auto w-60 border-solid border-2 border-black" style={{ borderRadius: '50%'}} src = {cow?.familyPhoto} alt="" />
                      </div>

                    :

                    <SingleFile
                      cropper={true}
                      onUpload = {(familyPhoto) => { 
                        cow.familyPhoto = familyPhoto
                        setFieldValue("values.cows", cow)
                      }}
                      label = {t('Family Photo')}
                      value = {values.familyPhoto}
                      hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].familyPhoto && touched && touched.cows && touched.cows[index] && touched.cows[index].familyPhoto ? true : false}
                      errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].familyPhoto ? errors?.cows[index]?.familyPhoto : ""}
                    />
                  }
                </Grid>
              </Grid>
              </>
                
                :
  
                  <></>
                  
                }
            </Card>
          ))}
        </div>
      )}
    />
    </>
  )
}

export default BangladeshForm;