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
import FamilyFarmTransferRequestForm from '@/components/templates/familyFarmTransferRequests/main/form/FamilyFarmTransferRequestForm';


import {getData as getFamilies} from '../../../api/families'
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

function FamilyFarmTransferRequestCreate({
  farms, families
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
                          {t('Add new family to farm transfer request')}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t('Fill in the field below to create a new family to farm transfer request')}
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
                      href="/dashboard/family-farm-transfer-requests"
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
              <FamilyFarmTransferRequestForm 
                farms={farms}
                familiesCoordinators={families}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

FamilyFarmTransferRequestCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyFarmTransferRequestCreate;

export async function getServerSideProps(context: any) {

  const families = await getFamilies({
    req: context.req,
    status: "Approved",
  })

  const farms = await getFarms({
    req: context.req,
    filterCountry: true,
  });
  
  return{
    props:{
      families: JSON.parse(JSON.stringify(families)),
      farms: JSON.parse(JSON.stringify(farms))
    }
  }
}
