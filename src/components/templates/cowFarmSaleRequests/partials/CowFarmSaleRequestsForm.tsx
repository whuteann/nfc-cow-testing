import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import { useSnackbar } from 'notistack';
import CowFarmSalesRequestCard from './CowFarmSalesRequestCard';

interface BangladeshFormInterface {
  values: any,
  setFieldValue: any,
  setErrors: any,
  errors: any,
  touched: any
}
// 
function CowFarmSalesRequestForm({
  values,
  setFieldValue,
  setErrors,
  errors,
  touched
}: BangladeshFormInterface) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const onAdd = (arrayHelpers: any) => {
    arrayHelpers.push({
      cowOption: "",
      nfcID: ""
    });
  }

  return (
    <>
      <FieldArray
        name="cows"
        render={arrayHelpers => (
          <div>
            <Card
              sx={{
                p: 2,
                m: 1
              }}
            >
              <Grid container>
                <Box
                  sx={{
                    pl: 1,
                    flexGrow: 1
                  }}>
                  <Typography component="span" variant="subtitle1">
                    {t('Cow Details')}
                  </Typography>{' '}
                </Box>

                <Box
                  marginRight={4}
                >
                  <Button
                    variant='contained'
                    type="button"
                    color='primary'
                    onClick={() => { onAdd(arrayHelpers) }}
                  >
                    {t("Add")}
                  </Button>
                </Box>
              </Grid>
            </Card>

            {
              values?.cows?.map((cow: any, index: any) => {
                return (
                  <CowFarmSalesRequestCard
                    key={index}
                    index={index}
                    cow={cow}
                    values={values}
                    userFarms={values?.farm}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    setErrors={setErrors}
                    arrayHelpers={arrayHelpers}
                  />
                );
              })
            }
          </div>
        )}
      />
    </>
  )
}

export default CowFarmSalesRequestForm;