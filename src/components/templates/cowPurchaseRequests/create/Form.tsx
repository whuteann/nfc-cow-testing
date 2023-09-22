import {
  CircularProgress,
  Card,
  Grid,
  Button,
  FormLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import TextareaField from '@/components/atoms/Input/text/textarea/TextareaField';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import { useState, useEffect } from 'react';
import { create } from '@/services/cow_purchases/CowPurchasesServices';
import { IFarm } from '@/models/Farm';
import { useSnackbar } from 'notistack';
import { ICountry } from '@/models/Country';;
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { TbCurrencyTaka } from 'react-icons/tb';
import { IconContext } from "react-icons";
import { getTotalFarmCows } from '@/services/farm/FarmServices';
 

interface RequestProps {
  userCountries: ICountry[];
  farms: IFarm[]
}

function RequestForm({
  userCountries,
  farms
}: RequestProps) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [filteredFarms, setFilteredFarms] = useState([]);

  const [total, setTotal] = useState(0);
  const [totalCows, setTotalCows] = useState(null);

  const [countryIcon, setCountryIcon] = useState<any>(null);

  useEffect(() => {
    if (userCountries.length === 1) {
      setFilteredFarms(farms.filter(((f: IFarm) => f.district.country.name == userCountries[0].name)))
    }
  }, [userCountries]);

  const addRequestSchema = Yup.object({
    farm: Yup.object().required(t('Select a farm')),
    country: Yup.object().required(t('Select a country')),
    noOfCows: Yup.number()
      .typeError(t('Must be a number'))
      .required(t('Enter Number of Cows')),
    pricePerCow: Yup.number()
      .typeError(t('Must be a number'))
      .required(t('Enter Price Per Cow')),
    reasonForPurchase: Yup.string()
      .required(t('Enter Reason for Purchase')),
    calculatedPurchasePrice: Yup.number()
  });

  const onCountryChange = async (country: any, setFieldValue: any, values: any) => {
    setFieldValue('farm', '');
    setFieldValue('country', country);
    setTotalCows(null);

    if (country.name === "Bangladesh") {
      setCountryIcon(
        <IconContext.Provider value={{ size: '25px' }}>
          <div>
            <TbCurrencyTaka />
          </div>
        </IconContext.Provider>
      )
    }
    else if (country.name === "Pakistan") {
      setCountryIcon(
        <p className="text-base">Rs</p>
      )
    }

    setFilteredFarms(farms.filter(((f: IFarm) => f.district.country.name == country.name)))
  }

  const onFarmChange = async (farm: any) => {
    // TODO find out and create this feature

    getTotalFarmCows(farm.id, (result:any)=>{
      if(result == null){
        setTotalCows(null)
        return
      }
      setTotalCows(result.totalAmountOfCows)
    }, (err)=>{
      console.error(err)
    })
  }

  const onSubmit = async (values: any, setSubmitting: any) => {


    return await createRequest(values, setSubmitting);
  }

  function onChangeValue(noOfCows?: any, pricePerCow?: any, setFieldValue?: any) {
    const totalPrice = noOfCows * pricePerCow;
    setFieldValue("calculatedPurchasePrice", totalPrice);
    setTotal(totalPrice);
  }

  const createRequest = (values: any, setSubmitting: any) => {
    return create(values, () => {
      router.push(`/dashboard/cow-purchase-requests`);

      setSubmitting(false);

      enqueueSnackbar(t('The Request Has Been Created Successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
      });
    }, (error: any) => {
      setSubmitting(false);
    });
  }

  return (
    <Formik
      initialValues={{
        country: userCountries.length === 1 && userCountries[0] || '',
        noOfCows: '',
        pricePerCow: '',
        reasonForPurchase: '',
        calculatedPurchasePrice: '',
        farm: '',
        status: 'Pending'
      }}
      enableReinitialize
      validationSchema={addRequestSchema}
      onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Card
          sx={{
            p: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Form>
                <DropdownField
                  label={t('Country')}
                  disabled={userCountries.length === 1 ? true : false}
                  items={userCountries}
                  placeholder={t('Select a country')}
                  value={values.country}
                  onChangeValue={(country) => { onCountryChange(country, setFieldValue, values) }}
                  hasError={errors.country && touched.country ? true : false}
                  errorMessage={errors.country}
                />

                {
                  values.country
                    ?
                    <>
                      <DropdownField
                        label={t('Farm')}
                        disabled={false}
                        items={filteredFarms}
                        placeholder={t('Select a farm')}
                        value={values.farm}
                        onChangeValue={(farm) => { setFieldValue('farm', farm); onFarmChange(farm) }}
                        hasError={errors.farm && touched.farm ? true : false}
                        errorMessage={errors.farm}
                      />
                      {
                        totalCows != null && <FormLabel>Total Cows: {totalCows} </FormLabel>
                      }
                    </>
                    :
                    <></>
                }

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextInputField
                      name='noOfCows'
                      value={values.noOfCows}
                      label={t('Number of Cows')}
                      onChangeText={(noOfCows) => { setFieldValue('noOfCows', noOfCows); onChangeValue(noOfCows, values.pricePerCow, setFieldValue) }}
                      hasError={errors.noOfCows && touched.noOfCows ? true : false}
                      errorMessage={errors.noOfCows}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextInputField
                      name='pricePerCow'
                      value={values.pricePerCow}
                      label={t('Price Per Cow')}
                      hasIcon={countryIcon ? true : false}
                      icon={countryIcon}
                      iconPosition={"left"}
                      onChangeText={(pricePerCow) => { setFieldValue('pricePerCow', pricePerCow); onChangeValue(pricePerCow, values.noOfCows, setFieldValue) }}
                      hasError={errors.pricePerCow && touched.pricePerCow ? true : false}
                      errorMessage={errors.pricePerCow}
                    />
                  </Grid>
                </Grid>

                <TextareaField
                  name='reasonForPurchase'
                  value={values.reasonForPurchase}
                  label={t('Reason for Purchase')}
                  onChangeText={(reasonForPurchase) => { setFieldValue('reasonForPurchase', reasonForPurchase) }}
                  hasError={errors.reasonForPurchase && touched.reasonForPurchase ? true : false}
                  errorMessage={errors.reasonForPurchase}
                />

                <TextInputField
                  name='calculatedPurchasePrice'
                  value={total}
                  label={t('Calculated Purchase Price')}
                  onChangeText={(calculatedPurchasePrice) => { setFieldValue('calculatedPurchasePrice', calculatedPurchasePrice) }}
                  hasError={errors.calculatedPurchasePrice && touched.calculatedPurchasePrice ? true : false}
                  errorMessage={errors.calculatedPurchasePrice}
                  disabled={true}
                />
                
                <Button
                  sx={{
                    mt: 3
                  }}
                  color="primary"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={isSubmitting}
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                >
                  {t('Submit')}
                </Button>
              </Form>
            </Grid>
          </Grid>
        </Card>
      )}
    </Formik>
  );
}

export default RequestForm;
