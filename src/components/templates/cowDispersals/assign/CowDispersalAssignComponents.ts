import { family, ICow } from '@/models/Cow';
import * as Yup from 'yup';

export interface cowDispersalData {
  //Client side components
  pakistanCheck: boolean,

  //Family Components
  status: string,
  date: Date,
  family : {
    townVillage : any,
  },
  townVillage: string,
  noOfCows : string,
  rejectionReason : string,

  //Cow Components
  country?: any,
  chosenCow? :any
  cows? : ICow[],
}

export const addCowDispersalSchema = (t: any) => {

  return(
    Yup.object({
      //Client side components
      pakistanCheck: Yup.boolean(),
    
      //Family Components
      status: Yup.string(),
      date: Yup.date(),
      // family: Yup.object(),
      noOfCows: Yup.string(),
      rejectionReason: Yup.string().nullable(),
      
      //Cow Components
      // country: Yup.object().required(t("Select a Country")),
      cows: Yup.array()
      .when('pakistanCheck', {
        is: true,
        then: Yup.array().of(
          Yup.object().shape(
            {
              // country: Yup.object(),
              // family: Yup.object(),
              createCow: Yup.boolean(),
              nfcId : Yup.string().required(t("Insert Cow NFC ID")).nullable(),
              cowPhoto : Yup.mixed()
              .when("createCow", {
                is : true,
                then: Yup.mixed().required(t("Insert a Cow Photo")).nullable(),
              }),
              cowOption: Yup.string()
              .when("createCow", {
                is : false,
                then: Yup.string().required(t("Select a Cow option")).nullable(),
              }),
              cowPrice: Yup.number().required(t("Enter Price of Cow")).nullable(),
              weight: Yup.number().required(t("Enter Cow Weight")).nullable(),
              gender: Yup.string().required(t("Select Cow Gender")).nullable(),
              dispersalDate: Yup.date().required(t("Choose Dispersal Date")).nullable(),
              cowWithFamilyPhoto: Yup.mixed().required(t("Insert Cow With Family Photo")).nullable(),
              
              //Pakistan Exclusive
              transportPrice: Yup.string().required(t("Enter Price of Transport")).nullable(),
              taxPrice: Yup.number().required(t("Enter Price of Tax")).nullable(),
              coordinatorHelperExpenses: Yup.number().required(t("Enter Price of Coordinator/Helper expenses")).nullable(),
              signedLegalDoc: Yup.mixed().required(t("Insert Signed Legal Document")).nullable(),
            }
          )
        )
      })
      .when('pakistanCheck', {
        is: false,
        then: Yup.array().of(
          Yup.object().shape(
            {
              createCow: Yup.boolean(),
              nfcId : Yup.string().required(t("Insert Cow NFC ID")).nullable(),
              cowPhoto : Yup.mixed()
              .when("createCow", {
                is : true,
                then: Yup.mixed().required(t("Insert a Cow Photo")).nullable(),
              }),
              cowOption: Yup.string()
              .when("createCow", {
                is : false,
                then: Yup.string().required(t("Select a Cow option")).nullable(),
              }),
              cowPrice: Yup.number().required(t("Enter Price of Cow")).nullable(),
              weight: Yup.number().required(t("Enter Cow Weight")).nullable(),
              gender: Yup.string().required(t("Select Cow Gender")).nullable(),
              dispersalDate: Yup.date().required(t("Choose Dispersal Date")).nullable(),
              cowWithFamilyPhoto: Yup.mixed().required(t("Insert Cow With Family Photo")).nullable(),
    
              //Bangladesh Exclusive
              // age: Yup.number().required(t("Enter Cow Age")).nullable(),
              ageYear: Yup.number().required(t("Enter Cow Age")).moreThan(-1, "Please enter number between 0 to 99").max(99, "Please enter number between 0 to 99").nullable(),
              ageMonth: Yup.number().required(t("Enter Cow Age")).moreThan(-1, "Please enter number between 0 to 11").max(11, "Please enter number between 0 to 11").nullable(),
              
              height: Yup.number().required(t("Enter Cow Height")).nullable(),
              purchaseDate: Yup.date().required(t("Choose Purchase Date")).nullable(),
              signedDispersalAgreement: Yup.mixed().required(t("Insert Signed Dispersal Agreement")).nullable(),
              colour: Yup.string().required(t("Enter colour")).nullable(),
            }
          )
        )
      })
    })
  )
}

export const initialValues = (cowDispersalData: any): cowDispersalData => {
  let pakistanCheck: boolean = cowDispersalData?.family?.townVillage?.district?.country?.name == "Pakistan" ? true : false;
  let cows = cowDispersalData?.cows.map((cow:any)=>{
    return {
      ...cow,
      cowPrice: cow.cowPrice || 0,
      height: cow.height || 0,
      weight: cow.weight || 0,
      transportPrice: cow.transportPrice || 0,
      taxPrice: cow.taxPrice || 0,
      coordinatorHelperExpenses: cow.coordinatorHelperExpenses || 0,
      ageYear: cow.ageYear || 0,
      ageMonth: cow.ageMonth || 0
    }
  })
  
  return (
    {
      //Client side components
      pakistanCheck: pakistanCheck,

      //Main Components to be uploaded
      status: cowDispersalData?.status || '',
      date: cowDispersalData?.date || undefined,
      family: cowDispersalData?.family?.name || '',
      townVillage: cowDispersalData?.family?.townVillage?.name || '',
      noOfCows: cowDispersalData?.noOfCows || '',
      rejectionReason: cowDispersalData?.rejectionReason || '',

      //Cow Components
      country: cowDispersalData?.family?.townVillage?.district?.country || '',
      cows: cows || [],
    }
  )
}