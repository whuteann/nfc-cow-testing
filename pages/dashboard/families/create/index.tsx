import {
  Box,
  Grid,
  styled,
  Typography,
  Button,
} from '@mui/material';
import Head from "next/head";
import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import Link from 'src/components/atoms/Link';
import { useTranslation } from 'react-i18next';
import FamilyForm from '@/components/templates/families/form/FamilyForm';

import { getData as getCountries } from 'pages/api/countries';
import { getData as getTownVillages } from 'pages/api/townvillages';
import { getData as getCoordinators } from 'pages/api/families';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

const RootWrapper = styled(Box)(
  () => `
    flex: 1;
`
);

function FamilyCreate({
  countries,
  countriesDropdown,
  townVillages,
  coordinators
}: any) {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Family Create</title>
      </Head>
      <Box mb={3} display="flex">
        <MainContentWrapper>
          <Grid
            sx={{ px: 4 }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
              <RootWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography variant="h3" component="h3" gutterBottom>
                          {t('Add new Family')}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t('Fill in the field below to create a new Family')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{
                        mt: { xs: 2, sm: 0 }
                      }}
                      component={Link}
                      startIcon={<ArrowBackTwoToneIcon />}
                      href="/dashboard/families"
                      variant="contained"
                    >
                      {t('Go back')}
                    </Button>
                  </Grid>
                </Grid>
              </RootWrapper>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FamilyForm 
                single_family={null} 
                coordinators = {coordinators}
                countries = {countries} 
                countriesDropdown = {countriesDropdown}
                townvillages = {townVillages} 
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

FamilyCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyCreate;

export async function getServerSideProps(context: any) {
  const [countries, townVillages, coordinators] = await Promise.all([
    getCountries({
      req: context.req,
      filterCountry: true,
      paginate: false
    }),
    getTownVillages({
      req: context.req,
      filterCountry: true
    }),
    getCoordinators({
      req: context.req,
      status: "Approved",
      type: "Coordinator",
      filterCountry: true,
      filterFamily: true
    })
  ]);

  const [countriesDropdown] = await Promise.all([
    (countries as any)?.map((element) => {
      return {
        label: element.name,
        value: element.name,
      }
    })
  ]);
  
  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries)),
      countriesDropdown: JSON.parse(JSON.stringify(countriesDropdown)),
      townVillages: JSON.parse(JSON.stringify(townVillages)),
      coordinators: JSON.parse(JSON.stringify(coordinators))
    }
  }
}