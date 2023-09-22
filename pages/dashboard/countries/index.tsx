import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/countries/index/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';

function CountryIndex() {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Countries  - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Countries')}
          description={t('List of countries')}
          showButton
          buttonText={t('Create Country')}
          onClick={ () => router.push('/dashboard/countries/create') }
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

CountryIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CountryIndex;
