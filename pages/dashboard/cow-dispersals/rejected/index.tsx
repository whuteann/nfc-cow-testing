import Head from 'next/head';
import Footer from 'src/components/atoms/Footer';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/cowDispersals/main/listdata/ListData';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

function FamilyIndex() {

  const { data: session } = useSession();

  const { t }: { t: any } = useTranslation();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    dispatch(setLoading(true));
    if(!router.isReady) return;
    
    setPermissions((session as any)?.currentUser?.permissions || []);
    dispatch(setLoading(false));
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Cow Dispersals</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t('Rejected Cow Dispersals')}
          description={t('List of rejected cow dispersals')}
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
            permissions={permissions}
          />
        </Grid>
      </Grid>
      
    </>
  );
}

FamilyIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default FamilyIndex;
