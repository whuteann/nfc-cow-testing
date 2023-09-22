import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { CREATE_FARM_BREEDING_RECORDS } from '@/permissions/Permissions';
import { getSession } from 'next-auth/react';
import ListData from '@/components/templates/familyBreedingRecords/index/ListData';


function BreedingRecordIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();

  const router = Router;

  return (
    <>
      <Head>
        <title>Family Birth Records - Management</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Family Birth Records')}
          description={t('List of Family Birth Records')}
          showButton={false}
          buttonText={t('Create Farm Birth Record')}
          onClick={ () => {}}
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

BreedingRecordIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default BreedingRecordIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}