import * as Yup from 'yup';

interface familyTransferData {
  //Main Components
  status: string,
  family1 : {},
  family2 : {},
  noOfCows: number,
  cows: {},
  date: Date,
  rejectionMessage : boolean,
  rejectionReason : string,
}

export const addCowDispersalSchema = (t: any) => {
  return(
    Yup.object({
      //Main Components
      status: Yup.string(),
      family1 : Yup.object().required(t("Choose a family to transfer cows")),
      family2 : Yup.object().required(t("Choose a family to receive cows")),
      date: Yup.date().required(t("Choose a date")),
      noOfCows : Yup.number().required(t("Enter number of cows")).min(1, "Enter at least 1 cow"),
      rejectionMessage : Yup.bool(),
      rejectionReason: Yup.string().nullable()
      .when('rejectionMessage', {
        is: true,
        then: Yup.string().required(t("Enter Rejection Reason"))
      }),
    })
  )
} 

export const initialValues = (familyTransferData: any) : familyTransferData   => {
  return (
    {
      //Main Components to be uploaded
      status: familyTransferData?.status || 'Pending',
      family1 : familyTransferData?.family1 || '',
      family2: familyTransferData?.family2 || '',
      noOfCows: familyTransferData?.noOfCows ||0,
      date: familyTransferData?.date || undefined,
      cows: familyTransferData?.cows || null,
      rejectionMessage : false,
      rejectionReason: familyTransferData?.rejectionReason || '',
    }
  )
}