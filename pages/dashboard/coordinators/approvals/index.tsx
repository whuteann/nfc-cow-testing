import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/coordinators/listdata/ListData';
import { useTranslation } from 'next-i18next';
import { getSession } from 'next-auth/react';

function CoordinatorApprovalList({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();
 
  return (
    <>
      <Head>
        <title>Coordinators</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Coordinators Approval')}
          description={t('List of pending coordinators')}
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
            permissions={permissions}
          />
        </Grid>
      </Grid>
      
    </>
  );
}

CoordinatorApprovalList.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CoordinatorApprovalList;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}