import { IconButton, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { ICowPurchaseRequest } from '@/models/Cow_Purchase_Request';
import HistoryIcon from '@mui/icons-material/History';
import RuleIcon from '@mui/icons-material/Rule';

interface requestProps {
  request: ICowPurchaseRequest,  
  type?: 'View' | 'Approval' | 'Rejected'
}

const Request = ({
  request, 
  type = 'View',
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
        {request.farm.name}
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
          {request.reasonForPurchase}
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
                onClick={() => router.push(`/dashboard/cow-purchase-requests/${request?._id}/logs`)} 
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
                  onClick={() => router.push(`/dashboard/cow-purchase-requests/approvals/${request?._id}`)} 
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
          <>
            <TableCell align="center">
              <Typography noWrap variant="h5">
                {request.rejectedReason}
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography noWrap variant="h5">
                -
              </Typography>
            </TableCell>
          </>
        :
          <></>
      }
    </TableRow>
  )
}

export default Request