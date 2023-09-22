import { useState } from "react";

interface newCowSchema {
  chosenCow : object,

  country: object,
  family: object,
  createCow: boolean,
  cowOption: string,
  nfcID: string,
  cowPhoto: string,
  cowPrice: number,
  weight: number,
  gender: string,
  dispersalDate: any,
  newCowPhoto: string,
  familyPhoto: string,

  //Bangladesh Exclusive Components
  age?: number,
  height?: number,
  purchaseDate?: any,
  signedDispersalAgreement?: string,
  colour?: string,

  //Pakistan Exclusive Components
  transportPrice?: number,
  taxPrice?: number,
  coordinatorHelperExpenses?: number,
  signedLegalDoc?: string,
}

export const cowOptions = [
  {
    label: "Select By NFC ID",
    value: "Select By NFC ID",
  },
  {
    label: "Select By Photo",
    value: "Select By Photo",
  },
]

export const cowsGenders = [
  {
    label: "Male",
    value: "Male",
  },
  {
    label: "Female",
    value: "Female",
  }
]

export const newBangladeshCow: any = (country: any, family: any) => {

  const bangladeshCow : newCowSchema = {
    chosenCow : null,

    
    country: country,
    family: family,
    createCow: false,
    cowOption: '',
    nfcID: '',
    cowPhoto: '',
    cowPrice: 0,
    weight: 0,
    gender: '',
    dispersalDate: undefined,
    newCowPhoto: '',
    familyPhoto: '',

    //Bangladesh Exclusive Components
    age: 0,
    height: 0,
    purchaseDate: undefined,
    signedDispersalAgreement: '',
    colour: '',
  };

  return bangladeshCow;
}

export const newPakistanCow: any = (country: any, family: any) => {

  const pakistanCow : newCowSchema = {
    chosenCow : null,

    country: country,
    family: family,
    createCow: false,
    cowOption: '',
    nfcID: '',
    cowPhoto: '',
    cowPrice: 0,
    weight: 0,
    gender: '',
    dispersalDate: '',
    newCowPhoto: '',
    familyPhoto: '',

    //Pakistan Exclusive Components
    transportPrice: 0,
    taxPrice: 0,
    coordinatorHelperExpenses: 0,
    signedLegalDoc: '',
  };

  return pakistanCow;
}

// General Change Functions
export function changeCreateCowBool (value: any, cow: any, setFieldValue: any, setErrors: any) {
  setErrors({})
  cow.createCow = !value
  if (!value == false ){
    cow.chosenCow = {}
  }
  else {
    cow.Option = ''
    cow.nfcID = ''
    cow.cowPhoto= ''
    cow.cowPrice= ''
    cow.weight= ''
    cow.gender= ''
    cow.dispersalDate= ''
    cow.newCowPhoto= ''
    cow.familyPhoto= ''
    cow.transportPrice= ''
    cow.taxPrice= ''
    cow.coordinatorHelperExpenses= ''
    cow.signedLegalDoc= ''

    cow.age= ''
    cow.height= ''
    cow.purchaseDate= ''
    cow.signedDispersalAgreement= ''
    cow.colour= ''
  }
  

  setFieldValue("values.cows", cow)
}

export function changeOption (value: any, cow: any, setFieldValue: any) {
  cow.cowOption = value
  setFieldValue("values.cows", cow)
}

export function changeCow (value: any, values: any, cow: any, allUnassignedCows: any, setFieldValue: any) {

  //Client Side only
  cow.chosenCow = value

  //Real Data
  cow.nfcID= value.nfcID
  cow.cowPhoto= value.cowPhoto
  cow.cowPrice= value.cowPrice
  cow.weight= value.weight
  cow.gender= value.gender
  cow.dispersalDate= value.dispersalDate
  cow.newCowPhoto= value.newCowPhoto
  cow.familyPhoto= value.familyPhoto

  if (values.pakistanCheck == true){
    cow.transportPrice= value.transportPrice
    cow.taxPrice= value.taxPrice
    cow.coordinatorHelperExpenses= value.coordinatorHelperExpenses
    cow.signedLegalDoc= value.signedLegalDoc
  }
  else {
    cow.age= value.age
    cow.height= value.height
    cow.purchaseDate= value.purchaseDate
    cow.signedDispersalAgreement= value.signedDispersalAgreement
    cow.colour= value.colour
  }

  setFieldValue("values.cows", cow)
}

export function changeNFCID (value: any, cow: any, setFieldValue: any) {
  cow.nfcID = value
  setFieldValue("values.cows", cow)
}

export function changeCowPhoto (value: any, cow: any, setFieldValue: any) {
  cow.cowPhoto = value
  setFieldValue("values.cows", cow)
}

export function changeCowPrice (value: any,  cow: any, setFieldValue: any) {
  cow.cowPrice = value
  setFieldValue("values.cows", cow)
}

export function changeWeight (value: any, cow: any, setFieldValue: any) {
  cow.weight = value
  setFieldValue("values.cows", cow)
}

export function changeGender (value: any, cow: any, setFieldValue: any) {
  cow.gender = value
  setFieldValue("values.cows", cow)
}

export function changeDispersalDate (value: any, cow: any, setFieldValue: any){
  cow.dispersalDate = value
  setFieldValue("values.cows", cow)
}

export function changeCowFamilyPhoto (value: any, cow: any, setFieldValue: any){
  cow.cowFamilyPhoto = value
  setFieldValue("values.cows", cow)
}

//Bangladesh Exclusive Functions

export function changeAge (value: any, cow: any, setFieldValue: any) {
  cow.age = value
  setFieldValue("values.cows", cow)
}

export function changeHeight (value: any, cow: any, setFieldValue: any) {
  cow.height = value
  setFieldValue("values.cows", cow)
}

export function changePurchaseDate (value: any, cow: any, setFieldValue: any) {
  cow.purchaseDate = value
  setFieldValue("values.cows", cow)
}

export function changeSignedDispersalAgreement (value: any, cow: any, setFieldValue: any) {
  cow.signedDispersalAgreement = value
  setFieldValue("values.cows", cow)
}

export function changeColour (value: any, cow: any, setFieldValue: any) {
  cow.colour = value
  setFieldValue("values.cows", cow)
}

//Pakistan Exclusive Functions

export function changeTransportPrice (value: any, cow: any, setFieldValue: any) {
  cow.transportPrice = value
  setFieldValue("values.cows", cow)
}

export function changeTaxPrice (value: any, cow: any, setFieldValue: any) {
  cow.taxPrice = value
  setFieldValue("values.cows", cow)
}

export function changeCoordinatorHelperExpenses (value: any, cow: any, setFieldValue: any) {
  cow.coordinatorHelperExpenses = value
  setFieldValue("values.cows", cow)
}

export function changeSignedLegalDoc (value: any, cow: any, setFieldValue: any) {
  cow.signedLegalDoc = value
  setFieldValue("values.cows", cow)
}