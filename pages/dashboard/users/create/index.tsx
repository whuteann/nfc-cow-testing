import PageHeader from '@/components/templates/users/manage/PageHeader';
import {
  Box,
  Grid,
  styled,
  Card,
  getListSubheaderUtilityClass
} from '@mui/material';

import UserForm from '@/components/templates/users/manage/UserForm';
import Master from '@/layouts/BaseLayout/master';
import { useAppDispatch } from '@/store';
import { useEffect, useState } from 'react';
import { setLoading } from '@/store/reducers/Loading';
import { IFarm } from '@/models/Farm';
import { IUser } from '@/models/User';
import { TEAM_LEAD_ROLE } from '@/types/Common';
import { getData as getCountries } from 'pages/api/countries';
import { getData as getUsers } from 'pages/api/users';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function UserCreate({
  countries,
  teamLeads
}: any) {
  return (
    <>
      <Box mb={3} display="flex">
        <MainContentWrapper>
          <Grid
            sx={{ px: 4 }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <PageHeader type={"create"}/>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <UserForm
                  teamLeads={teamLeads}
                  countries={countries}
                />
              </Card>
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

UserCreate.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default UserCreate;

export async function getServerSideProps(context: any) {
  const countries = await getCountries({
    req: context.req,
    filterCountry: false
  });

  
  const teamLeads = await getUsers({
    req: context.req,
    role: TEAM_LEAD_ROLE
  });
  
  // const farms = await getFarms({
  //   req: context.req,
  //   filterCountry: true,
  // });
  
  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries)),
      teamLeads: JSON.parse(JSON.stringify(teamLeads))
    }
  }
}