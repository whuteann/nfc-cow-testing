import { IconButton, TableBody, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { IFamilyCoordinator } from '@/models/Family';
import HistoryIcon from '@mui/icons-material/History';


interface coordinatorProps {
  coordinator: IFamilyCoordinator,
  deleteFunc: (coordinator: any, headshot: string,familyPhoto: string, housePhoto: string) => void
}

const MainCoordinator = ({
  coordinator, 
  deleteFunc
}: coordinatorProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableBody>
      <TableRow
        hover
        key={coordinator._id.toString()}
        selected={true}
      >
        <TableCell>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
              {`${coordinator.secondaryId}`}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.townVillage.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.coordinatorType ? coordinator.coordinatorType : "-"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.nationalID}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography noWrap>
            <Tooltip title={t('View')} arrow>
              <IconButton onClick={() => router.push(`/dashboard/coordinators/${coordinator._id}/edit`)} color="primary">
                <LaunchTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title='Logs' arrow>
              <IconButton 
              onClick={() => router.push(`/dashboard/coordinators/${coordinator?._id}/logs/`)} 
              color="primary">
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('Delete')} arrow>
              <IconButton
                onClick={() => deleteFunc(coordinator!,coordinator.headshot!,coordinator.familyPhoto!,coordinator.housePhoto!)}
                color="primary"
              >
                <DeleteTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </TableCell>
      </TableRow>
      </TableBody>
  )
}

export default MainCoordinator