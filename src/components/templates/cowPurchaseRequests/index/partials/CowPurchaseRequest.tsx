import { Prisma } from '@prisma/client';
import { TableBody, TableCell, TableRow, Typography, Tooltip, IconButton } from '@mui/material'
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import React from 'react';
import HistoryIcon from '@mui/icons-material/History';
import RuleIcon from '@mui/icons-material/Rule';
import { shortenText } from '@/helpers/app';

interface cowPurchaseRequestProps {
  request: Prisma.CowPurchaseRequestCreateInput,
  type?: 'View' | 'Approval' | 'Rejected'
}

const CowPurchaseRequest = ({
  request,
  type = 'View'
}: cowPurchaseRequestProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={request.secondaryId}
      selected={true}
    >
      <TableCell>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {request.secondaryId}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {(request?.farm as any)?.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {request.status}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {request.noOfCows}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {request.pricePerCow}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {shortenText(request.reasonForPurchase, 35)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {request.calculatedPurchasePrice}
        </Typography>
      </TableCell>
      {
        type == 'View'
          ?
          <TableCell align="center">
            <Typography noWrap>
              <Tooltip title='Logs' arrow>
                <IconButton
                  onClick={() => router.push(`/dashboard/cow-purchase-requests/${request?.id}/logs`)}
                  color="primary">
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          </TableCell>
          :
          <></>
      }

      {
        type == 'Approval' &&
        <TableCell align="center">
          <Typography noWrap>
            <Tooltip title='Review' arrow>
              <IconButton
                onClick={() => router.push(`/dashboard/cow-purchase-requests/approvals/${request?.id}`)}
                color="primary">
                <RuleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </TableCell>
      }

      {
        type == 'Rejected'
          ?

          <TableCell>
            <Typography noWrap variant="h5">
              {shortenText(request.rejectedReason, 15)}
            </Typography>
          </TableCell>
          :
          <></>
      }
    </TableRow>
  )
}

export default CowPurchaseRequest;