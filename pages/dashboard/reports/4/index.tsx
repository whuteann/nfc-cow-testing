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
import { getData } from '../../../api/reports/4'
import { getSession } from 'next-auth/react';
import { index } from '@/services/breeding_record/BreedingRecordsServices';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { toDate } from 'date-fns';
import { useEffect, useState } from 'react';
import { generateExcelReport4, getDataForReport4 } from '@/services/report/ReportServices';
import moment from 'moment-timezone';

function Report4({
  // data,
  userId
}) {

  const [fromDate, setFromDate] = useState<any>(new Date());
  const [toDate, setToDate] = useState<any>(new Date());
  const [display, setDisplay] = useState<Array<any>>();

  useEffect(() => {
    const query = {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate
    }
    getDataForReport4(query, (result) => {
      setDisplay(result);
    }, (err) => {
      console.error(err);
    });
  }, [fromDate, toDate])

  console.log(display);

  return (
    <>
      <Head>
        <title>Report #4</title>
      </Head>


      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12} sx={{ mt: 5 }}>
          <Grid container justifyContent="space-between" alignItems="center" marginBottom={3} marginTop={3}>
            <Grid item>

            </Grid>
            <Grid item>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => {
                  generateExcelReport4({
                    userId: userId,
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
                onChangeDate={(value) => { setFromDate(value) }}
              />

              <Datepicker
                value={toDate}
                label={"To"}
                views={['month', 'year']}
                inputFormat={"MMM-yyyy"}
                onChangeDate={(value) => { setToDate(value) }}
              />
            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Total Number of Cows Sold</TableCell>
                    <TableCell align="right">Sale Amount</TableCell>
                    <TableCell align="right">CCI Profit</TableCell>
                    <TableCell align="right">Total Death</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    display
                      ?
                      display.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.totalNumberCowsSold}</TableCell>
                            <TableCell align="right">{item.salesAmount}</TableCell>
                            <TableCell align="right">{item.cciProfit}</TableCell>
                            <TableCell align="right">{item.totalDeath}</TableCell>
                          </TableRow>
                        )
                      })
                      :
                      <></>
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

Report4.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default Report4;

export async function getServerSideProps(context: any) {

  const session: any = await getSession(context);

  // const data = await getData({
  //   userId: (session.currentUser as any)._id
  //   // userId: "63e603c1532fe6674148363e"
  // })

  // console.log(data);

  return {
    props: {
      // data: JSON.parse(JSON.stringify(data)),
      userId: (session.currentUser as any)._id || null
    }
  }
}