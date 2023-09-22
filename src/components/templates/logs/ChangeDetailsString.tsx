import { Grid, Hidden, Typography } from "@mui/material"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardTwoTone from "@mui/icons-material/ArrowDownwardTwoTone";

export const ChangeDetailsString = ({ oldValue, newValue }: { oldValue: any, newValue: any }) => {
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5} >
        <Typography sx={{ color: "red" }} className="border border-gray-500 p-3 rounded rounded-xl">
          {oldValue ? oldValue : "-"}
        </Typography>
      </Grid>
      <Grid item xs={12} md={1}>
        <Hidden mdDown>
          <ArrowForwardIcon />
        </Hidden>
        <Hidden mdUp>
          <ArrowDownwardTwoTone />
        </Hidden>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography sx={{ color: "green" }} className="border border-gray-500 p-3 rounded rounded-xl">
          {newValue ? newValue : "-"}
        </Typography>
      </Grid>
    </Grid>
  )
}