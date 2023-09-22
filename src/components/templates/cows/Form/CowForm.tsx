import {
  Grid,
  Typography,
  Box,
  FormHelperText,
  Button,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Form, Formik } from 'formik';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import SingleFile from '@/components/atoms/Input/file/SingleFile';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { calculateAge, edit } from '@/services/cow/CowServices'
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Prisma } from '@prisma/client';
import { values } from 'lodash';

interface FormProps {
  cow?: Prisma.CowCreateInput;
  countries?: Prisma.CountryCreateInput[];
}

function CowForm({
  cow,
  countries
}: FormProps) {

  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const oldImage = cow?.cowPhoto;
  const [cowImage, setCowImage] = useState(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();

  const updateCowSchema = Yup.object({
    cowPhoto: Yup.mixed().required(t("Insert Cow Photo"))
  });

  const onSubmit = async (values: any, setSubmitting: any) => {

    return await updateCow(oldImage, values, setSubmitting);
  }

  const updateCow = (oldImage: any, values: any, setSubmitting: any): any => {
    return edit(oldImage, values, async () => {
      setSubmitting(false);
      enqueueSnackbar(t('The Cow has been updated successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
      router.push(`/dashboard/cows`);
    }, (error: any) => {
      setErrorMessage(error.data);
      setSubmitting(false);
      setHasError(true);
    });
  }

  useEffect(() => {
    setCowImage(cow?.cowPhoto ? true : false);
  }, [cow?.cowPhoto]);

  return (
    <Formik
      initialValues={{
        id: cow?.id || '',
        country: ((cow?.farm as any)?.district as any)?.country || (cow?.family as any)?.townVillage?.district?.country || '',
        nfcId: cow?.nfcId || '',
        cowPhoto: cow?.cowPhoto || '',
        cowPrice: cow?.cowPrice || '',
        sellingPrice: cow?.familySellingPrice || cow?.farmSellingPrice || "-",
        weight: cow?.weight || '',
        status: cow?.status || '',
        gender: cow?.gender || '',
        dispersalDate: cow?.dispersalDate || null,
        familyPhoto: cow?.cowWithFamilyPhoto || '',
        family: cow?.family ? (cow.family as Prisma.FamilyCreateInput).name : '-',
        farm: cow?.farm ? (cow.farm as Prisma.FarmCreateInput).name : '-',

        //Pakistan Exclusive Components
        transportPrice: cow?.transportPrice || '',
        taxPrice: cow?.taxPrice || '',
        coordinatorHelperExpenses: cow?.coordinatorHelperExpenses || '',
        signedLegalDoc: cow?.signedLegalDoc || '',
        signedLegalDocFilename: cow?.signedLegalDocFilename || '',

        //Bangladesh Exclusive Components
        ageYear: cow?.ageYear || "0",
        ageMonth: cow?.ageMonth || "0",
        birthDate: cow?.birthDate,
        height: cow?.height,
        purchaseDate: cow?.purchaseDate,
        signedDispersalAgreement: cow?.signedDispersalAgreement,
        signedDispersalAgreementFilename: cow?.signedDispersalAgreementFilename,
        colour: cow?.colour,

      }}
      enableReinitialize
      validationSchema={updateCowSchema}
      onSubmit={(values, { setSubmitting }) => onSubmit(values, setSubmitting)}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Form>
              <TextInputField
                name='family'
                value={`${values.family}`}
                label={t('Family')}
                disabled={true}
              />

              <TextInputField
                name='farm'
                value={`${values.farm}`}
                label={t('Farm')}
                disabled={true}
              />

              <TextInputField
                name='country'
                value={`${(values.country as Prisma.CountryCreateInput).name || "-"}`}
                // value={values.nfcID}
                label={t('Country')}
                disabled={true}
              />

              <TextInputField
                name='nfcID'
                value={values.nfcId}
                label={t('NFC ID')}
                disabled={true}
              />

              {cowImage &&
                <div className="py-3" >
                  <Typography variant='subtitle2'>
                    {t("Current Cow Photo") + ":"}
                  </Typography>
                  <img className="h-auto w-60 border-solid border-2 border-black" src={cow?.cowPhoto} alt="" />
                  <Box className='pl-11'>
                    <Button
                      sx={{
                        mt: 1
                      }}
                      color="error"
                      onClick={() => { setCowImage(false); setFieldValue('cowPhoto', null) }}
                      size="large"
                      variant="contained"
                    >
                      {t('Delete Image')}
                    </Button>
                  </Box>
                </div>
              }

              {
                cowImage === false &&
                <SingleFile
                  cropper={true}
                  shape={"rect"}
                  onUpload={(cowPhoto) => { setFieldValue('cowPhoto', cowPhoto) }}
                  label={t('Cow Image')}
                  value={values.cowPhoto}
                  hasError={errors.cowPhoto && touched.cowPhoto ? true : false}
                  errorMessage={errors.cowPhoto}
                />
              }

              <TextInputField
                name='cowPrice'
                value={values.cowPrice}
                label={t('Cow Price')}
                disabled={true}
              />

              <TextInputField
                name='weight'
                value={values.weight}
                label={t('Weight')}
                disabled={true}
              />

              <TextInputField
                name='gender'
                value={values.gender}
                label={t('Gender')}
                disabled={true}
              />

              <TextInputField
                name='status'
                value={values.status}
                label={t('Status')}
                disabled={true}
              />

              <TextInputField
                name='sellingPrice'
                value={values.sellingPrice}
                label={t('Sold Price')}
                disabled={true}
              />

              {
                values.dispersalDate
                  ?
                  <Datepicker
                    value={values.dispersalDate as any}
                    label={t('Dispersal Date')}
                    disabled={true}
                  />
                  :
                  <></>
              }

              <div className="py-3">
                <Typography variant='subtitle2'>
                  {t("Family Photo")}:
                </Typography>
                <img className="h-auto w-60 border-solid border-2 border-black" style={{ borderRadius: '50%' }} src={values?.familyPhoto} alt="" />
              </div>

              {
                (values.country as any)?.name == "Pakistan"
                  ?
                  <>
                    <TextInputField
                      name='transportPrice'
                      value={values.transportPrice}
                      label={t('Transport Price')}
                      disabled={true}
                    />

                    <TextInputField
                      name='taxPrice'
                      value={values.taxPrice}
                      label={t('Tax Price')}
                      disabled={true}
                    />

                    <TextInputField
                      name='coordinatorHelperExpenses'
                      value={values.coordinatorHelperExpenses}
                      label={t('Coordinator Helper Expenses')}
                      disabled={true}
                    />

                    <div className="py-3">
                      <Typography variant='subtitle2'>
                        {t("Signed Legal Document")}:
                      </Typography>
                      {
                        values.signedLegalDocFilename
                          ?
                          <div className='my-5'>
                            <a className='text-[18px] underline' href={values.signedLegalDoc}>{values.signedLegalDocFilename}</a>
                          </div>

                          :
                          <img className="h-auto w-60 border-solid border-2 border-black" src={values?.signedLegalDoc} alt="" />
                      }

                    </div>
                  </>
                  :
                  <></>
              }

              {
                (values.country as any).name == "Bangladesh"
                  ?
                  <>
                    {
                      values.birthDate
                        ?
                        <TextInputField
                          name='Age'
                          value={calculateAge(values.birthDate)}
                          label={t('Age')}
                          disabled={true}
                        />
                        :
                        <TextInputField
                          name='Age'
                          value={`${values.ageYear} year(s) ${values.ageMonth} month(s)`}
                          label={t('Age')}
                          disabled={true}
                        />
                    }

                    <TextInputField
                      name='height'
                      value={values.height}
                      label={t('Height')}
                      disabled={true}
                    />

                    {
                      values.purchaseDate
                        ?
                        <Datepicker
                          value={values.purchaseDate as any}
                          label={t('Purchase Date')}
                          disabled={true}
                        />
                        :
                        <></>
                    }

                    {
                      values.colour
                        ?
                        <TextInputField
                          name='colour'
                          value={values.colour}
                          label={t('Colour')}
                          disabled={true}
                        />
                        :
                        <></>
                    }


                  </>
                  :
                  <></>
              }
              {
                hasError
                  ?
                  <FormHelperText error={true}>{errorMessage}</FormHelperText>
                  :
                  <></>
              }

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
      )}
    </Formik>
  );
}

export default CowForm;
