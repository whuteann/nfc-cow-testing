import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';

import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import Router from 'next/router';
import ListData from '@/components/templates/farms/index/ListData';
import { useTranslation } from 'next-i18next';

function FarmIndex() {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Farms - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Farms')}
          description={t('List of farms')}
          showButton
          buttonText={t('Create Farm')}
          onClick={ () => router.push('/dashboard/farms/create') }
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

FarmIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FarmIndex;
