import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';

import { Button, Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/users/index/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { updateSession } from '@/helpers/app';

function UserIndex() {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Users - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Users')}
          description={t('List of users')}
          showButton
          buttonText={t('Create User')}
          onClick={ () => router.push('/dashboard/users/create') }
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

UserIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default UserIndex;
