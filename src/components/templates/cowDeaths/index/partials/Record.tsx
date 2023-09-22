import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ICowDeath } from '@/models/Cow_Death';
import RuleIcon from '@mui/icons-material/Rule';
import { shortenText } from '@/helpers/app';
import { Prisma } from '@prisma/client';
import HistoryIcon from '@mui/icons-material/History';
import { farm } from '@/models/Cow';

interface requestProps {
  record: Prisma.DeathRecordCreateInput,
  type?: 'View' | 'Approval' | 'Rejected',
}

const Request = ({
  record,
  type = 'View',
}: requestProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={record.id.toString()}
      selected={true}
    >
      <TableCell>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {record?.secondaryId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {record?.type}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {(record.cow as any)?.nfcId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {record?.dateOfDeath?.toString()?.slice(0, 10)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {shortenText(record?.deathCause, 60)}
        </Typography>
      </TableCell>
      <TableCell align="left">

        {
          type == "View"
            ?
            <Typography noWrap>
              <Tooltip title={t('View')} arrow>
                <IconButton onClick={() => router.push(`/dashboard/cow-deaths/${record?.id}/edit`)} color="primary">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title='Logs' arrow>
                <IconButton
                  onClick={() => router.push(`/dashboard/cow-deaths/${record?.id}/logs/`)}
                  color="primary">
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            :
            <></>
        }

        {
          type == "Approval"
            ?
            <Typography noWrap>
              <Tooltip title={t('Review')} arrow>
                <IconButton onClick={() => router.push(`/dashboard/cow-deaths/approvals/${record?.id}`)} color="primary">
                  <RuleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            :
            <></>
        }

        {
          type == "Rejected"
            ?
            <Typography noWrap>
              <Tooltip title={t('View')} arrow>
                <IconButton onClick={() => router.push(`/dashboard/cow-deaths/rejected/${record?.id}`)} color="primary">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            :
            <></>
        }


      </TableCell>
    </TableRow>
  )
}

export default Request