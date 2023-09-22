import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import { useTranslation } from 'next-i18next';
import ListData from '@/components/templates/cowPurchaseRequests/index/ListData';

function CowPurchaseApprovalsIndex() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>Cow Purchase Requests Approval</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Cow Purchase Requests Approval')}
          description={t('List of pending approvals')}
          showButton={false}
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
            type='Approval'
          />
        </Grid>
      </Grid>
      
    </>
  );
}

CowPurchaseApprovalsIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowPurchaseApprovalsIndex;