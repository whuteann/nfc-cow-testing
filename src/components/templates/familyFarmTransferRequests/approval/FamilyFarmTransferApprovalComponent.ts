import * as Yup from 'yup';

interface familyFarmTransferRequestsData {
  //Client side components
  familyType: string,
  townVillage: string,
  name: string,
  familiesCoordinators: [],
  selectedFamilyCoordinator: [],
  rejectionMessage : boolean,

  //Main Components
  status: string,
  farm : string,
  family : any,
  noOfCows : string,
  rejectionReason : string,
}

export const addfamilyFarmTransferRequestsSchema = (t: any) => {
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

export const initialValues = (singleFamilyFarmTransferRequest: any) : familyFarmTransferRequestsData   => {
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
      status: singleFamilyFarmTransferRequest?.status || 'Pending',
      farm : singleFamilyFarmTransferRequest?.farm?.name || '',
      family : singleFamilyFarmTransferRequest?.family || {},
      noOfCows: singleFamilyFarmTransferRequest?.noOfCows || '',
      rejectionReason: singleFamilyFarmTransferRequest?.rejectionReason || '',
    }
  )
}