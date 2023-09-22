import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/districts/index/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';

function DistrictIndex() {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Districts - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Districts')}
          description={t('List of districts')}
          showButton
          buttonText={t('Create District')}
          onClick={ () => router.push('/dashboard/districts/create') }
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
          <ListData/>
        </Grid>
      </Grid>
      
    </>
  );
}

DistrictIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DistrictIndex;
