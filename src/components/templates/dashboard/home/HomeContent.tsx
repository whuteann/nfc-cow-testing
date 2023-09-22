import Footer from 'src/components/atoms/Footer';

import { Grid } from '@mui/material';

import Block1 from './partials/Block1';
import Block2 from './partials/Block2';

interface homeProps {
  totalFarmCows: Array<any>,
  showTotalFarmCows: boolean
}

function HomeContent({
  totalFarmCows,
  showTotalFarmCows
}: homeProps) {

  return (
    <>
      <Grid
        sx={{
          pt: 4,
          px: 4,
          pb: 4
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

        {
          showTotalFarmCows
            ?
            <Grid item xs={12}>
              <Grid item xs={12} sm={12} lg={9}>
                <Block2
                  totalFarmCows={totalFarmCows}
                />
              </Grid>
            </Grid>
            :
            <></>
        }


        {/* <Grid item md={5} xs={12}>
          <Block3 />
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
        <Grid item md={5} xs={12}>
          <Block8 />
        </Grid>
        <Grid item md={7} xs={12}>
          <Block9 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block10 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block11 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block12 />
        </Grid>
        <Grid item md={6} xs={12}>
          <Block13 />
        </Grid> */}
      </Grid>
    </>
  );
}


export default HomeContent;