import * as Yup from 'yup';

interface cowDispersalData {
  //Client side components
  familyType: string,
  townVillage: string,
  name: string,
  familiesCoordinators: [],
  selectedFamilyCoordinator: [],
  rejectionMessage : boolean,

  //Main Components
  status: string,
  date: Date,
  farm : string,
  family : any,
  noOfCows : string,
  rejectionReason : string,
}

export const addCowDispersalSchema = (t: any) => {
  return(
    Yup.object({
      //Client side components
      familyType: Yup.string(),
      townVillage: Yup.object(),
      name: Yup.string(),
      familiesCoordinators: Yup.array(),
      selectedFamilyCoordinator: Yup.object().nullable(),
      rejectionMessage : Yup.bool(),
    
      //Main Components
      status: Yup.string(),
      farm : Yup.object(),
      date: Yup.date(),
      family: Yup.object(),
      noOfCows: Yup.string(),
      rejectionReason: Yup.string().nullable()
      .when('rejectionMessage', {
        is: true,
        then: Yup.string().required(t("Enter Rejection Reason"))
      }),
    })
  )
} 

export const initialValues = (cowDispersalData: any) : cowDispersalData   => {
  return (
    {
      //Client side components
      familyType: '',
      townVillage: '',
      name: '',
      familiesCoordinators: [],
      selectedFamilyCoordinator: [],
      rejectionMessage : false,

      //Main Components to be uploaded
      status: cowDispersalData?.status || 'Pending',
      date: cowDispersalData?.date || '',
      farm : cowDispersalData?.farm?.name || '',
      family : cowDispersalData?.family || {},
      noOfCows: cowDispersalData?.noOfCows || '',
      rejectionReason: cowDispersalData?.rejectionReason || '',
    }
  )
}