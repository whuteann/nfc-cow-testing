import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { FieldArray } from 'formik';
import {
  newBangladeshCow,
}
from '../subFormComponents'
import { ICowDispersal } from '@/models/Cow_Dispersal';
import { useSnackbar } from 'notistack';
import BangladeshCard from './BangladeshCard';
import { Prisma } from '@prisma/client';

interface BangladeshFormInterface {
  cowDispersal: Prisma.CowDispersalCreateInput,
  values: any,
  setFieldValue: any,
  setErrors: any,
  errors: any, 
  touched: any
}

function BangladeshForm({ 
  cowDispersal,
  values,
  setFieldValue, 
  setErrors, 
  errors, 
  touched 
}: BangladeshFormInterface) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const validateAdd = (arrayHelpers: any) => {
    if(values.cows.length < cowDispersal?.noOfCows || 0) {
      arrayHelpers.push(newBangladeshCow(values.country, values.family));
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
                  <BangladeshCard
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

export default BangladeshForm;