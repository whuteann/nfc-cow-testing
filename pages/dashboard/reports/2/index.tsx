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
import { getData as getCoordinators } from 'pages/api/families';
import { useState } from 'react';
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import { generateExcelReport1, generateExcelReport2, getCounts } from '@/services/report/ReportServices';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';

function Report2({
  coordinators
}) {
  const [coordinator, setCoordinator] = useState<any>('');
  const [counts, setCounts] = useState<any>({});
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const onDropdownChange = (value) => {
    setCoordinator(value)
    setShowDetails(true)

    getDetails(value.id)
  }

  const getDetails = async (id: String) => {
    await getCounts(id, (result: any) => {
      console.log(result);
      setCounts(result)
    }, (error) => {
      console.log('err', error);
    }
    )
  }

  return (
    <>
      <Head>
        <title>Report #2</title>
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
                  generateExcelReport2(coordinator.id);
                }}
                variant="contained"
              >
                Generate Excel
              </Button>
            </Grid>
          </Grid>
          <Card>
            <Box p={2}>
              <DropdownInputField
                items={coordinators}
                value={coordinator}
                label={"Coordinators"}
                onChangeValue={(value) => onDropdownChange(value)}
              />
            </Box>

            {
              showDetails
                ?
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          Details
                        </TableCell>
                        <TableCell align="center" colSpan={3}>
                          Number of Visits
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="right">Total Cows</TableCell>
                        <TableCell align="right">Total Families</TableCell>
                        <TableCell align="right">Current Month</TableCell>
                        <TableCell align="right">Last Month</TableCell>
                        <TableCell align="right">Month before last month</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={coordinator.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="right">{counts?.cowCount?._count?._all}</TableCell>
                        <TableCell align="right">{counts?.familyCount?._count?._all}</TableCell>
                        <TableCell align="right">{counts?.visitationCount?.currentMonth || 0}</TableCell>
                        <TableCell align="right">{counts?.visitationCount?.lastMonth || 0}</TableCell>
                        <TableCell align="right">{counts?.visitationCount?.monthBeforeLastMonth || 0}</TableCell>
                      </TableRow>
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

Report2.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default Report2;

export async function getServerSideProps(context: any) {
  const coordinators = await getCoordinators({
    req: context.req,
    type: 'Coordinator',
    filterCountry: true,
    filterFamily: true,
    status: 'Approved'
  })

  return {
    props: {
      coordinators: JSON.parse(JSON.stringify(coordinators))
    }
  }
}