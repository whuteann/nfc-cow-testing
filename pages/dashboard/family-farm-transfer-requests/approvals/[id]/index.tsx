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

import FamilyFarmTransferApprovalForm from '@/components/templates/familyFarmTransferRequests/approval/FamilyFarmTransferApprovalForm';
import { getData as getFamilyFarmTransferRequest } from '../../../../api/familyFarmTransferRequests/[id]/index'

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

function FamilyFarmTransferApproval({
  familyFarmTransfer
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
                            {`${familyFarmTransfer?.family?.name} ` + t("Family to Farm Transfer Request Approval")}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t("Click the buttons below to update") + ` ${familyFarmTransfer?.family?.name} ` + t("family to farm transfer status")}
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
                        href="/dashboard/family-farm-transfer-requests/approvals"
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
              <FamilyFarmTransferApprovalForm
                singleFamilyFarmTransferRequest={familyFarmTransfer}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

FamilyFarmTransferApproval.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyFarmTransferApproval;

export async function getServerSideProps(context: any) {
  const familyFarmTransfer = await getFamilyFarmTransferRequest(context.query.id)

  if (familyFarmTransfer?.status != "Pending"){
    return { notFound: true }
  }

  return {
    props: {
      familyFarmTransfer: JSON.parse(JSON.stringify(familyFarmTransfer)),
    }
  }
}