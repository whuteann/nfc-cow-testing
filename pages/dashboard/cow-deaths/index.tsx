import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/cowDeaths/index/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';

function CowDeathsIndex({
  permissions
}: any) {
  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Cow Death - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Cow Deaths')}
          description={t('List of Cow Deaths')}
          showButton={true}
          buttonText={t('Create Cow Death Record')}
          onClick={ () => router.push('/dashboard/cow-deaths/create') }
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

CowDeathsIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDeathsIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}