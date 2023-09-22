import Footer from 'src/components/atoms/Footer';
import Head from 'next/head';

import Block1 from '@/components/templates/reports/listsLarge/Block1';
import Block2 from '@/components/templates/reports/listsLarge/Block2';
import Block3 from '@/components/templates/reports/listsLarge/Block3';
import Block4 from '@/components/templates/reports/listsLarge/Block4';
import Block5 from '@/components/templates/reports/listsLarge/Block5';
import Block6 from '@/components/templates/reports/listsLarge/Block6';
import Block7 from '@/components/templates/reports/listsLarge/Block7';
import Block8 from '@/components/templates/reports/listsLarge/Block8';
import Block9 from '@/components/templates/reports/listsLarge/Block9';
import Block10 from '@/components/templates/reports/listsLarge/Block10';
import Block11 from '@/components/templates/reports/listsLarge/Block11';
import Block12 from '@/components/templates/reports/listsLarge/Block12';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';

function DataDisplayListsLarge() {
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
        <Grid item md={6} xs={12}>
          <Block1 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block2 />
        </Grid>
        <Grid item md={5} xs={12}>
          <Block3 />
        </Grid>
        <Grid item md={7} xs={12}>
          <Block4 />
        </Grid>
        <Grid item md={7} xs={12}>
          <Block5 />
        </Grid>
        <Grid item md={5} xs={12}>
          <Block6 />
        </Grid>
        <Grid item lg={5} xs={12}>
          <Block7 />
        </Grid>
        <Grid item lg={7} xs={12}>
          <Block8 />
        </Grid>
        <Grid item md={4} xs={12}>
          <Block9 />
        </Grid>
        <Grid item md={4} xs={12}>
          <Block10 />
        </Grid>
        <Grid item md={4} xs={12}>
          <Block11 />
        </Grid>
        <Grid item xs={12}>
          <Block12 />
        </Grid>
      </Grid>
      
    </>
  );
}

DataDisplayListsLarge.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DataDisplayListsLarge;
