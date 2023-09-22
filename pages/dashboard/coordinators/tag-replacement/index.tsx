import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/coordinators/listdata/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { getSession } from 'next-auth/react';

function CoordinatorIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();
  const router = Router;

  return (
    <>
      <Head>
        <title>Coordinators</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Coordinators')}
          description={t('List of coordinators')}
          showButton={false}
          buttonText={t('Create Coordinator')}
          onClick={ () => router.push('/dashboard/coordinators/create') }
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
            type='Replacement'
            permissions={permissions}
          />
        </Grid>
      </Grid>
      
    </>
  );
}

CoordinatorIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CoordinatorIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}