import { TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { ICowDispersal } from '@/models/Cow_Dispersal';

interface cowDispersalProps {
  cowDispersal: ICowDispersal,
}

const RejectedCowDispersal = ({
  cowDispersal, 
}: cowDispersalProps) => {
  return (
    <TableBody>
      <TableRow
        hover
        key={cowDispersal._id.toString()}
        selected={true}
      >
        <TableCell>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.family.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.farm.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.noOfCows}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.rejectedReason}
          </Typography>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

export default RejectedCowDispersal