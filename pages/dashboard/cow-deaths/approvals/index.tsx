import Head from 'next/head';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';
import PageTitleWrapper from '@/components/atoms/PageTitleWrapper';
import ListHeader from '@/components/molecules/listHeader/ListHeader';
import ListData from '@/components/templates/cowDeaths/index/ListData';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function CowDeathsApprovalIndex() {
  const router = Router;
  const { t }: { t: any } = useTranslation();
  const { data: session } = useSession();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setPermissions((session as any)?.currentUser?.permissions || []);
  }, [session]);

  return (
    <>
      <Head>
        <title>Cow Death - Management</title>
      </Head>

      <PageTitleWrapper>
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
            type={"Approval"}
          />
        </Grid>
      </Grid>
    </>
  );
}

CowDeathsApprovalIndex.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default CowDeathsApprovalIndex;