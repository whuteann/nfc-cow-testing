import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Prisma } from '@prisma/client';

interface requestProps {
  birthRecord: Prisma.BirthRecordCreateInput,
}

const Request = ({
  birthRecord, 
}: requestProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={birthRecord.id}
      selected={true}
    >
      <TableCell>
      <Typography noWrap variant="h5">
          {birthRecord?.secondaryId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
        {(birthRecord?.cow as any).nfcId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {birthRecord?.dateOfBirth.toString().slice(0, 10)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {birthRecord?.aliveCalves}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {birthRecord?.deadCalves}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {birthRecord?.comment}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={t('View')} arrow>
            <IconButton onClick={() => router.push(`/dashboard/farm-birth-records/${birthRecord.id}`)} color="primary">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/farm-birth-records/${birthRecord?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>

        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default Request