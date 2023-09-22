import { ICow } from '@/models/Cow';
import * as Yup from 'yup';

export interface cowDispersalData {
  //Client side components
  pakistanCheck: boolean,

  //Family Components
  status: string,
  date: Date,
  farm : string,
  family : {
    townVillage : any,
  },
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
      farm : Yup.object(),
      date: Yup.date(),
      family: Yup.object(),
      noOfCows: Yup.string(),
      rejectionReason: Yup.string().nullable(),
      
      //Cow Components
      country: Yup.object().required(t("Select a Country")),
      cows: Yup.array()
      .when('pakistanCheck', {
        is: true,
        then: Yup.array().of(
          Yup.object().shape(
            {
              country: Yup.object(),
              family: Yup.object(),
              createCow: Yup.boolean(),
              nfcID : Yup.string()
              .when("createCow", {
                is : true,
                then: Yup.string().required(t("Enter Cow NFC ID")),
              }),
              cowPhoto : Yup.string()
              .when("createCow", {
                is : true,
                then: Yup.string().required(t("Insert a Cow Photo")),
              }),
              cowOption: Yup.string()
              .when("createCow", {
                is : false,
                then: Yup.string().required(t("Select a Cow option")),
              }),
              chosenCow: Yup.mixed()
              .when("createCow", {
                is : false,
                then: Yup.mixed().required(t("Select a Cow")),
              }),
              cowPrice: Yup.number().required(t("Enter Price of Cow")),
              weight: Yup.number().required(t("Enter Cow Weight")),
              gender: Yup.string().required(t("Select Cow Gender")),
              dispersalDate: Yup.date().required(t("Choose Dispersal Date")),
              newCowPhoto: Yup.string().required(t("Insert New Cow Photo")),
              familyPhoto: Yup.string().required(t("Insert Family Photo")),
              
              //Pakistan Exclusive
              transportPrice: Yup.string().required(t("Enter Price of Transport")),
              taxPrice: Yup.number().required(t("Enter Price of Tax")),
              coordinatorHelperExpenses: Yup.number().required(t("Enter Price of Coordinator/Helper expenses")),
              signedLegalDoc: Yup.string().required(t("Insert Signed Legal Document")),
            }
          )
        )
      })
      .when('pakistanCheck', {
        is: false,
        then: Yup.array().of(
          Yup.object().shape(
            {
              country: Yup.object(),
              family: Yup.object(),
              createCow: Yup.boolean(),
              nfcID : Yup.string()
              .when("createCow", {
                is : true,
                then: Yup.string().required(t("Enter Cow NFC ID")),
              }),
              cowPhoto : Yup.string()
              .when("createCow", {
                is : true,
                then: Yup.string().required(t("Insert a Cow Photo")),
              }),
              cowOption: Yup.string()
              .when("createCow", {
                is : false,
                then: Yup.string().required(t("Select a Cow option")),
              }),
              chosenCow: Yup.mixed()
              .when("createCow", {
                is : false,
                then: Yup.mixed().required(t("Select a Cow")),
              }),
              cowPrice: Yup.number().required(t("Enter Price of Cow")),
              weight: Yup.number().required(t("Enter Cow Weight")),
              gender: Yup.string().required(t("Select Cow Gender")),
              dispersalDate: Yup.date().required(t("Choose Dispersal Date")),
              newCowPhoto: Yup.mixed().required(t("Insert New Cow Photo")),
              familyPhoto: Yup.mixed().required(t("Insert Family Photo")),
    
              //Bangladesh Exclusive
              age: Yup.number().required(t("Enter Cow Age")),
              height: Yup.number().required(t("Enter Cow Height")),
              purchaseDate: Yup.date().required(t("Choose Purchase Date")),
              signedDispersalAgreement: Yup.string().required(t("Insert Signed Dispersal Agreement")),
              colour: Yup.string().required(t("Enter colour")),
            }
          )
        )
      })
      ,
    })
  )
}

export const initialValues = (cowDispersalData: any) : cowDispersalData   => {
  let pakistanCheck: boolean = undefined;
  {cowDispersalData?.farm?.district?.country?.name == "Pakistan" 
    ? pakistanCheck = true 
    : pakistanCheck = false
  }

  return (
    {
      //Client side components
      pakistanCheck: pakistanCheck,

      //Main Components to be uploaded
      status: cowDispersalData?.status || '',
      date: cowDispersalData?.date || undefined,
      farm : cowDispersalData?.farm || '',
      family : cowDispersalData?.family || '',
      noOfCows: cowDispersalData?.noOfCows || '',
      rejectionReason: cowDispersalData?.rejectionReason || '',

      //Cow Components
      country: cowDispersalData?.farm?.district?.country || '',
      cows: cowDispersalData?.cows || [],
    }
  )
}