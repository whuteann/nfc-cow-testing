import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import { useTranslation } from 'next-i18next';
import ListData from '@/components/templates/familyFarmTransferRequests/main/listdata/ListData';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function FamilyFarmTransferApprovalsIndex() {
  const { t }: { t: any } = useTranslation();
  const { data: session } = useSession();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setPermissions((session as any)?.currentUser?.permissions || []);
  }, [session]);

  return (
    <>
      <Head>
        <title>Family to Farm Transfer Request Approval</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Family to Farm Transfer Requests Approval')}
          description={t('List of pending approvals')}
          showButton={false}
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <ListData
            type='Approval'
            permissions={permissions}
          />
        </Grid>
      </Grid>
      
    </>
  );
}

FamilyFarmTransferApprovalsIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyFarmTransferApprovalsIndex;