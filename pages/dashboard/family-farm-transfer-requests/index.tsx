import Head from 'next/head';

import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import ListData from '@/components/templates/familyFarmTransferRequests/main/listdata/ListData';
import { CREATE_FAMILY_FARM_TRANSFER_REQUESTS } from '@/permissions/Permissions';
import { getSession } from 'next-auth/react';

function FamilyFarmTransferIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Family to Farm Transfer Requests - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Family to Farm Transfer Requests ')}
          description={t('List of family to farm transfer requests')}
          showButton={(permissions?.includes(CREATE_FAMILY_FARM_TRANSFER_REQUESTS)) ? true : false}
          buttonText={t('Create Family to Farm Transfer Requests')}
          onClick={ () => router.push('/dashboard/family-farm-transfer-requests/create') }
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

FamilyFarmTransferIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyFarmTransferIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}