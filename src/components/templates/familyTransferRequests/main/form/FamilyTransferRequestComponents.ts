import * as Yup from 'yup';

interface familyTransferData {
  //Main Components
  status: string,
  family1 : {},
  family2 : {},
  noOfCows: number,
  cows: {},
  date: Date,
}

export const addCowDispersalSchema = (t: any)  =>{

  return(
    Yup.object({
    //Main Components
    status: Yup.string(),
    family1 : Yup.object().required(t("Choose a family to transfer cows")),
    family2 : Yup.object().required(t("Choose a family to receive cows")),
    date: Yup.date().required(t("Choose a date")),
    noOfCows : Yup.number().required(t("Enter number of cows")).min(1, "Enter at least 1 cow"),
    })
  )
}

export const initialValues = () : familyTransferData   => {
  return (
    {
      //Main Components to be uploaded
      status: 'Pending',
      family1 : '',
      family2: '',
      noOfCows: 0,
      date: undefined,
      cows: null,
    }
  )
}