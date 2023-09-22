import {
  Box,
  Grid,
  useTheme
} from '@mui/material';
import { ThreeCircles } from 'react-loader-spinner';

const Loading = () => {
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ my: 3 }}
    >
      <Grid item xs={3}>
        <ThreeCircles
          height="70"
          width="70"
          color={theme.palette.primary.main}
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="three-circles-rotating"
          outerCircleColor=""
          innerCircleColor=""
          middleCircleColor=""
        />
      </Grid>
    </Grid>
  )
}

export default Loading;