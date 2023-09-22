import { TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { IFamilyTransferRequest } from '@/models/Family_Transfer_Requests';

interface familyTransferProps {
  familyTransfer: IFamilyTransferRequest,
}

const RejectedFamilyTransfer = ({
  familyTransfer, 
}: familyTransferProps) => {
  return (
    <TableBody>
      <TableRow
        hover
        key={familyTransfer._id.toString()}
        selected={true}
      >
        <TableCell>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.secondaryId}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.family1.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.family2.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.rejectedReason}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

export default RejectedFamilyTransfer