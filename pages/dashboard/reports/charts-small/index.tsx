import Footer from 'src/components/atoms/Footer';
import Head from 'next/head';


import Block1 from '@/components/templates/reports/chartsSmall/Block1';
import Block2 from '@/components/templates/reports/chartsSmall/Block2';
import Block3 from '@/components/templates/reports/chartsSmall/Block3';
import Block4 from '@/components/templates/reports/chartsSmall/Block4';
import Block5 from '@/components/templates/reports/chartsSmall/Block5';
import Block6 from '@/components/templates/reports/chartsSmall/Block6';
import { Grid } from '@mui/material';
import Master from '@/layouts/BaseLayout/master';

function DataDisplayChartsSmall() {
  return (
    <>
      <Head>
        <title>Charts Small Blocks</title>
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
        <Grid item xs={12}>
          <Block3 />
        </Grid>
        <Grid item xs={12}>
          <Block4 />
        </Grid>
        <Grid item xs={12}>
          <Block5 />
        </Grid>
        <Grid item xs={12}>
          <Block6 />
        </Grid>
      </Grid>
      
    </>
  );
}

DataDisplayChartsSmall.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DataDisplayChartsSmall;
