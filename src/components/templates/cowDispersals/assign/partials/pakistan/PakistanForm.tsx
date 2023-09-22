import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import {
  newPakistanCow,
}
from '../subFormComponents';
import PakistanCard from './PakistanCard';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';

interface PakistanFormInterface {
  cowDispersal: Prisma.CowDispersalCreateInput,
  values: any,
  setFieldValue: any,
  setErrors: any,
  errors: any, 
  touched: any
}

function PakistanForm({
  cowDispersal,
  values,
  setFieldValue, 
  setErrors, 
  errors, 
  touched 
}: PakistanFormInterface) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const validateAdd = (arrayHelpers: any) => {
    if(values.cows.length < cowDispersal?.noOfCows || 0) {
      arrayHelpers.push(newPakistanCow(values.country, values.family));
      return;
    }

    enqueueSnackbar(t("You can only assign")+` ${cowDispersal?.noOfCows} `+t("cows"), {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
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
                  flexGrow:1
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
                    onClick={() => validateAdd(arrayHelpers)}
                  >
                    {t("Add")}
                  </Button>
                </Box>
              </Grid>
            </Card>

            {
              values?.cows?.map((cow: any, index: any) => {
                return(
                  <PakistanCard
                    key={index}
                    index={index}
                    cow={cow}
                    values={values}
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

export default PakistanForm;