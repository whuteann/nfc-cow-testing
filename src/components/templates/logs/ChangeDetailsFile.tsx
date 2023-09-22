import { Grid, Hidden, Typography } from "@mui/material"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardTwoTone from "@mui/icons-material/ArrowDownwardTwoTone";

export const ChangeDetailsFile = ({ oldValue, newValue }: { oldValue: any, newValue: any }) => {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Typography sx={{ color: "red" }}>
          {
            oldValue
              ?
              oldValue.includes(".pdf")
                ?
                <a className='text-[18px] underline' href={oldValue}>Click to download PDF</a>
                :
                <img className="h-auto w-44 border-solid border-2 border-black" src={oldValue} alt="" />
              :
              "-"
          }
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
        <Typography sx={{ color: "green" }}>
          {
            newValue
              ?
              newValue.includes(".pdf")
                ?
                <a className='text-[18px] underline' href={newValue}>Click to download PDF</a>
                :
                <img className="h-auto w-44 border-solid border-2 border-black" src={newValue} alt="" />
              :
              "-"
          }
        </Typography>
      </Grid>
    </Grid>
  )
}