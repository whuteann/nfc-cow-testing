import Head from 'next/head';

import Master from '@/layouts/BaseLayout/master';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { getCounts, getActiveDispersals, generateExcelReport3 } from '@/services/report/ReportServices';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import moment from 'moment-timezone';

function Report3({
}) {
  const [fromDate, setFromDate] = useState<any>(new Date());
  const [toDate, setToDate] = useState<any>(new Date());

  const [results, setResults] = useState<any>([]);
  const [counts, setCounts] = useState<any>({});
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(()=> {
    onDateChange()
  }, [fromDate, toDate])

  const onDateChange = async () => {
    await getActiveDispersals({
      fromDate: moment(fromDate).startOf('month').toISOString(),
      toDate: moment(toDate).endOf('month').toISOString(),
    }, (result: any) => {
      setResults(result)
      setShowDetails(true)
      // getDetails(value.id)

    }, (error: any) => {
      console.log('err', error);  
    })

  }

  const getDetails = async(id: String) => {
    await getCounts(id, (result: any) => {
      setCounts(result)
    }, (error) => {
      console.log('err', error);
    }
    )
  }

  console.log('results', results)

  return (
    <>
      <Head>
        <title>Report #3</title>
      </Head>

      
      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center" marginBottom={3} marginTop={3}>
              <Grid item>

              </Grid>
              <Grid item>
                <Button
                  sx={{
                    mt: { xs: 2, sm: 0 }
                  }}
                  onClick={() => {
                    generateExcelReport3({
                      fromDate: moment(fromDate).startOf('month').toISOString(),
                      toDate: moment(toDate).endOf('month').toISOString(),
                    });
                  }}
                  variant="contained"
                >
                  Generate Excel
                </Button>
              </Grid>
            </Grid>
          <Card>
            <Box p={2}>
              <Datepicker
                value={fromDate}
                label={"From"}
                views={['month', 'year']}
                inputFormat={"MMM-yyyy"}
                onChangeDate={(value)=>{setFromDate(value)}}
              />

              <Datepicker
                value={toDate}
                label={"To"}
                views={['month', 'year']}
                inputFormat={"MMM-yyyy"}
                onChangeDate={(value)=>{setToDate(value)}}
              />
            </Box>

            {
            showDetails
          ?
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Coordinator Name</TableCell>
                  <TableCell align="right">Number of Family with active dispersal</TableCell>
                  <TableCell align="right">Number of Visits for family with active dispersal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  results?.map((coordFam) => {
                    return(
                      <>
                        <TableRow key={ coordFam.name } sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                          <TableCell component="th" scope="row">
                            { coordFam?.name }
                          </TableCell>
                          <TableCell align="right">{ coordFam?.families?.length }</TableCell>
                          <TableCell align="right">{ coordFam?.count }</TableCell>
                        </TableRow>

                        <TableContainer component={Card}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Family Name</TableCell>
                                <TableCell align="right">Visits for last month</TableCell>
                                <TableCell align="right">Visits for current month</TableCell>
                              </TableRow>
                            </TableHead>

                            {
                              coordFam.families.map((familyVisit) => {
                                return(
                                  <>
                                    <TableRow key={ familyVisit.family.id } sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                      <TableCell component="th" scope="row">
                                        { familyVisit.family.name }
                                      </TableCell>
                                      <TableCell align="right">{ familyVisit.visitsLastMonth }</TableCell>
                                      <TableCell align="right">{ familyVisit.visitsCurrentMonth }</TableCell>
                                    </TableRow>
                                  </>
                                )
                              })
                            }

                          </Table>
                        </TableContainer>
                      </>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          :
          <></>
        }
          </Card>

        </Grid>
      </Grid>
    </>
  );
}

Report3.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default Report3;

// export async function getServerSideProps(context: any) {
//   const coordinators = await getCoordinators({
//     req: context.req,
//     type: 'Coordinator',
//     filterCountry: true,
//     status: 'Approved'
//   })
  
//   return{
//     props:{
//       coordinators: JSON.parse(JSON.stringify(coordinators))
//     }
//   }
// }