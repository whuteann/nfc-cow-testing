import { IconButton, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { ICowFarmSaleRequest } from '@/models/Cow_Farm_Sale_Request';
import HistoryIcon from '@mui/icons-material/History';
import { REVIEW_FARM_COW_SALES } from '@/permissions/Permissions';
import RuleIcon from '@mui/icons-material/Rule';
import { Prisma } from '@prisma/client';

interface requestProps {
  request: Prisma.CowFarmSaleRequestCreateInput,
  type?: 'View' | 'Approval' | 'Completed' | 'Rejected',
  permissions?: string[]
}

const Request = ({
  request, 
  type,
  permissions
}: requestProps) => {

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
        {request.status}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography noWrap variant="h5">
        {(request?.farm as any)?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography noWrap variant="h5">
        {request.quantity}
        </Typography>
      </TableCell>
      
      {
        type == 'View' &&
          <TableCell align="center">
            <Typography noWrap variant="h5">
              <Tooltip title='Logs' arrow>
                <IconButton 
                  onClick={() => router.push(`/dashboard/cow-farm-sale-requests/${request?.id}/logs`)} 
                  color="primary">
                    <HistoryIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          </TableCell>
      }

      {
        (type == 'Approval' && permissions?.includes(REVIEW_FARM_COW_SALES)) && 
          <TableCell align="center">
            <Typography noWrap>
              <Tooltip title='Review' arrow>
                <IconButton 
                  onClick={() => router.push(`/dashboard/cow-farm-sale-requests/approvals/${request?.id}`)} 
                  color="primary">
                    <RuleIcon fontSize="small" />
                  </IconButton>
              </Tooltip>
            </Typography>
          </TableCell>
      }

      {
        type == 'Rejected' &&
          <>
            <TableCell align="center">
              <Typography noWrap variant="h5">
                {request?.rejectedReason}
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography noWrap variant="h5">
                -
              </Typography>
            </TableCell>
          </>
      }

    </TableRow>
  )
}

export default Request