import { REVIEW_FAMILY_FARM_TRANSFER_REQUESTS } from '@/permissions/Permissions';
import { IconButton, TableBody, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import router from 'next/router';
import HistoryIcon from '@mui/icons-material/History';
import RuleIcon from '@mui/icons-material/Rule';
import { useTranslation } from 'next-i18next';
import { IFamilyFarmTransferRequest } from '@/models/Family_Farm_Transfer_Request';

interface familyFarmTransferProps {
  requests: IFamilyFarmTransferRequest[],
  type?: 'View' | 'Approval' | 'Completed' | 'Rejected',
  permissions?: string[]
  deleteFunc?: (id: string) => void
}

const Family_Farm_Transfer_Request = ({
  requests,
  type, 
  permissions,
}: familyFarmTransferProps) => {
  const { t }: { t: any } = useTranslation();
  
  return (
    <>
    {
        requests.map((request: any) => {
          return (
            <TableBody 
              key={request?.id.toString()}
            >
              <TableRow
                hover
                key={request.id.toString()}
                selected={true}
              >
                <TableCell></TableCell>
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
                    {request?.family?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {request?.farm?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap variant="h5">
                    {request.noOfCows}
                  </Typography>
                </TableCell>

                {
                  type == 'View' &&
                    <TableCell align="center">
                      <Typography noWrap variant="h5">
                        {/* {
                          (request.status == 'Approved' && permissions?.includes(ASSIGN_FAMILY_COW_DISPERSALS)) &&
                            <Tooltip title={t('Assign')} arrow>
                              <IconButton onClick={() => router.push(`/dashboard/family-farm-transfer-requests/${request.id}/assign`)} color="primary">
                                <AssignmentTurnedInIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                        } */}

                        <Tooltip title='Logs' arrow>
                          <IconButton 
                            onClick={() => router.push(`/dashboard/family-farm-transfer-requests/${request?.id}/logs`)} 
                            color="primary">
                              <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </TableCell>
                }

                {
                  (type == 'Approval' && permissions?.includes(REVIEW_FAMILY_FARM_TRANSFER_REQUESTS)) && 
                    <TableCell align="center">
                      <Typography noWrap>
                        <Tooltip title='Review' arrow>
                          <IconButton 
                            onClick={() => router.push(`/dashboard/family-farm-transfer-requests/approvals/${request?.id}`)} 
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
            </TableBody>
          )
        })
      } 
    </>
  )
}

export default Family_Farm_Transfer_Request
    
