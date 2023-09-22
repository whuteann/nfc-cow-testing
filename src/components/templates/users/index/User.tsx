import { TableRow, TableCell, Typography, Box, IconButton, Tooltip } from "@mui/material"
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import router from "next/router"
import { IUser } from "@/models/User";
import moment from "moment-timezone"
import HistoryIcon from '@mui/icons-material/History';
import { Prisma } from "@prisma/client";

interface userProps {
  user: Prisma.UserSelect,
  deleteFunc: (user : any) => void
}

const User = ({
  user, 
  deleteFunc
}: userProps) => {
  const joinedString = user.joinedAt

  return (
    <TableRow
      hover
      selected={false}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${user.secondaryId || '-'}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {`${user.firstName} `}{user?.lastName ? `${user.lastName} ` : "" }
        </Typography>
      </TableCell>
      
      <TableCell>
        <Typography
          noWrap
          variant="subtitle1"
          color="text.primary"
        >
          {user.email}
          
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Box
          sx={{
            minWidth: 175
          }}
          display="flex"
          alignItems="center"
        >
          <Typography
            noWrap
            variant="subtitle1"
            color="text.primary"
          >
            {user.role ? user.role : user.farmRole}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>

          <Tooltip title='View' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/users/${user?.id}/edit`)} 
            color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/users/${user?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete' arrow>
            <IconButton
              onClick={() => deleteFunc(user)}
              color="primary"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default User