import {
  Box,
  Grid,
  styled,
  Card,
  Typography,
  Button,
  Link,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { getData as getBirthRecord } from 'pages/api/familyBreedingRecords/[id]';
import { getData as getCows } from 'pages/api/cows';
import { getData as getFarms } from 'pages/api/farms';
import {getData as getFamilies} from 'pages/api/families';
import FamilyBreedingForm from '@/components/templates/breedingRecords/form/Form2';

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

function BreedingRecordEdit({
  families,
  birthRecord
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
                <RootWrapper>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography variant="h3" component="h3" gutterBottom>
                              {/* {t("Farm Birth Record of")}: {`${birthRecord?.secondaryId}`} */}
                          </Typography>
                          <Typography variant="subtitle2">
                              {/* {t("Fields below are the details of farm birth record")} */}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Button
                        sx={{
                          mt: { xs: 2, sm: 0 }
                        }}
                        component={Link}
                        startIcon={<ArrowBackTwoToneIcon />}
                        href="/dashboard/family-birth-records"
                        variant="contained"
                      >
                        {('Go back')}
                      </Button>
                    </Grid>
                  </Grid>
                </RootWrapper>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <FamilyBreedingForm 
                  record={birthRecord}
                  families={families}
                />
              </Card>
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

BreedingRecordEdit.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default BreedingRecordEdit;

export async function getServerSideProps(context: any) {
  // const farms = await getFarms({
  //   req: context.req,
  //   filterCountry: true,
  // });

  // const cows = await getCows({
  //   req: context.req,
  //   gender: 'Female',
  //   filterCountry: true,
  // });

  const families = await getFamilies({
    req: context.req,
    filterCountry: true,
  })

  const birthRecord = await getBirthRecord(context.query.id);

  if (!birthRecord){
    return {
      notFound: true
    }
  }
  
  return{
    props:{
      // farms: JSON.parse(JSON.stringify(farms)),
      // cows: JSON.parse(JSON.stringify(cows)),
      birthRecord: JSON.parse(JSON.stringify(birthRecord)),
      families: JSON.parse(JSON.stringify(families))
    }
  }
}