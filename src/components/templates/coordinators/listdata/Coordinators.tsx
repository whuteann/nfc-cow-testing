import { IFamilyCoordinator } from '@/models/Family'
import { REVIEW_FAMILIES_COORDINATORS } from '@/permissions/Permissions';
import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import router from 'next/router';
import HistoryIcon from '@mui/icons-material/History';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import RuleIcon from '@mui/icons-material/Rule';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import { useTranslation } from 'next-i18next';
import { generatePDF } from '@/helpers/PDFHelper';
import PakistanCoordinatorPDF from '../PDF/PakistanCoordinatorPDF';
import BangladeshCoordinatorPDF from '../PDF/BangladeshCoordinatorPDF';
import { Prisma } from '@prisma/client';
import { pdf } from '@react-pdf/renderer';
import * as FileSaver from "file-saver";

interface coordinatorProps {
  coordinators: Prisma.FamilyCreateInput[],
  type: 'View' | 'Approval' | 'Rejected' | 'Replacement',
  permissions?: string[],
  // deleteFunc: (family: any, headshot: string, familyPhoto: string, housePhoto: string) => void
}

const createPDF = (coordinator: Prisma.FamilyCreateInput) =>{
  if((coordinator.townVillage as any)?.district?.country?.name == "Pakistan"){
    generatePdfDocument("Pakistan", coordinator, `${coordinator.secondaryId}_card`);
  }else{
    generatePdfDocument("Bangladesh", coordinator, `${coordinator.secondaryId}_card`);
  } 
}

const generatePdfDocument = async (countryName, coordinator, fileName) => {
  let blob: any;
  
  switch (countryName){
    case "Pakistan":
      blob = await pdf(
        <PakistanCoordinatorPDF coordinator={coordinator}/>
      ).toBlob();
      break;

    case "Bangladesh":
      blob = await pdf(
        <BangladeshCoordinatorPDF coordinator={coordinator}/>
      ).toBlob();
      break;

    default:
      break;
  }
  FileSaver.saveAs(blob, fileName);
};

const Coordinators = ({
  coordinators,
  type,
  permissions = [],
}: coordinatorProps) => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      {
        coordinators.map((coordinator: Prisma.FamilyCreateInput) => {
          return (
            <TableRow
              hover
              key={coordinator.id}
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
                  {(coordinator.townVillage as any)?.name}
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

              {
                type == 'View' &&
                  <TableCell align="center">
                    <Typography noWrap variant="h5">

                      <Tooltip title={t('Create PDF')} arrow>
                        <IconButton onClick={() =>{
                          createPDF(coordinator);
                        }} color="primary">
                          <ArrowCircleDownIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={t('View')} arrow>
                        <IconButton onClick={() => router.push(`/dashboard/coordinators/${coordinator.id}/edit`)} color="primary">
                          <LaunchTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                    <Tooltip title='Logs' arrow>
                      <IconButton
                        onClick={() => router.push(`/dashboard/coordinators/${coordinator?.id}/logs`)}
                        color="primary">
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </TableCell>
              }

              {
                (type == 'Approval' && permissions?.includes(REVIEW_FAMILIES_COORDINATORS)) &&
                <TableCell align="center">
                  <Typography noWrap variant="h5">
                    <Tooltip title='Review' arrow>
                      <IconButton
                        onClick={() => router.push(`/dashboard/coordinators/approvals/${coordinator?.id}`)}
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
                      {coordinator?.rejectedReason}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title={t('View')} arrow>
                      <IconButton onClick={() => router.push(`/dashboard/coordinators/${coordinator.id}/edit`)} color="primary">
                        <LaunchTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </>
              }

              {
                type == 'Replacement' &&
                <>
                  <TableCell>
                    <Typography noWrap variant="h5">
                      {coordinator.nfcID}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      <Tooltip title={t('View')} arrow>
                        <IconButton onClick={() => router.push(`/dashboard/coordinators/${coordinator.id}/replacement`)} color="primary">
                          <LaunchTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </TableCell>
                </>
              }
            </TableRow>
          );
        })
      }
    </>
  )
}

export default Coordinators

