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

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';

import { showSpecificRequest as getRequest } from '@/services/cow_farm_sales/CowFarmSalesServices';
import { ICowDispersal } from '@/models/Cow_Dispersal';
import { ICowFarmSaleRequest } from '@/models/Cow_Farm_Sale_Request';
import ApprovalForm from '@/components/templates/cowFarmSaleRequests/approval/Form';
import { getData as getCowFarmSaleRequest } from 'pages/api/cowFarmSaleRequests/[id]';

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

function CowDispersalApproval({
  cowFarmSaleRequest
}) {
  const { t }: { t: any } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
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
                          {`${cowFarmSaleRequest?.farm?.name} `+ t("Cow Farm Sale Approval - ") + (cowFarmSaleRequest?.secondaryId)}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t("Click the buttons below to update")+` ${cowFarmSaleRequest?.farm?.name} `+ t("cow farm sale status")}
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
                      href="/dashboard/cow-farm-sale-requests/approvals"
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
              <ApprovalForm 
                cowFarmSaleRequest={cowFarmSaleRequest}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

CowDispersalApproval.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDispersalApproval;

export async function getServerSideProps(context: any) {

  const cowFarmSaleRequest = await getCowFarmSaleRequest(context.query.id);
  
  if (cowFarmSaleRequest?.status != "Pending"){
    return { notFound: true }
  }

  return{
    props:{
      cowFarmSaleRequest: JSON.parse(JSON.stringify(cowFarmSaleRequest))
    }
  }
}