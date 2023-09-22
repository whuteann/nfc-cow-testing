import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/familyTransferRequests/main/listdata/ListData';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';
import { getSession, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { CREATE_FAMILY_TRANSFER_REQUESTS } from '@/permissions/Permissions';

function FamilyTransferRequestIndex({
  permissions
}: any) {
  const { t }: { t: any } = useTranslation();

  const router = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    if(!router.isReady) return;

    dispatch(setLoading(false));
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Family Transfer Requests</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Family Transfer Requests')}
          description={t('List of family transfer requests')}
          showButton={(permissions?.includes(CREATE_FAMILY_TRANSFER_REQUESTS)) ? true : false}
          buttonText={t('Create Family Transfer Request')}
          onClick={ () => router.push('/dashboard/family-transfer-requests/create') }
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

FamilyTransferRequestIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyTransferRequestIndex;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  return{
    props:{
      permissions: (session as any)?.currentUser?.permissions
    }
  }
}