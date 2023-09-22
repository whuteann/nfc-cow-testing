import { TableRow, TableCell, Typography, Box, IconButton, Tooltip } from "@mui/material"
import { ILog } from "@/models/Log";
import FeedIcon from '@mui/icons-material/Feed';
import router from "next/router";
import { dateToHuman } from "@/helpers/app";

interface logProps {
  log: any,
}

const Log = ({
  log, 
}: logProps) => {
  return (
    <TableRow
      hover
      key={log.id.toString()}
      selected={false}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${log.message}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {`${dateToHuman((log as any).createdAt)}`} 
        </Typography>
      </TableCell>
      <TableCell>
        <Tooltip title='View' arrow>
          <IconButton 
          onClick={() => router.push(`/dashboard/logs/${log.id}`)} 
          color="primary">
            <FeedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>

    </TableRow>
  )
}

export default Log