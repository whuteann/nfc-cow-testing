import {
  Box,
  Grid,
  styled,
  Typography,
  Button,
  Link,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { IFarm } from '@/models/Farm';
import CowDeathApprovalForm from '@/components/templates/cowDeaths/approval/Form';
import { IFamilyCoordinator } from '@/models/Family';
import { ICowDeath } from '@/models/Cow_Death';

// import {show as getRecord} from '@/services/cow_deaths/CowDeathsServices';
// import { getAliveCowsByFarmOrFamily  } from '@/services/cow/CowServices';

import { Prisma } from '@prisma/client';
import { getData as getRecord } from 'pages/api/cowDeaths/[id]';
import { getData as getCows } from 'pages/api/cows';
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

function CowDeathsApproval({
  record,
  cows,
  families
}) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const [initLoad, setInitLoad] = useState(undefined);

  const farms = (session as any)?.currentUser?.farms;


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
                              {t("Approve death record")}
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
                        href="/dashboard/cow-deaths/approvals"
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
              <CowDeathApprovalForm
                record={record} 
                cows={cows}
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

CowDeathsApproval.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDeathsApproval;

export async function getServerSideProps(context: any) {
  const [record, cows, families] = await Promise.all([
    getRecord(context.query.id),
    getCows({
      req: context.req,
      isAliveOnly: true,
      filterCountry: true
    }, context.res),
    getFamilies({
      req: context.req,
      status: 'Approved',
      filterCountry: true
    })
  ]);

  if (record?.status != "Pending"){
    return { notFound: true }
  }
  
  return{
    props:{
      record: JSON.parse(JSON.stringify(record)),
      cows: JSON.parse(JSON.stringify(cows)),
      families: JSON.parse(JSON.stringify(families)),
    }
  }
}