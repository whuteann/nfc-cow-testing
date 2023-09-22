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
import CowDispersalForm from '@/components/templates/cowDispersals/main/form/CowDispersalForm';
import { getData as getTownVillages } from 'pages/api/townvillages';
import { getData as getFamilies } from 'pages/api/families';

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

function CowDispersalCreate({
  townVillages,
  families
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
                            {t('Add new cow dispersal')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('Fill in the field below to create a new cow dispersal')}
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
                        href="/dashboard/cow-dispersals"
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
              <CowDispersalForm
                families={families}
                townvillages={townVillages}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CowDispersalCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDispersalCreate;

export async function getServerSideProps(context: any) {
  const [townVillages, families] = await Promise.all([
    getTownVillages({
      req: context.req,
      filterCountry: true
    }),
    getFamilies({
      req: context.req,
      status: "Approved",
      filterCountry: true,
      filterFamily: true
    })
  ]);

  return {
    props: {
      townVillages: JSON.parse(JSON.stringify(townVillages)),
      families: JSON.parse(JSON.stringify(families))
    }
  }
}