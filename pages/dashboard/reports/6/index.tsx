import Head from 'next/head';

import Master from '@/layouts/BaseLayout/master';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Card,
  Grid,
  Button,
} from '@mui/material';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import { useEffect, useState } from 'react';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import { getData as getFamilies } from '../../../api/families';
import { generateExcelReport6, getDataForReport6 } from '@/services/report/ReportServices';

function Report6({
  data,
  families
}) {

  const [family, setFamily] = useState(undefined);
  const [fromDate, setFromDate] = useState<any>(new Date());
  const [toDate, setToDate] = useState<any>(new Date());
  const [details, setDetails] = useState<any>([]);

  useEffect(() => {
    const query = {
      familyIds: family ? [family.id] : families.map(family => family.id),
      fromDate: fromDate,
      toDate: toDate
    }

    if (family) {

      getDataForReport6(query, (details) => {
        console.log(details, "one");
        setDetails(details);
      }, (err) => {

      });
    } else {
      getDataForReport6(query, (details) => {
        console.log(details, "many");
        setDetails(details);
      }, (err) => {

      });
    }
  }, [family, fromDate, toDate])

  return (
    <>
      <Head>
        <title>Report #6</title>
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
                  generateExcelReport6(
                    {
                      familyIds: family ? [family.id] : families.map(family => family.id),
                      fromDate: fromDate,
                      toDate: toDate
                    }
                  );
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

              <DropdownInputField
                items={families}
                label={"Family Name"}
                onChangeValue={(value) => {
                  setFamily(value);
                }}
                value={family}
              />
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Date Sold</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Price</TableCell>
                  </TableRow>
                  {
                    details.map(item => {
                      return (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.dateSold}</TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="center">{item.price}</TableCell>
                        </TableRow>
                      )
                    })
                  }

                </TableHead>
                <TableBody>

                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

Report6.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default Report6;

export async function getServerSideProps(context: any) {

  const families = await getFamilies({
    req: context.req,
    filterCountry: false,
    status: "Approved"
  });

  return {
    props: {
      families: JSON.parse(JSON.stringify(families))
    }
  }
}