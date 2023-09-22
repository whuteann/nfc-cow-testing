import Head from 'next/head';

import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import { useTranslation } from 'next-i18next';
import ListData from '@/components/templates/cowPurchaseRequests/index/ListData';

function CowPurchaseRequestRejected() {
  const { t }: { t: any } = useTranslation();

  return (
    <>  
      <Head>
        <title>Rejected Cow Purchase Requests</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Rejected Cow Purchase Requests')}
          description={t('List of rejected approvals')}
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
            type='Rejected'
          />
        </Grid>
      </Grid>
    </>
  );
}

CowPurchaseRequestRejected.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowPurchaseRequestRejected;
