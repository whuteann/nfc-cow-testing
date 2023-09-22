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
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import CowDeathForm from '@/components/templates/cowDeaths/form/Form';


import { getData as getFamilies } from 'pages/api/families';
import farms, { getData as getFarms } from 'pages/api/farms';
import { getData as getCows } from 'pages/api/cows';

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

function CowDeathsCreate({
  families,
  farms,
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
                              {t("Create a new death record")}
                          </Typography>
                          <Typography variant="subtitle2">
                              {t("Fill in the fields below to create a cow death record")}
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
                        href="/dashboard/cow-deaths"
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
              <CowDeathForm
                type={"Create"}
                farms={farms}
                families={families}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CowDeathsCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDeathsCreate;

export async function getServerSideProps(context: any) {
  const families = await getFamilies({
    req: context.req,
    status: 'Approved',
    filterFamily: true
  });

  const farms = await getFarms({
    req: context.req,
    filterFarm: true,
    filterDispersalFarm: true,
  })

  return{
    props:{
      families: JSON.parse(JSON.stringify(families)),
      farms: JSON.parse(JSON.stringify(farms)),
    }
  }
}