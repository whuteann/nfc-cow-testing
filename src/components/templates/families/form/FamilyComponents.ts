import { ITownVillage } from '@/models/TownVillage';
import * as Yup from 'yup';

export interface familyData {
  generalDetails?: boolean,
  townDetails?: boolean,
  villageDetails?: boolean,
  secondaryId?: string,
  type?: string,
  status?: string,
  country?: string,
  houseType?: string,
  address?: string,
  unionCouncil?: string,
  province?: string,
  nearestFamousLandmard?: string,
  cityName?: string,
  townVillage?: ITownVillage,
  flatNumber?: string,
  buildingName?: string,
  areaName?: string,
  policeStationThanaName?: string,
  postOfficeName?: string,
  name?: string,
  nfcID?: string,
  nationalID?: string,
  notes?: string,
  contact?: string,
  religion?: string,
  headshot?: string,
  coordinator?: string,
  spouseName?: string,
  spouseContact?: string,
  contractForm?: string,
  contractFormFilename?: string,

  familyPhoto?: string,
  housePhoto?: string,
  applicationForm?: string,
  applicationFormFilename?: string,

  typeOfAnimalAllowed?: string,
  noAnimalsAllocated?: string,
  children?: [],
}

export const addFamilySchema = (t:any) =>{

  return(
    Yup.object({
    //Utilized to set Conditions
    generalDetails: Yup.bool(),
    townDetails: Yup.bool(),
    villageDetails: Yup.bool(),

    //Type to determine Coordinator or Family
    type: Yup.string(),
    status: Yup.string(),

    //Dropdown Conditions
    country: Yup.string(),
    houseType: Yup.string(),
    
    //General & Town Details
    secondaryId: Yup.string().nullable(),
    address: Yup
      .string()
      .when(["generalDetails", "townDetails"], {
        is: (generalDetails: boolean, townDetails: boolean)=> generalDetails || townDetails,
        then: Yup.string().required(t("Enter address"))
      }),
    townVillage: Yup
      .object().required()
      .when(["generalDetails", "townDetails", "villageDetails"], {
        is: (generalDetails: boolean, townDetails: boolean, villageDetails: boolean)=> generalDetails || townDetails || villageDetails,
        then: Yup.object().required(t("Enter Town/Village Name"))
      }),
    
    //General Details
    unionCouncil: Yup
      .string()
      .when('generalDetails', {
        is: true,
        then: Yup.string().required(t("Enter Union Council"))
      }),
    province: Yup
      .string()
      .when('generalDetails', {
        is: true,
        then: Yup.string().required(t("Enter Province"))
      }),
    nearestFamousLandmard: Yup
      .string()
      .when('generalDetails', {
        is: true,
        then: Yup.string().nullable()
      }),
    cityName: Yup
      .string()
      .when('generalDetails', {
        is: true,
        then: Yup.string().required(t("Enter City Name"))
      }),
    
    //Town Details
    flatNumber: Yup
      .string()
      .when('townDetails', {
        is: true,
        then: Yup.string().required(t("Enter Flat Number"))
      }),
    buildingName: Yup
      .string()
      .when('townDetails', {
        is: true,
        then: Yup.string().required(t("Enter Building Name"))
      }),
    areaName: Yup
      .string()
      .when('townDetails', {
        is: true,
        then: Yup.string().required(t("Enter Area Name"))
      }),
    
    //Village Details
    policeStationThanaName: Yup
      .string()
      .when('villageDetails', {
        is: true,
        then: Yup.string().required(t("Enter Police Station/Thana Name"))
      }),
    postOfficeName: Yup
      .string()
      .when('villageDetails', {
        is: true,
        then: Yup.string().required(t("Enter Post Office Name"))
      }),
    
    //Personal Details
    name: Yup.string().required(t("Enter Name")),
    nfcID: Yup.string().nullable(),
    nationalID: Yup.string().required(t("Enter National ID")),
    notes: Yup.string().required(t("Enter Notes")),
    contact: Yup.string().required(t("Enter Contact")),
    religion: Yup.string().required(t("Enter Religion")),
    headshot: Yup.mixed().required(t('Insert Family Chief Headshot')),
    coordinator: Yup.object().required(t("Select Coordinator")),
    
    //Family Details
    spouseName: Yup.string().nullable(),
    spouseContact: Yup.string().nullable(),
    // contractForm: Yup.mixed().required(t('Insert House Photo')),
    contractForm: Yup.mixed().when(["villageDetails", "townDetails"], {
      is: (townDetails: boolean, villageDetails: boolean)=> townDetails || villageDetails,
      then: Yup.string().required(t("Insert Contract Form"))
    }),
    familyPhoto: Yup.mixed().required(t("Insert Family Photo")),
    housePhoto: Yup.mixed().required(t('Insert House Photo')),
    applicationForm: Yup.mixed().required(t('Insert House Photo')),
    typeOfAnimalAllowed: Yup.string().required(t("Enter Type of Animal Allowed")),
    noAnimalsAllocated: Yup.string().required(t("Enter No. Animals Allocated")),
    children: Yup.array()
    .of(
      Yup.object().shape(
        {
          childGender: Yup.string().required(t("Gender is required")),
          dateOfBirth: Yup.date().typeError(t('Invalid Date')).required(t('Date is Required')),
        }
      )
    ),

    })
  )
}

export const initialValues = (single_family: familyData, userCountry?: any)   => {

  return (
    {
      generalDetails: ((single_family?.townVillage as any)?.district?.country?.name === 'Pakistan') ? true: false,
      townDetails: ((single_family?.townVillage as any)?.district?.country?.name === 'Bangladesh' && single_family?.houseType === "Town")? true : false,
      villageDetails: ((single_family?.townVillage as any)?.district?.country?.name === 'Bangladesh' && single_family?.houseType === "Village")? true : false,
      secondaryId: single_family?.secondaryId || '',
      type: 'Family',
      status: single_family?.status || 'Pending', //Auto change status back to Pending upon Edit.
      country: single_family?.townVillage?.district?.country?.name || userCountry?.name || '',
      district: single_family?.townVillage?.district?.name || "",
      houseType: single_family?.houseType || '',
      address: single_family?.address || '',
      townVillage: single_family?.townVillage || undefined,
      unionCouncil: single_family?.unionCouncil || '',
      province: single_family?.province || '',
      nearestFamousLandmard: single_family?.nearestFamousLandmard || '',
      cityName: single_family?.cityName || '',
      flatNumber: single_family?.flatNumber || '',
      buildingName: single_family?.buildingName || '',
      areaName: single_family?.areaName || '',
      policeStationThanaName: single_family?.policeStationThanaName || '',
      postOfficeName: single_family?.postOfficeName || '',
      name: single_family?.name || '',
      nfcID: single_family?.nfcID || undefined,
      nationalID: single_family?.nationalID || '',
      notes: single_family?.notes || '',
      contact: single_family?.contact || '',
      religion: single_family?.religion || '',
      headshot: single_family?.headshot || null,
      coordinator: single_family?.coordinator || undefined,
      spouseName: single_family?.spouseName || '',
      spouseContact: single_family?.spouseContact || '',
      contractForm: single_family?.contractForm || '',
      contractFormFilename: single_family?.contractFormFilename || '',
      familyPhoto: single_family?.familyPhoto || null,
      housePhoto: single_family?.housePhoto || null,
      applicationForm: single_family?.applicationForm || '',
      applicationFormFilename: single_family?.applicationFormFilename || '',
      typeOfAnimalAllowed: 'Cows',
      noAnimalsAllocated: single_family?.noAnimalsAllocated || '',
      children: single_family?.children || [],
    }
  )
}