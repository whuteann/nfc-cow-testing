import {
  Box,
  Grid,
  styled,
  Typography,
  Button,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import Link from 'src/components/atoms/Link';
import TownVillageForm from '@/components/templates/townvillages/TownVillageForm';

import { useTranslation } from 'react-i18next';

import { getData as getCountriesFromDatabase } from 'pages/api/countries';
import { getData as getTownVillage } from 'pages/api/townvillages/[id]';

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

function TownVillageEdit({
  townVillage,
  countries
}: any) {
  const { t }: { t: any } = useTranslation();

  return (
    <>
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
                          {t("Edit")+` ${townVillage?.name}`}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t("Edit in the text field below to update")+` ${townVillage?.name}`}
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
                      href="/dashboard/townvillages"
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
              <TownVillageForm 
                single_townvillage = {townVillage} 
                countries = {countries}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

TownVillageEdit.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default TownVillageEdit;

export async function getServerSideProps(context: any) {
  const townVillage = await getTownVillage(context.query.id);
  
  const countries = await getCountriesFromDatabase({
    req: context.req,
    filterCountry: true,
  });

  if (!townVillage){
    return {
      notFound: true
    }
  }

  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries)),
      townVillage: JSON.parse(JSON.stringify(townVillage))
    }
  }
}