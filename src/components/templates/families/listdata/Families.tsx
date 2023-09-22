import {
  TableCell,
  TableRow,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import router from 'next/router';
import { useTranslation } from 'next-i18next';
import PakistanFamilyPDF from '../PDF/PakistanFamilyPDF';
import BangladeshFamilyPDF from '../PDF/BangladeshFamilyPDF';
import { generatePDF } from '@/helpers/PDFHelper';
import { Prisma } from '@prisma/client';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { REVIEW_FAMILIES_COORDINATORS } from '@/permissions/Permissions';
import RuleIcon from '@mui/icons-material/Rule';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import HistoryIcon from '@mui/icons-material/History';
import { family } from '@/models/Cow';
import Link from 'next/link';
import ReactPDF from '@react-pdf/renderer';
import { PDFDownloadLink, PDFViewer, pdf } from '@react-pdf/renderer';
import * as FileSaver from "file-saver";

interface familyProps {
  families: Prisma.FamilyCreateInput[],
  type: 'View' | 'Approval' | 'Rejected' | 'Replacement',
  permissions?: string[],
  // deleteFunc: (family: any, headshot: string, familyPhoto: string, housePhoto: string) => void
}

const createPDF = (family: Prisma.FamilyCreateInput) =>{
  if((family.townVillage as any)?.district?.country?.name == "Pakistan"){
    generatePdfDocument("Pakistan", family, `${family.secondaryId}_card`);
  }else{
    generatePdfDocument("Bangladesh", family, `${family.secondaryId}_card`);
  };
}

const generatePdfDocument = async (countryName, family, fileName) => {
  let blob: any;
  
  switch (countryName){
    case "Pakistan":
      blob = await pdf(
        <PakistanFamilyPDF family={family}/>
      ).toBlob();
      break;

    case "Bangladesh":
      blob = await pdf(
        <BangladeshFamilyPDF family={family}/>
      ).toBlob();
      break;

    default:
      break;
  }
  FileSaver.saveAs(blob, fileName);
};


const Families = ({
  families,
  type,
  permissions = [],
}: familyProps) => {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      {
        families?.map((family: Prisma.FamilyCreateInput) => {
          return (
            <TableRow
              hover
              key={family.id}
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
                  {(family.townVillage as any)?.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap variant="h5">
                  {family.nationalID}
                </Typography>
              </TableCell>

              {
                type == 'View' &&
                  <TableCell align="center">
                    <Typography noWrap variant="h5">

                      <Tooltip title={t('Create PDF')} arrow>
                        <IconButton onClick={() =>{
                          createPDF(family);
                        }} color="primary">
                            <ArrowCircleDownIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={t('View')} arrow>
                        <IconButton onClick={() => router.push(`/dashboard/families/${family.id}/edit`)} color="primary">
                          <LaunchTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                    <Tooltip title='Logs' arrow>
                      <IconButton
                        onClick={() => router.push(`/dashboard/families/${family?.id}/logs`)}
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
                        onClick={() => router.push(`/dashboard/families/approvals/${family?.id}`)}
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
                      {family?.rejectedReason}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title={t('View')} arrow>
                      <IconButton onClick={() => router.push(`/dashboard/families/${family.id}/edit`)} color="primary">
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
                      {family.nfcID}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography noWrap variant="h5">
                      <Tooltip title={t('View')} arrow>
                        <IconButton onClick={() => router.push(`/dashboard/families/${family.id}/replacement`)} color="primary">
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

export default Families

