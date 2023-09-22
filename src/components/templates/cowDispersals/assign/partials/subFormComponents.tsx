interface newCowSchema {
  _id?: string,
  family: object,
  createCow: boolean,
  cowOption: string,
  nfcId: string,
  cowPhoto: string,
  cowPrice: string,
  weight: string,
  gender: string,
  dispersalDate: any,
  newCowPhoto: string,
  cowWithFamilyPhoto: string,

  // Bangladesh Exclusive Components
  ageYear?: number,
  ageMonth?: number,

  // age?: string,
  height?: string,
  purchaseDate?: any,
  signedDispersalAgreement?: string,
  colour?: string,

  // Pakistan Exclusive Components
  transportPrice?: string,
  taxPrice?: string,
  coordinatorHelperExpenses?: string,
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
    family: family,
    createCow: false,
    cowOption: '',
    nfcId: '',
    cowPhoto: '',
    cowPrice: '',
    weight: '',
    gender: '',
    dispersalDate: '',
    newCowPhoto: '',
    cowWithFamilyPhoto: '',

    //Bangladesh Exclusive Components
    ageYear: 0,
    ageMonth: 0,

    height: '',
    purchaseDate: '',
    signedDispersalAgreement: '',
    colour: '',
  };

  return bangladeshCow;
}

export const newPakistanCow: any = (country: any, family: any) => {
  const pakistanCow : newCowSchema = {
    family: family,
    createCow: false,
    cowOption: '',
    nfcId: '',
    cowPhoto: '',
    cowPrice: '',
    weight: '',
    gender: '',
    dispersalDate: '',
    newCowPhoto: '',
    cowWithFamilyPhoto: '',

    //Pakistan Exclusive Components
    transportPrice: '',
    taxPrice: '',
    coordinatorHelperExpenses: '',
    signedLegalDoc: '',
  };

  return pakistanCow;
}

// General Change Functions
export function changeCreateCowBool (value: any, cow: any, setFieldValue: any, setErrors: any) {
  setErrors({})
  cow.createCow = !value
  cow.Option = ''
  cow.nfcId = ''
  cow.cowPhoto = ''
  cow.cowPrice = ''
  cow.weight = ''
  cow.gender = ''
  cow.dispersalDate = ''
  cow.newCowPhoto = ''
  cow.cowWithFamilyPhoto = ''
  cow.transportPrice = ''
  cow.taxPrice = ''
  cow.coordinatorHelperExpenses = ''
  cow.signedLegalDoc = ''

  cow.ageYear = 0
  cow.ageMonth = 0
  cow.height = ''
  cow.purchaseDate = ''
  cow.signedDispersalAgreement = ''
  cow.colour = ''
  
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
  cow.nfcId= value.nfcId
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
    cow.ageYear = value.ageYear
    cow.ageMonth = value.ageMonth
    cow.height= value.height
    cow.purchaseDate= value.purchaseDate
    cow.signedDispersalAgreement= value.signedDispersalAgreement
    cow.colour= value.colour
  }

  setFieldValue("values.cows", cow)
}

export function changeNFCID (value: any, cow: any, setFieldValue: any) {
  cow.nfcId = value
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

export function changeCowWithFamilyPhoto (value: any, cow: any, setFieldValue: any){
  cow.cowWithFamilyPhoto = value
  setFieldValue("values.cows", cow)
}

//Bangladesh Exclusive Functions


export function changeYear (value: any, cow: any, setFieldValue: any) {
  cow.ageYear = Number(value)
  setFieldValue("values.cows", cow)
}

export function changeMonths (value: any, cow: any, setFieldValue: any) {
  cow.ageMonth = Number(value)
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