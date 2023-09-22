import Footer from 'src/components/atoms/Footer';
import Head from 'next/head';

import Block1 from '@/components/templates/reports/navigation/Block1';
import Block2 from '@/components/templates/reports/navigation/Block2';
import Block3 from '@/components/templates/reports/navigation/Block3';
import Block4 from '@/components/templates/reports/navigation/Block4';
import Block5 from '@/components/templates/reports/navigation/Block5';
import Block6 from '@/components/templates/reports/navigation/Block6';
import Block7 from '@/components/templates/reports/navigation/Block7';
import Block8 from '@/components/templates/reports/navigation/Block8';
import Block9 from '@/components/templates/reports/navigation/Block9';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';

function DataDisplayNavigation() {
  return (
    <>
      <Head>
        <title>Analytics Dashboard</title>
      </Head>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Block1 />
        </Grid>
        <Grid item xs={12}>
          <Block2 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block3 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block4 />
        </Grid>
        <Grid item xs={12}>
          <Block5 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block6 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block7 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block8 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block9 />
        </Grid>
      </Grid>
      
    </>
  );
}

DataDisplayNavigation.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DataDisplayNavigation;
