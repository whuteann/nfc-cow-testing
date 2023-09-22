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
import { useTranslation } from 'react-i18next';
import CoordinatorForm from '@/components/templates/coordinators/form/CoordinatorForm';

import { SUPERVISOR_ROLE } from '@/types/Common';

import { getData as getCountries } from 'pages/api/countries';
import { getData as getTownVillages } from 'pages/api/townvillages';
import { getData as getSupervisors } from 'pages/api/users';
import { getData as getCoordinator } from 'pages/api/families/[id]';

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

function CoordinatorEdit({
  coordinator,
  countries,
  countriesDropdown,
  townVillages,
  supervisors
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
                          {t("Edit")+` ${coordinator?.name}`}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t("Edit in the text field below to update")+` ${coordinator?.name}`}
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
                      href="/dashboard/coordinators"
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
              <CoordinatorForm
                single_coordinator = {coordinator} 
                supervisors = {supervisors}
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

CoordinatorEdit.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CoordinatorEdit;

export async function getServerSideProps(context: any) {
  const [coordinator, countries, townVillages, supervisors] = await Promise.all([
    getCoordinator(context.query.id),
    getCountries({
      req: context.req,
      filterCountry: true,
      paginate: false
    }),
    getTownVillages({
      req: context.req,
      filterCountry: true
    }),
    getSupervisors({
      req: context.req,
      role: SUPERVISOR_ROLE,
      filterCountry: true
    })
  ]);

  if (!coordinator){
    return {
      notFound: true
    }
  }

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
      coordinator: JSON.parse(JSON.stringify(coordinator)),
      countries: JSON.parse(JSON.stringify(countries)),
      countriesDropdown: JSON.parse(JSON.stringify(countriesDropdown)),
      townVillages: JSON.parse(JSON.stringify(townVillages)),
      supervisors: JSON.parse(JSON.stringify(supervisors))
    }
  }
}