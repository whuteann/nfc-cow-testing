import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/cowDispersals/main/listdata/ListData';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { CREATE_FAMILY_COW_DISPERSALS } from '@/permissions/Permissions';

function CowDispersalIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Cow Dispersals</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Cow Dispersals')}
          description={t('List of cow dispersals')}
          showButton={(permissions?.includes(CREATE_FAMILY_COW_DISPERSALS)) ? true : false}
          buttonText={t('Create Cow Dispersal')}
          onClick={ () => router.push('/dashboard/cow-dispersals/create') }
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

CowDispersalIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDispersalIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}