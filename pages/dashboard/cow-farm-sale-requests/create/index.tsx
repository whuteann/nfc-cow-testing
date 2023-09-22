import {
  Box,
  Grid,
  styled,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import RequestForm from '@/components/templates/cowFarmSaleRequests/create/Form';
import Master from '@/layouts/BaseLayout/master';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import farms, { getData as getFarms } from 'pages/api/farms';
// import { getData as getCows } from 'pages/api/cows';
import { Prisma } from '@prisma/client';

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

function CowPurchaseRequestCreate({
  farms
}: any) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Create Cow Farm Sale Request</title>
      </Head>

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
                        {t('Create new cow farm sale request')}
                      </Typography>
                      <Typography variant="subtitle2">
                        {t('Fill in the text field below to create a new cow farm sale request')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <RequestForm
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
  const farms = await getFarms({
    req: context.req,
    filterFarm: true,
  });

  return{
    props:{
      farms: JSON.parse(JSON.stringify(farms)),
    }
  }
}