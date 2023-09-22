import {
  Box,
  Grid,
  styled,
  Card,
  Typography,
  Button,
  Link,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import BreedingForm from '@/components/templates/breedingRecords/form/Form';
import { useTranslation } from 'next-i18next';
import { getData as getCows } from 'pages/api/cows';
import { getData as getFarms } from 'pages/api/farms';


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

function BreedingRecordCreate({
  farms
}) {
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
                              {t("Create a new birth record")}
                          </Typography>
                          <Typography variant="subtitle2">
                              {t("Fill in the fields below to create a farm birth record")}
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
                        href="/dashboard/farm-birth-records"
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
              <BreedingForm
                farms={farms}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

BreedingRecordCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default BreedingRecordCreate;

export async function getServerSideProps(context: any) {
  const farms = await getFarms({
    req: context.req,
    filterFarm: true
  });

  return{
    props:{
      farms: JSON.parse(JSON.stringify(farms)),
    }
  }
}
