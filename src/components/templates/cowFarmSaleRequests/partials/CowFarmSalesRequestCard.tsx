import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import DropdownInputImage from '@/components/atoms/Input/dropdown/DropdownInputImage';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { cowOptions } from '../../cowDispersals/assign/partials/subFormComponents';
import { index as getCowsFromDatabase } from '@/services/cow/CowServices';
import { COW_INFARM } from '@/types/Status'
import { Prisma } from '@prisma/client';

interface cardProps {
  index: number,
  cow: any,
  values: any,
  userFarms: any,
  errors: any,
  touched: any,
  setFieldValue: any,
  setErrors: any,
  arrayHelpers: any
}

const CowFarmSalesRequestCard = ({
  index,
  cow,
  values,
  userFarms,
  errors,
  touched,
  setFieldValue,
  setErrors,
  arrayHelpers
}: cardProps) => {
  const { t }: { t: any } = useTranslation();

  const [search, setSearch] = useState('');
  const [cows, setCows] = useState([]);

  const onCowOptionChange = (value: any) => {
    getCows();
    setFieldValue(`cows.${index}`, {
      cowOption: value || '',
      nfcId: ""
    });
  }

  const changeCow = (value: any, setFieldValue: any) => {
    setFieldValue(`cows.${index}`, {
      cowOption: values.cows[index].cowOption,
      ...value
    });
  }

  const getCows = (localSearch: String = '') => {
    let query = {
      nfcIdSearch: localSearch,
      farm: values.farm ? values.farm.name : '',
      status: [COW_INFARM],
      filterFarm: true,
    }

    getCowsFromDatabase(query, (cows: Prisma.CowCreateInput[]) => {
      setCows(cows || [])
    }, (error: any) => {
      console.error('err', error);
    });
  }

  return (
    <Card
      sx={{
        p: 2,
        m: 1
      }}
    >
      <Grid container sx={{
        mt: 0,
      }}>
        <Box
          sx={{
            pl: 1,
            flexGrow: 1
          }}>
          <Typography component="span" variant="subtitle1">
            {t("Cow") + ` ${index + 1}`}
          </Typography>{' '}
        </Box>

        <Box
          marginRight={0}
        >
          <Button
            variant='outlined'
            type="button"
            color='error'
            onClick={() => { arrayHelpers.remove(index) }}
          >
            {t("Remove")}
          </Button>
        </Box>
      </Grid>

      <Grid container key={index} alignItems="center" gap={1} columns={12}>
        {
          <>
            <Grid xs={12} item={true}>
              <DropdownStringField
                items={cowOptions}
                value={cow.cowOption}
                label={t("Select Option")}
                placeholder={t("Option")}
                onChangeValue={(value) => { onCowOptionChange(value) }}
                hasError={errors && errors.cows && errors.cows[index] && errors.cows[index].cowOption && touched && touched.cows && touched.cows[index] && touched.cows[index].cowOption ? true : false}
                errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index].cowOption ? errors?.cows[index]?.cowOption : ""}
              />
            </Grid>
            <Grid xs={12} item={true}>
              {
                cow.cowOption
                  ?
                  <>
                    {
                      cow.cowOption === "Select By NFC ID"
                        ?
                        <DropdownInputField
                          label={t('Cow NFC ID')}
                          customLabel='nfcId'
                          items={cows}
                          value={cow}
                          onChangeValue={(chosenCow) => {
                            changeCow(chosenCow, setFieldValue);
                          }}
                          onCallData={(inputValue: string) => getCows(inputValue)}
                          hasError={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcID && touched && touched.cows && touched.cows[index] && touched.cows[index].nfcID ? true : false}
                          errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcID ? errors?.cows[index]?.nfcID : ""}
                        />
                        :
                        <DropdownInputImage
                          label={t('Cow Image')}
                          customLabel='nfcId'
                          items={cows}
                          value={cow.nfcId}
                          onChangeValue={(chosenCow) => {
                            changeCow(chosenCow, setFieldValue);
                          }}
                          imageName='cowPhoto'
                          onCallData={(inputValue: string) => getCows(inputValue)}
                          hasError={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcID && touched && touched.cows && touched.cows[index] && touched.cows[index].nfcID ? true : false}
                          errorMessage={errors && errors.cows && errors.cows[index] && errors.cows[index]?.nfcID ? errors?.cows[index]?.nfcID : ""}
                        />
                    }
                  </>
                  :
                  <></>
              }
            </Grid>
          </>
        }
      </Grid>
    </Card>
  );
}

export default CowFarmSalesRequestCard;