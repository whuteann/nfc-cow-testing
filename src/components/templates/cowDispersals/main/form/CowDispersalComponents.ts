import * as Yup from 'yup';

interface cowDispersalData {
  //Client side components
  familyType: string,
  townVillage: {},
  name: string,
  selectedFamilyCoordinator: {},

  //Main Components
  status: string,
  familiesCoordinators : [],
  date: Date,
}

export const addCowDispersalSchema = (t: any)  =>{

  return(
    Yup.object({
    //Client side components
    familyType: Yup.string(),
    townVillage: Yup.object(),
    name: Yup.string(),
    selectedFamilyCoordinator: Yup.object(),

    //Main Components
    status: Yup.string(),
    date: Yup.date().required(t("Choose a date")),
    familiesCoordinators: Yup.array()
    .of(
      Yup.object().shape(
        {
          family: Yup.object()
            .required(),
          noOfCows: Yup.number()
            .required(t("No of Cows is required"))
            .min( 1, t("Please enter at least 1 cow") )
            .typeError(t('Invalid format'))
        }
      )
    ),
    })
  )
}

export const initialValues = () : cowDispersalData   => {
  return (
    {
      //Client side components
      familyType: '',
      townVillage: {},
      name: '',
      selectedFamilyCoordinator: "",

      //Main Components to be uploaded
      status: 'Pending',
      familiesCoordinators: [],
      date: undefined,
    }
  )
}