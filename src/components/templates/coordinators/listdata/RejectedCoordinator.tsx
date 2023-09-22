import { TableBody, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { IFamilyCoordinator } from '@/models/Family';

interface coordinatorProps {
  coordinator: IFamilyCoordinator,
}

const RejectedCoordinator = ({
  coordinator, 
}: coordinatorProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableBody>
      <TableRow
        hover
        key={coordinator._id.toString()}
        selected={true}
      >
        <TableCell>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.secondaryId}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.townVillage.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.coordinatorType ? coordinator.coordinatorType : "-"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.nationalID}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {coordinator.rejectedReason}
          </Typography>
        </TableCell>
      </TableRow>
      </TableBody>
  )
}

export default RejectedCoordinator