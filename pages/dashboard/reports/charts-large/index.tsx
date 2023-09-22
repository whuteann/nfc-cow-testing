import Footer from 'src/components/atoms/Footer';
import Head from 'next/head';

import { Grid, Typography, useTheme, Box, alpha, Card } from '@mui/material';
import NotificationImportantTwoToneIcon from '@mui/icons-material/NotificationImportantTwoTone';

import Block1 from '@/components/templates/reports/chartsLarge/Block1';
import Block2 from '@/components/templates/reports/chartsLarge/Block2';
import Block3 from '@/components/templates/reports/chartsLarge/Block3';
import Block4 from '@/components/templates/reports/chartsLarge/Block4';
import Block5 from '@/components/templates/reports/chartsLarge/Block5';
import Block6 from '@/components/templates/reports/chartsLarge/Block6';
import Block7 from '@/components/templates/reports/chartsLarge/Block7';
import Block8 from '@/components/templates/reports/chartsLarge/Block8';
import Master from '@/layouts/BaseLayout/master';

import { Chart, LinearScale, Tooltip } from 'chart.js';

// Chart.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement
// );

function DataDisplayChartsLarge() {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>Charts Large Blocks</title>
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
          <Card
            variant="outlined"
            sx={{
              background: alpha(theme.colors.info.main, 0.08),
              display: 'flex',
              alignItems: 'flex-start',
              p: 2
            }}
          >
            <NotificationImportantTwoToneIcon
              sx={{
                mr: 1,
                color: theme.colors.info.main,
                fontSize: theme.typography.pxToRem(22)
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  pt: 0.2
                }}
                gutterBottom
              >
                Version 3.0 Update
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: theme.typography.pxToRem(13)
                }}
              >
                Starting with version 3.0 we replaced <b>Chart.js</b> with{' '}
                <b>ApexCharts</b> for better UX and ease of use. If you still
                want to use the Chart.js plugin, we've included below a few
                implementation examples.
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item md={6} xs={12}>
          <Block1 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block2 />
        </Grid>

        {/* THERE IS AN ISSUE WITH BLOCK 3 */}
        {/* <Grid item md={6} xs={12}>
          <Block3 />
        </Grid> */}
        <Grid item md={6} xs={12}>
          <Block4 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block5 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block6 />
        </Grid>

        {/* THERE IS AN ISSUE WITH BLOCK 7 */}
        {/* <Grid item md={6} xs={12}>
          <Block7 />
        </Grid> */}
        <Grid item md={6} xs={12}>
          <Block8 />
        </Grid>
      </Grid>
      
    </>
  );
}

DataDisplayChartsLarge.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default DataDisplayChartsLarge;