import {
  Box,
  Grid,
  styled,
  Typography,
  Button,
} from '@mui/material';

import ApprovalForm from '@/components/templates/cowPurchaseRequests/approval/Form';
import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import Link from 'src/components/atoms/Link';
import { useTranslation } from 'react-i18next';
import { getData as getCowPurchaseRequest} from 'pages/api/cowPurchaseRequests/[id]';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function RequestApprove({
  request
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
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography variant="h3" component="h3" gutterBottom>
                          {t("Cow Purchase Request Approval of Request ID") + `: ${request?.secondaryId}`}
                        </Typography>
                        <Typography variant="subtitle2">
                          {t("Press the approve or reject button to approve or reject the request")}
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
                      href="/dashboard/cow-purchase-requests/approvals"
                      variant="contained"
                    >
                      {t('Go back')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <ApprovalForm
                request={request}
              // countries={countries}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

RequestApprove.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default RequestApprove;

export async function getServerSideProps(context: any) {
  const request = await getCowPurchaseRequest(context.query.id)

  if (request?.status != "Pending"){
    return { notFound: true }
  }

  return {
    props: {
      request: JSON.parse(JSON.stringify(request)),
    }
  }
}
