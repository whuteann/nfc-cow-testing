import { IconButton, TableBody, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import Family, { IFamilyCoordinator } from '@/models/Family';
import HistoryIcon from '@mui/icons-material/History';


interface familyProps {
  family: IFamilyCoordinator,
  deleteFunc: (family: any, headshot:string, familyPhoto:string, housePhoto:string) => void
}

const MainFamily = ({
  family, 
  deleteFunc
}: familyProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableBody>
      <TableRow
        hover
        key={family._id.toString()}
        selected={true}
      >
        <TableCell>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {`${family.secondaryId}`}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.townVillage.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.nationalID}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography noWrap>
            <Tooltip title={t('View')} arrow>
              <IconButton onClick={() => router.push(`/dashboard/families/${family._id}/edit`)} color="primary">
                <LaunchTwoToneIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title='Logs' arrow>
              <IconButton 
              onClick={() => router.push(`/dashboard/families/${family?._id}/logs/`)} 
              color="primary">
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('Delete')} arrow>
              <IconButton
                onClick={() => deleteFunc(family!,family.headshot!,family.familyPhoto!,family.housePhoto!)}
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

export default MainFamily