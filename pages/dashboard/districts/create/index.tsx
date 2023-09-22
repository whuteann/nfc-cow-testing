import {
  Box,
  styled,
  Grid,
  Card,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import DistrictForm from '@/components/templates/districts/form/Form';
import PageHeader from '@/components/templates/districts/form/partials/PageHeader';
import { getData as getCountries } from 'pages/api/countries';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function DistrictCreate({
  countries
}: any) {
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
                <PageHeader type={"create"}/>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <DistrictForm 
                  countries = {countries}
                />
              </Card>
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

DistrictCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DistrictCreate;

export async function getServerSideProps(context: any) {
  const countries = await getCountries({
    req: context.req,
    filterCountry: true
  });
  
  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries))
    }
  }
}