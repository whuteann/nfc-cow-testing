import Head from 'next/head';

import Master from '@/layouts/BaseLayout/master';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box
} from '@mui/material';
import { getData as getFarmAndCowCount } from 'pages/api/reports/1';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { generateExcelReport1 } from '@/services/report/ReportServices';
import { getSession } from 'next-auth/react';


function Report1({
  farmAndCowCount
}) {

  // console.log(farmAndCowCount);

  const router = useRouter();
  const [totalFarmCows, setTotalFarmCows] = useState(0)
  const [totalDispersalCows, setTotalDispersalCows] = useState(0)

  useEffect(() => {
    if (router.isReady) {
      let totalFarmCowsCounter = 0
      let totalDispersalCowsCounter = 0

      farmAndCowCount?.farms?.map((farmCowCount) => {
        totalFarmCowsCounter += farmCowCount.count || 0
      })
      setTotalFarmCows(totalFarmCowsCounter)

      farmAndCowCount?.dispersals?.coordinators?.map((farmCowCount) => {
        totalDispersalCowsCounter += farmCowCount.count || 0
      })

      farmAndCowCount?.dispersals?.villages?.map((farmCowCount) => {
        totalDispersalCowsCounter += farmCowCount.count || 0
      })
      setTotalDispersalCows(totalDispersalCowsCounter)
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Report #1</title>
      </Head>

      <Grid
        sx={{ px: 4, pt: 5 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >

        <Grid item xs={12}>
          {/* table */}
          <Grid container justifyContent="space-between" alignItems="center" marginBottom={3}>
            <Grid item>

            </Grid>
            <Grid item>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={()=>{
                  generateExcelReport1();
                }}
                variant="contained"
              >
                Generate Excel
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody sx={{ width: "100%" }}>
                <TableRow>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      sx={{ height: 50, display: "flex", flexDirection: "row" }}
                    >
                      <Typography sx={{ width: "70%" }}>FARMS</Typography>
                      <Typography>TOTAL COWS: {totalFarmCows}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                      <Table sx={{ width: "100%" }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Farm Name</TableCell>
                            <TableCell align="right">Number of Cows</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {farmAndCowCount?.farms?.map((farmCowCount) => (
                            <TableRow
                              key={farmCowCount?.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {farmCowCount?.name}
                              </TableCell>
                              <TableCell align="right">{farmCowCount?.count || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          {/* table */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">

              <TableBody sx={{ width: "100%" }}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ height: 50, display: "flex", flexDirection: "row" }}

                  >
                    <Typography sx={{ width: "70%" }}>DISPERSALS</Typography>
                    <Typography>TOTAL COWS: {totalDispersalCows}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>

                    <Accordion className="border border-gray-700">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ height: 50, display: "flex", flexDirection: "row" }}
                      >
                        <Typography sx={{ width: "70%" }}>COORDINATOR</Typography>

                      </AccordionSummary>
                      <AccordionDetails>

                        <Table sx={{ width: "100%" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Coordinator Name</TableCell>
                              <TableCell align="right">Number of Cows</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {farmAndCowCount?.dispersals?.coordinators?.map((farmCowCount) => (
                              <TableRow
                                key={farmCowCount?.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {farmCowCount?.name}
                                </TableCell>
                                <TableCell align="right">{farmCowCount?.count || 0}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                      </AccordionDetails>
                    </Accordion>


                    <Accordion className="border border-gray-700">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ height: 50, display: "flex", flexDirection: "row" }}
                      >
                        <Typography sx={{ width: "70%" }}>VILLAGE</Typography>
                      </AccordionSummary>
                      <AccordionDetails>

                        <Table sx={{ width: "100%" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Village Name</TableCell>
                              <TableCell align="right">Number of Cows</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {farmAndCowCount?.dispersals?.villages?.map((farmCowCount) => (
                              <TableRow
                                key={farmCowCount?.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {farmCowCount?.name}
                                </TableCell>
                                <TableCell align="right">{farmCowCount?.count || 0}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                      </AccordionDetails>
                    </Accordion>
                  </AccordionDetails>
                </Accordion>
              </TableBody>


            </Table>
          </TableContainer>
        </Grid>

      </Grid>

    </>
  );
}

Report1.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default Report1;

export async function getServerSideProps(context: any) {

  const session = await getSession(context);

  const farmAndCowCount = await getFarmAndCowCount({
    req: context.req,
    userId: (session as any).currentUser?._id,
    deletedAt: true
  })

  return {
    props: {
      farmAndCowCount: JSON.parse(JSON.stringify(farmAndCowCount))
    }
  }
}