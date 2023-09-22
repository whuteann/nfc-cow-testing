import { IconButton, TableBody, TableCell, TableRow, Typography,Tooltip } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { ICowDispersal } from '@/models/Cow_Dispersal';
import { LibraryBooksTwoTone } from '@mui/icons-material';
import { REVIEW_FAMILY_COW_DISPERSALS } from '@/permissions/Permissions';
import HistoryIcon from '@mui/icons-material/History';


interface cowDispersalProps {
  cowDispersal: ICowDispersal,
  status: any,
  permissions: string[],
}

const MainCowDispersal = ({
  cowDispersal, 
  status,
  permissions,
}: cowDispersalProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableBody>
      <TableRow
        hover
        key={cowDispersal._id.toString()}
        selected={true}
      >
        <TableCell></TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.farm.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.status}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.family.name}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography noWrap variant="h5">
            {cowDispersal.noOfCows}
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
                      <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal._id}/approval`)} color="primary">
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
                cowDispersal.status === "Approved"
                ?
                <Tooltip title={t('View')} arrow>
                  <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal._id}/assign`)} color="primary">
                    <LibraryBooksTwoTone fontSize="small" />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title={t('View')} arrow>
                  <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal._id}/completed`)} color="primary">
                    <LibraryBooksTwoTone fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
              </>
            }

              <Tooltip title='Logs' arrow>
                <IconButton 
                onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal?._id}/logs/`)} 
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

export default MainCowDispersal