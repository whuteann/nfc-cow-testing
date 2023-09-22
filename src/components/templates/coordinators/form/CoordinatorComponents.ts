import mongoose from 'mongoose';
import { ITownVillage } from '@/models/TownVillage';
import * as Yup from 'yup';
import { Prisma } from '@prisma/client';

// export interface coordinatorData {
//   generalDetails?: boolean,
//   townDetails?: boolean,
//   villageDetails?: boolean,
//   secondaryId?: string,
//   type?: string,
//   status?: string,
//   country?: string,
//   coordinatorType?: string,
//   supervisor?: object,
//   houseType?: string,
//   address?: string,
//   unionCouncil?: string,
//   town?: string,
//   province?: string,
//   nearestFamousLandmard?: string,
//   cityName?: string,
//   townVillage?: ITownVillage,
//   flatNumber?: string,
//   buildingName?: string,
//   areaName?: string,
//   policeStationThanaName?: string,
//   postOfficeName?: string,
//   name?: string,
//   nfcID?: string,
//   nationalID?: string,
//   notes?: string,
//   contact?: string,
//   religion?: string,
//   headshot?: [],
//   overseeTownsVillages?: [],
//   spouseName?: string,
//   familyPhoto?: [],
//   housePhoto?: [],
//   applicationForm?: string,
//   typeOfAnimalAllowed?: string,
//   noAnimalsAllocated?: string,
//   children?: [],
// }

export const addCoordinatorSchema = (t:any) =>{

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
    coordinatorType: Yup.string(),
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
      .object()
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
        then: Yup.string().required(t("Enter Nearest Famous Landmark"))
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
    notes: Yup.string().nullable(),
    contact: Yup.string().required(t("Enter Contact")),
    religion: Yup.string().required(t("Enter Religion")),
    headshot: Yup.mixed().required(t('Insert Coordinator/Family Chief Headshot')),
    overseeTownsVillages: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required('Required')
    })
    ).min(1, t("Select Oversee Town Villages")),
    supervisor: Yup.object().required(t("Select a Supervisor")),
    
    //Family Details
    // spouseName: Yup.string().required(t("Enter Spouse Name")),
    familyPhoto: Yup.mixed().required(t("Insert Family Photo")),
    housePhoto: Yup.mixed().required(t('Insert House Photo')),
    applicationForm: Yup.mixed().required(t('Insert Application Form')),
    typeOfAnimalAllowed: Yup.string().required(t("Enter Type of Animal Allowed")),
    noAnimalsAllocated: Yup.string().required(t("Enter No. Animals Allocated")),
    children: Yup.array()
    .of(
      Yup.object().shape(
        {
          childGender: Yup.string().required(t("Gender is required")),
          dateOfBirth: Yup.date().typeError(t('Invalid Date')).required(t('Date is Required'))
        }
      )
    ),
  }))
}

export const initialValues = (single_coordinator: Prisma.FamilyCreateInput, userCountry?:any)   => {
  return (
    {
      id: single_coordinator?.id || '',
      generalDetails: ((single_coordinator?.townVillage as any)?.district?.country?.name === 'Pakistan') ? true: false,
      townDetails: ((single_coordinator?.townVillage as any)?.district?.country?.name === 'Bangladesh' && single_coordinator?.houseType === "Town")? true : false,
      villageDetails: ((single_coordinator?.townVillage as any)?.district?.country?.name === 'Bangladesh' && single_coordinator?.houseType === "Village")? true : false,
      secondaryId: single_coordinator?.secondaryId || '',
      type: 'Coordinator',
      status: single_coordinator?.status || 'Pending', //Auto change status back to Pending upon Edit.
      country: (single_coordinator?.townVillage as any)?.district?.country?.name || userCountry?.name || '',
      district: (single_coordinator?.townVillage as any)?.district.name || '',
      coordinatorType: single_coordinator?.coordinatorType ||'',
      houseType: single_coordinator?.houseType || '',
      address: single_coordinator?.address || '',
      townVillage: single_coordinator?.townVillage || '',
      unionCouncil: single_coordinator?.unionCouncil || '',
      // town: single_coordinator?.town || '',
      province: single_coordinator?.province || '',
      nearestFamousLandmard: single_coordinator?.nearestFamousLandmard || '',
      cityName: single_coordinator?.cityName || '',
      flatNumber: single_coordinator?.flatNumber || '',
      buildingName: single_coordinator?.buildingName || '',
      areaName: single_coordinator?.areaName || '',
      policeStationThanaName: single_coordinator?.policeStationThanaName || '',
      postOfficeName: single_coordinator?.postOfficeName || '',
      name: single_coordinator?.name || '',
      nfcID: single_coordinator?.nfcID || '',
      nationalID: single_coordinator?.nationalID || '',
      notes: single_coordinator?.notes || '',
      contact: single_coordinator?.contact || '',
      religion: single_coordinator?.religion || '',
      headshot: single_coordinator?.headshot || null,
      overseeTownsVillages: single_coordinator?.overseeTownsVillages || [],
      supervisor: (single_coordinator as any)?.supervisor || '',
      spouseName: single_coordinator?.spouseName || '',
      familyPhoto: single_coordinator?.familyPhoto || null,
      housePhoto: single_coordinator?.housePhoto || null,
      applicationForm: single_coordinator?.applicationForm || '',
      applicationFormFilename: single_coordinator?.applicationFormFilename || '',
      typeOfAnimalAllowed: 'Cows',
      noAnimalsAllocated: single_coordinator?.noAnimalsAllocated || '',
      children: single_coordinator?.children || [],
    }
  )
}