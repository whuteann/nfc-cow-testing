import {
  Box,
  Grid,
  styled,
  Typography,
  Button,
} from '@mui/material';

import CountryForm from '@/components/templates/countries/form/Form';
import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import Link from 'src/components/atoms/Link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { getData } from 'pages/api/countries/[id]';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function CountryEdit({
  country
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
                        {t(`Edit ${country?.name}'s Name`)}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t(`Edit in the text field below to update ${country?.name}'s name`)}
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
                    href="/dashboard/countries"
                    variant="contained"
                  >
                    {t('Go back')}
                  </Button>
                </Grid>
              </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <CountryForm 
                country={country} 
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CountryEdit.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CountryEdit;

export async function getServerSideProps(context: any) {
  const country = await getData(context.query.id);

  if (!country){
    return {
      notFound: true
    }
  }
  
  return{
    props:{
      country: JSON.parse(JSON.stringify(country))
    }
  }
}