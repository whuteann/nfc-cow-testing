import Head from 'next/head';

import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import ListData from '@/components/templates/cowPurchaseRequests/index/ListData';
import { CREATE_COW_PURCHASE_REQUESTS } from '@/permissions/Permissions';
import { getSession } from 'next-auth/react';

function CowPurchaseRequestIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Cow Purchase Requests - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Cow Purchase Requests')}
          description={t('List of cow purchase requests')}
          showButton={(permissions?.includes(CREATE_COW_PURCHASE_REQUESTS)) ? true : false}
          buttonText={t('Create Cow Purchase Request')}
          onClick={ () => router.push('/dashboard/cow-purchase-requests/create') }
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
          <ListData />
        </Grid>
      </Grid>
    </>
  );
}

CowPurchaseRequestIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowPurchaseRequestIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}