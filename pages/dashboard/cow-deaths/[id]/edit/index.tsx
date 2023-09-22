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
import { getAliveCowsByFarmOrFamily } from '@/services/cow/CowServices';

import CowDeathForm from '@/components/templates/cowDeaths/form/Form';
import { IFamilyCoordinator } from '@/models/Family';
import { countries } from 'country-flag-icons';
import coordinators from 'pages/dashboard/coordinators';

import { getData as getRecord } from 'pages/api/cowDeaths/[id]';
import { getData as getCows } from 'pages/api/cows';
import { getData as getFamilies } from 'pages/api/families';
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

function CowDeathsShow({
  record,
  farms,
  // cows,
  families
}: any) {
  const { t }: { t: any } = useTranslation();
  // const dispatch = useAppDispatch();
  // const router = useRouter();
  // const { data: session } = useSession();  
  // const [initLoad, setInitLoad] = useState(undefined);

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
                              {t("View death record")}
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
                record={record}
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

CowDeathsShow.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDeathsShow;

export async function getServerSideProps(context: any) {
  const record = await getRecord(context.query.id)

  if (!record){
    return {
      notFound: true
    }
  }

  const farms = await getFarms({
    req: context.req,
    filterCountry: true,
  });
  const families = await getFamilies({
    req: context.req,
    status: 'Approved',
    filterCountry: true
  })
  
  return{
    props:{
      record: JSON.parse(JSON.stringify(record)),
      farms: JSON.parse(JSON.stringify(farms)),
      families: JSON.parse(JSON.stringify(families)),
    }
  }
}