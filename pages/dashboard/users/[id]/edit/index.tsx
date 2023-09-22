import {
  Box,
  Grid,
  styled,
  Card
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import PageHeader from '@/components/templates/users/manage/PageHeader';
import UserForm from '@/components/templates/users/manage/UserForm';
import { getData as getCountries } from 'pages/api/countries';
import { getData as getUsers } from 'pages/api/users';
import { getData as getUser } from 'pages/api/users/[id]';

import { TEAM_LEAD_ROLE } from '@/types/Common';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function UserEdit({
  user,
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
                <PageHeader type={"edit"} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <UserForm
                  countries={countries}
                  teamLeads={teamLeads}
                  user={{ ...user, email: user?.email.replaceAll("@carechannels.org", "") }} />
              </Card>
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

UserEdit.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default UserEdit;

export async function getServerSideProps(context: any) {
  const user = await getUser({id: context.query.id});

  if (!user){
    return {
      notFound: true
    }
  }
  
  const countries = await getCountries({
    req: context.req,
    filterCountry: false,
  });

  const teamLeads = await getUsers({
    req: context.req,
    role: TEAM_LEAD_ROLE
  });

  return{
    props: {
      user: JSON.parse(JSON.stringify(user)),
      countries: JSON.parse(JSON.stringify(countries)),
      teamLeads: JSON.parse(JSON.stringify(teamLeads))
    }
  }
}
