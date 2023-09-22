import {
  Box,
  Grid,
  styled,
  Card,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import PageHeader from '@/components/templates/districts/form/partials/PageHeader';
import DistrictForm from '@/components/templates/districts/form/Form';
import { getData as getDistrict } from 'pages/api/districts/[id]';
import { getData as getCountries } from 'pages/api/countries';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function DistrictEdit({
  countries,
  district
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
                <PageHeader type={"edit"}/>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <DistrictForm 
                  district={district}
                  countries={countries} 
                />
              </Card>
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

DistrictEdit.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DistrictEdit;

export async function getServerSideProps(context: any) {
  const countries = await getCountries({
    req: context.req,
    filterCountry: true,
  });

  const district = await getDistrict(context.query.id);

  if (!district){
    return {
      notFound: true
    }
  }
  
  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries)),
      district: JSON.parse(JSON.stringify(district))
    }
  }
}