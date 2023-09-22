import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import ListData from '@/components/templates/cowFarmSaleRequests/ListData';
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { CREATE_FARM_COW_SALES } from '@/permissions/Permissions';

function CowFarmSaleIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();
  const router = Router;

  return (
    <>
      <Head>
        <title>Cow Farm Sales - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Cow Farm Sales')}
          description={t('List of cow farms sales')}
          showButton={(permissions?.includes(CREATE_FARM_COW_SALES)) ? true : false}
          buttonText={t('Create Cow Farm Sale')}
          onClick={ () => router.push('/dashboard/cow-farm-sale-requests/create') }
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
            permissions={permissions}
          />
        </Grid>
      </Grid>
    </>
  );
}

CowFarmSaleIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowFarmSaleIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}