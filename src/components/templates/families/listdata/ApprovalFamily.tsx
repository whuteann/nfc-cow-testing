import { IconButton, TableBody, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { IFamilyCoordinator } from '@/models/Family';
import RuleIcon from '@mui/icons-material/Rule';

interface familyProps {
  family: IFamilyCoordinator,
}

const ApprovalFamily = ({
  family, 
}: familyProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableBody>
      <TableRow
        hover
        key={family._id.toString()}
        selected={true}
      >
        <TableCell>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.secondaryId}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.townVillage.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {family.nationalID}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography noWrap>
            <Tooltip title={t('Review')} arrow>
              <IconButton onClick={() => router.push(`/dashboard/families/approvals/${family._id}`)} color="primary">
                <RuleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </TableCell>
      </TableRow>
      </TableBody>
  )
}

export default ApprovalFamily