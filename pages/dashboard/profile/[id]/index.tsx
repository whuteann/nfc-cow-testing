import {
  Box,
  Grid,
  styled,
} from '@mui/material';
import ProfileForm from '@/components/templates/profile/Form';
import Master from '@/layouts/BaseLayout/master';
import { getData as getUser } from 'pages/api/users/[id]';
import { useTranslation } from 'next-i18next';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

const RootWrapper = styled(Box)(
  () => `
    flex: 1;
`
);

function UserProfile({
user
}) {
  const { t }: { t: any } = useTranslation();

  return (
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
              <RootWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                    </Box>
                  </Grid>
                </Grid>
              </RootWrapper>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <ProfileForm
              user={user}
            />
          </Grid>
        </Grid>
      </MainContentWrapper>
    </Box>
  );
}

UserProfile.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default UserProfile;

export async function getServerSideProps(context: any) {

  const user = await getUser({id: context.query.id});
  
  return{
    props:{
      user: JSON.parse(JSON.stringify(user))
    }
  }
}