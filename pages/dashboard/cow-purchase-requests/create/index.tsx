import {
  Box,
  Button,
  Grid,
  Link,
  styled,
  Typography,
} from '@mui/material';

import RequestForm from '@/components/templates/cowPurchaseRequests/create/Form';
import Master from '@/layouts/BaseLayout/master';
import { useTranslation } from 'react-i18next';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { getData as getCountries } from 'pages/api/countries';
import { getData as getFarms } from 'pages/api/farms';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function CowPurchaseRequestCreate({
  countries,
  farms
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
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h3" component="h3" gutterBottom>
                        {t('Create new cow purchase request')}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('Fill in the text field below and select from the dropdowns to create a new cow purchase request')}
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
                    href="/dashboard/cow-purchase-requests"
                    variant="contained"
                  >
                    {t('Go back')}
                  </Button>
                </Grid>
              </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <RequestForm 
                userCountries={countries} 
                farms={farms}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CowPurchaseRequestCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowPurchaseRequestCreate;

export async function getServerSideProps(context: any) {
  const countries = await getCountries({
    req: context.req,
    filterCountry: true
  });

  const farms = await getFarms({
    req: context.req,
    filterFarm: true,
    filterDispersalFarm: false
  })
  
  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries)),
      farms: JSON.parse(JSON.stringify(farms))
    }
  }
}
