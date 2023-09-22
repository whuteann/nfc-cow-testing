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

import { useRouter } from 'next/router';
import { useAppDispatch } from '@/store';
import CowDispersalAssignForm from '@/components/templates/cowDispersals/assign/CowDispersalAssignForm';

import { getData } from 'pages/api/cowdispersals/[id]';

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

function CowDispersalAssign({
  cowDispersal
}: any) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { id } = router.query;

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
                          {`${cowDispersal?.family?.name} `+t("Cow Dispersal Assignment")}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t("Add cows to assign cow dispersals")}
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
              <CowDispersalAssignForm 
                cowDispersal={cowDispersal}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CowDispersalAssign.getLayout = (page: any) => (
  <Master>{page}</Master>
);


export default CowDispersalAssign;

export async function getServerSideProps(context: any) {
  const cowDispersal = await getData(context.query.id);


  if (cowDispersal?.status == "Completed"){
    return{
      props:{
        cowDispersal: JSON.parse(JSON.stringify(cowDispersal))
      }
    }
  }
  
  return {
    notFound: true
  }
}