import { ASSIGN_FAMILY_COW_DISPERSALS, REVIEW_FAMILY_COW_DISPERSALS } from '@/permissions/Permissions';
import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import router from 'next/router';
import HistoryIcon from '@mui/icons-material/History';
import RuleIcon from '@mui/icons-material/Rule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useTranslation } from 'next-i18next';
import { Prisma } from '@prisma/client';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface cowDispersalProps {
  cowDispersals: Prisma.CowDispersalCreateInput[],
  type?: 'View' | 'Approval' | 'Completed' | 'Rejected' | 'Assign Cows',
  permissions?: string[]
  deleteFunc?: (id: string) => void
}

const CowDispersals = ({
  cowDispersals,
  type,
  permissions,
}: cowDispersalProps) => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      {
        cowDispersals.map((cowDispersal: Prisma.CowDispersalCreateInput) => {
          return (
            <TableRow
              hover
              key={cowDispersal.id}
              selected={true}
            >
              <TableCell></TableCell>
              <TableCell>
                <Typography noWrap variant="h5">
                  {cowDispersal.secondaryId}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap variant="h5">
                  {cowDispersal.status}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap variant="h5">
                  {(cowDispersal as any)?.family?.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap variant="h5">
                  {(cowDispersal as any).noOfCows}
                </Typography>
              </TableCell>

              {
                type == 'View' &&
                <TableCell align="center">
                  <Typography noWrap>
                    {
                      cowDispersal.status == "Completed"
                        ?
                        <Tooltip title={t('View')} arrow>
                          <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal?.id}`)} color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        :
                        <></>
                    }

                    <Tooltip title='Logs' arrow>
                      <IconButton
                        onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal?.id}/logs/`)}
                        color="primary">
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </TableCell>
              }

              {
                (type == 'Assign Cows') &&
                <TableCell align="center">
                  <Typography noWrap variant="h5">
                    {
                      ((cowDispersal.status == 'Approved' || cowDispersal.status == 'Sub-Completed') && permissions?.includes(ASSIGN_FAMILY_COW_DISPERSALS)) &&
                      <Tooltip title={t('Assign')} arrow>
                        <IconButton onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal.id}/assign`)} color="primary">
                          <AssignmentTurnedInIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }

                    <Tooltip title='Logs' arrow>
                      <IconButton
                        onClick={() => router.push(`/dashboard/cow-dispersals/${cowDispersal?.id}/logs`)}
                        color="primary">
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </TableCell>
              }

              {
                (type == 'Approval' && permissions?.includes(REVIEW_FAMILY_COW_DISPERSALS)) &&
                <TableCell align="center">
                  <Typography noWrap>
                    <Tooltip title='Review' arrow>
                      <IconButton
                        onClick={() => router.push(`/dashboard/cow-dispersals/approvals/${cowDispersal?.id}`)}
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
                      {cowDispersal?.rejectedReason}
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
        })
      }
    </>
  )
}

export default CowDispersals

