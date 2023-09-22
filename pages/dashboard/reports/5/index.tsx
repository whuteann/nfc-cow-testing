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
import { getData as getCountries } from 'pages/api/countries';
import { getData as getFarms } from 'pages/api/farms';
import { getData as getTownVillages } from 'pages/api/townvillages';
import { getData as getUsers } from 'pages/api/users';
import { generateExcelReport5, getDataForReport5 } from '@/services/report/ReportServices';
import { family } from '@/models/Cow';
import { IconContext } from 'react-icons';
import { TbCurrencyTaka } from 'react-icons/tb';
import moment from 'moment-timezone';





function Report5({
  countries,
  farms,
  villagesTowns,
  teamLeads,
  supervisors,
  families,
  coordinators
}) {

  const [fromDate, setFromDate] = useState<any>(new Date());
  const [toDate, setToDate] = useState<any>(new Date());
  const [details, setDetails] = useState<any>([]);

  const [country, setCountry] = useState(countries.length > 0 ? countries[0] : undefined);
  const [countryError, setCountryError] = useState(false);
  const [farm, setFarm] = useState(undefined);
  const [villageTown, setVillageTown] = useState(undefined);
  const [teamLead, setTeamLead] = useState(undefined);
  const [supervisor, setSupervisor] = useState(undefined);
  const [coordinator, setCoordinator] = useState(undefined);
  const [family, setFamily] = useState(undefined);


  useEffect(() => {
    if (country) {
      setCountryError(false);
      const query = {
        countryId: country ? country.id : "",
        farmId: farm ? farm.id : "",
        villageTownId: villageTown ? villageTown.id : "",
        teamLeadId: teamLead ? teamLead.id : "",
        supervisorId: supervisor ? supervisor.id : "",
        coordinatorId: coordinator ? coordinator.id : "",
        familyId: family ? family.id : "",
        fromDate: fromDate,
        toDate: toDate
      }

      getDataForReport5(query, (data) => {
        console.log(data);
        setDetails(data);
      }, () => {

      });
    } else {
      setCountryError(true);
    }

  }, [country, farm, villageTown, teamLead, supervisor, coordinator, family, fromDate, toDate])

  return (
    <>
      <Head>
        <title>Report #5</title>
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
                  generateExcelReport5({
                    countryId: country ? country.id : "",
                    farmId: farm ? farm.id : "",
                    villageTownId: villageTown ? villageTown.id : "",
                    teamLeadId: teamLead ? teamLead.id : "",
                    supervisorId: supervisor ? supervisor.id : "",
                    coordinatorId: coordinator ? coordinator.id : "",
                    familyId: family ? family.id : "",
                    fromDate: moment(fromDate).startOf('month').toISOString(),
                    toDate: moment(toDate).endOf('month').toISOString(),
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

              <Grid container alignItems="center" spacing={1}>
                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={countries}
                    label={"Country"}
                    onChangeValue={(value) => {
                      setCountry(value);
                    }}
                    value={country}
                  />
                  {
                    countryError
                      ?
                      <div className='text-sm text-red-600'>Please select a country</div>
                      :
                      <></>
                  }
                </Grid>

                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={farms}
                    label={"Farm"}
                    onChangeValue={(value) => {
                      setFarm(value);
                    }}
                    value={farm}
                  />
                </Grid>

                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={villagesTowns}
                    label={"Village or Town"}
                    onChangeValue={(value) => {
                      setVillageTown(value);
                    }}
                    value={villageTown}
                  />
                </Grid>
              </Grid>

              <Grid container alignItems="center" spacing={1}>
                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={teamLeads}
                    label={"Team Lead"}
                    onChangeValue={(value) => {
                      setTeamLead(value);
                    }}
                    value={teamLead}
                  />
                </Grid>

                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={supervisors}
                    label={"Supervisor"}
                    onChangeValue={(value) => {
                      setSupervisor(value);
                    }}
                    value={supervisor}
                  />
                </Grid>

                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={coordinators}
                    label={"Coordinator"}
                    onChangeValue={(value) => {
                      setCoordinator(value);
                    }}
                    value={coordinator}
                  />
                </Grid>
              </Grid>

              <Grid container alignItems="center" spacing={1}>
                <Grid xs={12} md={4} item={true}>
                  <DropdownInputField
                    items={families}
                    label={"Family"}
                    onChangeValue={(value) => {
                      setFamily(value);
                    }}
                    value={family}
                  />
                </Grid>
              </Grid>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Total Number of Cows</TableCell>
                    <TableCell align="center">Total No of Cow Sold</TableCell>
                    <TableCell align="center">Sale Amount</TableCell>
                    <TableCell align="center">CCI Profits</TableCell>
                    <TableCell align="center">Total Death</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>{details[0]}</TableCell>
                    <TableCell align="center">{details[1]}</TableCell>
                    <TableCell align="center">
                      <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}>
                        <div>
                          {
                            country && country.name == "Bangladesh"
                              ?
                              <IconContext.Provider value={{ size: '25px' }}>
                                <div>
                                  <TbCurrencyTaka />
                                </div>
                              </IconContext.Provider>
                              :
                              <p className="text-base">Rs</p>
                          }
                        </div>
                        <div style={{
                          marginLeft: 10
                        }}>
                          {details[2]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}>
                        <div>
                          {
                            country && country.name == "Bangladesh"
                              ?
                              <IconContext.Provider value={{ size: '25px' }}>
                                <div>
                                  <TbCurrencyTaka />
                                </div>
                              </IconContext.Provider>
                              :
                              <p className="text-base">Rs</p>
                          }
                        </div>
                        <div style={{
                          marginLeft: 10
                        }}>
                          {details[3]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">{details[4]}</TableCell>
                  </TableRow>

                </TableHead>
                <TableBody>

                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid >
    </>
  );
}

Report5.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default Report5;

export async function getServerSideProps(context: any) {

  const [countries, farms, villagesTowns, teamLeads, supervisors, families, coordinators] = await Promise.all([
    getCountries({ req: context.req }),
    getFarms({ req: context.req }),
    getTownVillages({ req: context.req }),
    getUsers({ req: context.req, role: "Team Lead" }),
    getUsers({ req: context.req, role: "Supervisor" }),
    getFamilies({ req: context.req, filterCountry: false, status: "Approved", type: "Family" }),
    getFamilies({ req: context.req, filterCountry: false, status: "Approved", type: "Coordinator" }),
  ]);

  const mappedTeamLeads = (teamLeads as Array<any>).map(item => ({ id: item.id, name: `${item.firstName} ${item.lastName}` }));
  const mappedSupervisors = (supervisors as Array<any>).map(item => ({ id: item.id, name: `${item.firstName} ${item.lastName}` }));


  return {
    props: {
      countries: JSON.parse(JSON.stringify(countries)),
      farms: JSON.parse(JSON.stringify(farms)),
      villagesTowns: JSON.parse(JSON.stringify(villagesTowns)),
      teamLeads: JSON.parse(JSON.stringify(mappedTeamLeads)),
      supervisors: JSON.parse(JSON.stringify(mappedSupervisors)),
      families: JSON.parse(JSON.stringify(families)),
      coordinators: JSON.parse(JSON.stringify(coordinators))
    }
  }
}