import { TableBody, TableCell, TableRow, Typography,Tooltip, IconButton, Box } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { IFarm } from '@/models/Farm';
import HistoryIcon from '@mui/icons-material/History';
import { Prisma } from '@prisma/client';
import { farm } from '@/models/Cow';


interface farmProps {
  farm: Prisma.FarmCreateInput,
  deleteFunc: (farm: any) => void
}

const Farm = ({
  farm,
  deleteFunc
}: farmProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={farm.id}
      selected={true}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${farm.secondaryId}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {farm.name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={t('View')} arrow>
            <IconButton onClick={() => router.push(`/dashboard/farms/${farm.id}/edit`)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/farms/${farm?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => deleteFunc(farm)}
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

export default Farm