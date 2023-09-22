import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Button, FormHelperText, Grid, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { useSnackbar } from 'notistack';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';

function CowDispersalFamilyComponent({ 
  values, 
  filteredFamiliesCoordinators, 
  familiesCoordinators, 
  setFieldValue, 
  setFieldError, 
  errors, 
  touched 
}: any) {
  const { t }: { t: any } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();

  const addHandler: any = (arrayHelpers : any) => {
    if(values.selectedFamilyCoordinator == ''){
      enqueueSnackbar(t('Please select a Family/Coordinator'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });

      return;
    }
    if(values.familiesCoordinators.some((e:any) => e?.family?.id == values?.selectedFamilyCoordinator?.id)){
      enqueueSnackbar(t('The selected Family/Coordinator is already added'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
      
      return;
    }

    arrayHelpers.push({family: values.selectedFamilyCoordinator, noOfCows: 0})
  }

  function handleFamilyChange (value: any, setFieldValue : any) {
    setFieldValue("selectedFamilyCoordinator", value)
  }

  function handleNoOfCows (value: any, familyCoordinator: any, errors:any, setFieldValue : any) {
    familyCoordinator.noOfCows = value
    setFieldValue("values.familiesCoordinators", familyCoordinator)
  }
  
  return (
    <>
    <FieldArray
      name="familiesCoordinators"
      render={arrayHelpers => (
        <>
          <Typography component="span" variant="subtitle1">
            {t('Family / Coordinator')}
          </Typography>{' '}

          <Grid container alignItems="center" gap={1} >
            <Grid xs={5} item={true}>
              <DropdownField 
                value={values.selectedFamilyCoordinator}
                items={filteredFamiliesCoordinators}
                label={t("Select Family / Coordinator")}
                onChangeValue={(value) => handleFamilyChange(value, setFieldValue)}
                hasError={errors.selectedFamilyCoordinator ? true : false}
                errorMessage={errors.selectedFamilyCoordinator}
              />
            </Grid>
            <Grid xs={2} item={true}>
              <Button
                variant='contained'
                type="button" 
                color='primary' 
                onClick={() => addHandler(arrayHelpers)}
              >
                {t("Add")}
              </Button>
            </Grid>
          </Grid>

          {values.familiesCoordinators.map((familyCoordinator: any, index: any) => (
            <Grid container key={index} alignItems="center" gap={1} wrap="nowrap" >
              <Grid xs={4} item={true}>
                <TextInputField 
                  key={`familyCoordinator[${index}].name`}
                  name='Family'
                  label={t('Family/Coordinator')}
                  value={familyCoordinator?.family?.name}
                  disabled={true}
                />
              </Grid>
              <Grid xs={3} item={true}>
                <TextInputField 
                  key={`familyCoordinator[${index}].noAnimalsAllocated`}
                  name='No. Animals Allocated'
                  label={t('No. Animals Allocated')}
                  value={familyCoordinator.family.noAnimalsAllocated}
                  disabled={true}
                />
              </Grid>
              <Grid xs={3} item={true}>
              <TextInputField 
                  key={`familyCoordinator[${index}].noOfCows`}
                  name="No of Cows"
                  type="number"
                  label={t('No of Cows')}
                  value={familyCoordinator.noOfCows}
                  onChangeText={(value)=> handleNoOfCows(value, familyCoordinator, errors, setFieldValue)}
                  hasError={errors && errors.familiesCoordinators && errors.familiesCoordinators[index] && errors.familiesCoordinators[index].noOfCows && touched.familiesCoordinators && touched.familiesCoordinators[index] && touched.familiesCoordinators[index].noOfCows ? true : false}
                  errorMessage={errors && errors.familiesCoordinators && errors.familiesCoordinators[index] && errors.familiesCoordinators[index].noOfCows}
                />
              </Grid>
              

              <Grid xs={2} item={true}>
                <Button 
                  variant='outlined'
                  type="button" 
                  color='error' 
                  onClick={() => arrayHelpers.remove(index)}
                >
                  {t("Remove")}
                </Button>
              </Grid>
            </Grid>
          ))}
          
        </>
      )}
    />
    </>
  )
}

export default CowDispersalFamilyComponent;