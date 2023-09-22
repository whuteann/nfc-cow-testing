import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/townvillages/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';

function TownVillageIndex() {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Town/Villages</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Town/Villages')}
          description={t('List of town/villages')}
          showButton
          buttonText={t('Create Town/Village')}
          onClick={ () => router.push('/dashboard/townvillages/create') }
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

TownVillageIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default TownVillageIndex;
