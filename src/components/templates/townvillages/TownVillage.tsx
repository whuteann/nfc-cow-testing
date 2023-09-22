import { IconButton, TableBody, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import HistoryIcon from '@mui/icons-material/History';
import { Prisma } from '@prisma/client';


interface townVillagesProps {
  townVillage: Prisma.TownVillageCreateInput,
  deleteFunc: (townVillage: any) => void
}

const TownVillage = ({
  townVillage, 
  deleteFunc
}: townVillagesProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={townVillage.id}
      selected={true}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${townVillage.secondaryId}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {townVillage.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {townVillage.townVillage}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {(townVillage.district as any)?.name}
        </Typography>
      </TableCell>
      <TableCell >
        <Typography noWrap variant="h5">
          {(townVillage.district as any)?.country?.name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={t('View')} arrow>
            <IconButton onClick={() => router.push(`/dashboard/townvillages/${townVillage.id}/edit/`)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/townvillages/${townVillage?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
            </Tooltip>
          
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => deleteFunc(townVillage!)}
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

export default TownVillage