import { Grid, Hidden, Typography } from "@mui/material"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardTwoTone from "@mui/icons-material/ArrowDownwardTwoTone";
import { index } from "@/services/breeding_record/BreedingRecordsServices";

const objectToString = (obj) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  return keys.reduce((acc, key, index) => {
    const value = values[index];
    const str = `${key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}: ${value}`;
    return acc === '' ? str : `${acc}, ${str}`;
  }, '');
}

export const ChangeDetailsObject = ({ oldValue, newValue }: { oldValue: Array<any>, newValue: Array<any> }) => {
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5} className="border border-gray-500 p-3 rounded rounded-xl">
        {
          oldValue.length == 0
            ?
            <Typography sx={{ color: "red" }}>
              -
            </Typography>
            :
            oldValue.map((item, index) => {
              if (typeof item == 'object') {
                return (
                  <Typography key={index} sx={{ color: "red" }}>
                    {`${index + 1}) ${objectToString(item)}`}
                  </Typography>
                )
              } else {
                return (
                  <Typography key={index} sx={{ color: "red" }}>
                    {`${index + 1}) ${item}`}
                  </Typography>
                )
              }
            })
        }
      </Grid>
      <Grid item xs={12} md={1}>
        <Hidden mdDown>
          <ArrowForwardIcon />
        </Hidden>
        <Hidden mdUp>
          <ArrowDownwardTwoTone />
        </Hidden>
      </Grid>
      <Grid item xs={12} md={6} className="border border-gray-500 p-3 rounded rounded-xl">

        {
          newValue.length == 0
            ?
            <Typography sx={{ color: "green" }}>
              -
            </Typography>
            :
            newValue.map((item, index) => {
              if (typeof item == 'object') {
                return (
                  <Typography key={index} sx={{ color: "green" }}>
                    {`${index + 1}) ${objectToString(item)}`}
                  </Typography>
                )
              } else {
                return (
                  <Typography key={index} sx={{ color: "green" }}>
                    {`${index + 1}) ${item}`}
                  </Typography>
                )
              }
            })
        }

      </Grid>
    </Grid>
  )
}