import { IconButton, TableBody, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { ICowDispersal } from '@/models/Cow_Dispersal';
import { LibraryBooksTwoTone } from '@mui/icons-material';
import { REVIEW_FAMILY_COW_DISPERSALS } from '@/permissions/Permissions';
import HistoryIcon from '@mui/icons-material/History';


interface familyTransferProps {
  familyTransfer: ICowDispersal,
  status: any,
  permissions: string[],
}

const MainFamilyTransfer = ({
  familyTransfer, 
  status,
  permissions,
}: familyTransferProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableBody>
      <TableRow
        hover
        key={familyTransfer._id.toString()}
        selected={true}
      >
        <TableCell></TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.farm.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.family.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {familyTransfer.noOfCows}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography noWrap>
          {
            status === "Pending" 
            ?
              <>
              {
                permissions?.includes(REVIEW_FAMILY_COW_DISPERSALS)
                  ?
                    <Tooltip title={t('View')} arrow>
                      <IconButton onClick={() => router.push(`/dashboard/family-transfer-requests/${familyTransfer._id}/approval`)} color="primary">
                        <LaunchTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  :
                    <>-</>
                }
              </>
            :
              <>
              {
                familyTransfer.status === "Approved"
                ?
                <Tooltip title={t('View')} arrow>
                  <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${familyTransfer._id}/assign`)} color="primary">
                    <LibraryBooksTwoTone fontSize="small" />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title={t('View')} arrow>
                  <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${familyTransfer._id}/completed`)} color="primary">
                    <LibraryBooksTwoTone fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
              </>
            }

              <Tooltip title='Logs' arrow>
                <IconButton 
                onClick={() => router.push(`/dashboard/family-transfer-requests/${familyTransfer?._id}/logs/`)} 
                color="primary">
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </Tooltip>

          </Typography>
        </TableCell>
      </TableRow>
      </TableBody>
  )
}

export default MainFamilyTransfer