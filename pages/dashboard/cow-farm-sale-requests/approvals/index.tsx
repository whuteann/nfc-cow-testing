import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ListData from '@/components/templates/cowFarmSaleRequests/ListData';

function CowPurchaseApprovalsIndex() {
  const { t }: { t: any } = useTranslation();
  const { data: session } = useSession();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setPermissions((session as any)?.currentUser?.permissions || []);
  }, [session]);

  return (
    <>
      <Head>
        <title>Cow Farm Sales Approval</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Cow Farm Sales Approval')}
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

CowPurchaseApprovalsIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowPurchaseApprovalsIndex;