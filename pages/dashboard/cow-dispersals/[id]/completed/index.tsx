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
import CowDispersalAssignForm from '@/components/templates/cowDispersals/assign/CowDispersalAssignForm';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';


import { ICowDispersal } from '@/models/Cow_Dispersal';
import { IFamilyCoordinator } from '@/models/Family';
import { ICountry } from '@/models/Country'
import { IFarm } from '@/models/Farm';
import { ITownVillage } from '@/models/TownVillage';

import { getData as getCowDispersal } from 'pages/api/cowdispersals/[id]';
import farms, { getData as getFarms } from 'pages/api/farms';
import { getData as getTownVillages } from 'pages/api/townvillages';
import families, { getData as getFamilies } from 'pages/api/families';

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
                          {t(`${cowDispersal?.family.name} Cow Dispersal Record`)}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t(`Showing Assigned Cow Dispersal Details`)}
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
                cowDispersal= {cowDispersal} 
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
  const [cowDispersal] = await Promise.all([
    // getFarms({
    //   req: context.req,
    //   filterCountry: true,
    //   filterFarm: true,
    //   paginate: false
    // }),
    // getTownVillages({
    //   req: context.req,
    //   filterCountry: true
    // }),
    // getFamilies({
    //   req: context.req,
    //   status: "Approved",
    //   filterCountry: true
    // }),
    await getCowDispersal(context.query.id)
  ]);

  return{
    props:{
      // farms: JSON.parse(JSON.stringify(farms)),
      // townVillages: JSON.parse(JSON.stringify(townVillages)),
      // families: JSON.parse(JSON.stringify(families)),
      cowDispersal: JSON.parse(JSON.stringify(cowDispersal))
    }
  }
}