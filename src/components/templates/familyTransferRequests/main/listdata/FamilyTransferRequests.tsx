import { ICowDispersal } from '@/models/Cow_Dispersal';
import { ASSIGN_FAMILY_COW_DISPERSALS, REVIEW_FAMILY_COW_DISPERSALS } from '@/permissions/Permissions';
import { LibraryBooksTwoTone } from '@mui/icons-material';
import { IconButton, TableBody, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import router from 'next/router';
import HistoryIcon from '@mui/icons-material/History';
import RuleIcon from '@mui/icons-material/Rule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useTranslation } from 'next-i18next';
import { IFamilyTransferRequest } from '@/models/Family_Transfer_Requests';

interface familyTransferProps {
  familyTransferRequests: IFamilyTransferRequest[],
  type?: 'View' | 'Approval' | 'Completed' | 'Rejected',
  permissions?: string[]
  deleteFunc?: (id: string) => void
}

const FamilyTransferRequests = ({
  familyTransferRequests,
  type, 
  permissions,
}: familyTransferProps) => {
  const { t }: { t: any } = useTranslation();
  
  return (
    <>
    {
        familyTransferRequests.map((familyTransferRequest: any) => {
          return (
            <TableBody 
              key={familyTransferRequest?.id.toString()}
            >
              <TableRow
                hover
                key={familyTransferRequest.id.toString()}
                selected={true}
              >
                <TableCell></TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {familyTransferRequest.secondaryId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {familyTransferRequest.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {familyTransferRequest?.family1?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {familyTransferRequest?.family2?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {familyTransferRequest.noOfCows}
                  </Typography>
                </TableCell>

                {
                  type == 'View' &&
                    <TableCell align="center">
                      <Typography noWrap variant="h5">
                        {/* {
                          (familyTransferRequest.status == 'Approved' && permissions?.includes(ASSIGN_FAMILY_COW_DISPERSALS)) &&
                            <Tooltip title={t('Assign')} arrow>
                              <IconButton onClick={() => router.push(`/dashboard/family-transfer-requests/${familyTransferRequest.id}/assign`)} color="primary">
                                <AssignmentTurnedInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                        } */}

                        <Tooltip title='Logs' arrow>
                          <IconButton 
                            onClick={() => router.push(`/dashboard/family-transfer-requests/${familyTransferRequest?.id}/logs`)} 
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
                            onClick={() => router.push(`/dashboard/family-transfer-requests/approvals/${familyTransferRequest?.id}`)} 
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
                          {familyTransferRequest?.rejectedReason}
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
            </TableBody>
          )
        })
      } 
    </>
  )
}

export default FamilyTransferRequests
    
