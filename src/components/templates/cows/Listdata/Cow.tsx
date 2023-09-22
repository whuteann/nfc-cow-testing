import { TableCell, TableRow, Typography,Tooltip, Box, IconButton } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import HistoryIcon from '@mui/icons-material/History';
import { Prisma } from '@prisma/client';


interface cowProps {
  cow: Prisma.CowCreateInput,
  deleteFunc: (cow: any) => void
}

const Cow = ({
  cow,
  deleteFunc
}: cowProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={cow.id}
      selected={true}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${cow.secondaryId}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {cow.nfcId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {cow.family ? (cow.family as Prisma.FamilyCreateInput).name : "-"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {(cow.farm ? (cow.farm as Prisma.FarmCreateInput).name : "-")}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {cow.gender}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {cow.weight}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {cow.status}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {cow.cowPrice}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={t('View')} arrow>
            <IconButton onClick={() => router.push(`/dashboard/cows/${cow?.id}/edit`)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        
          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/cows/${cow?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default Cow