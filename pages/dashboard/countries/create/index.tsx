import {
  Box,
  Grid,
  styled,
  Card,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import PageHeader from '@/components/templates/countries/form/partials/PageHeader';
import CountryForm from '@/components/templates/countries/form/Form';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function CountryCreate() {
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
              <CountryForm/>
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CountryCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CountryCreate;
