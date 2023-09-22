import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/cowDispersals/main/listdata/ListData';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

function CowDispersalAssignCowsIndex() {
  const { t }: { t: any } = useTranslation();

  const { data: session } = useSession();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    dispatch(setLoading(true));
    if(!router.isReady) return;

    dispatch(setLoading(false));
  }, [router.isReady]);

  useEffect(() => {
    setPermissions((session as any)?.currentUser?.permissions || []);
  }, [session]);

  return (
    <>
      <Head>
        <title>Cow Dispersals - Assign Cows</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Assign Cows')}
          description={t('List of cow dispersals to assign cows')}
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
            type="Assign Cows"
            permissions={permissions} 
          />
        </Grid>
      </Grid>
      
    </>
  );
}

CowDispersalAssignCowsIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDispersalAssignCowsIndex;
