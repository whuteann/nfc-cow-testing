import { TableCell, TableRow, Typography,Tooltip, Box, IconButton } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import HistoryIcon from '@mui/icons-material/History';
import { Prisma } from '@prisma/client';


interface districtProps {
  district: Prisma.DistrictCreateInput,
  deleteFunc: (district: any) => void
}

const District = ({
  district, 
  deleteFunc
}: districtProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={district.id}
      selected={true}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${district.secondaryId}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {district.name}
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
            {(district?.country as any)?.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={t('View')} arrow>
            <IconButton onClick={() => router.push(`/dashboard/districts/${district?.id}/edit`)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        
          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/districts/${district?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => deleteFunc(district!)}
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

export default District