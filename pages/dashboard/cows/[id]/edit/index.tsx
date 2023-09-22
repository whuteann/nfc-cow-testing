import {
  Box,
  Grid,
  styled,
  Card,
} from '@mui/material';

import Master from '@/layouts/BaseLayout/master';
import PageHeader from '@/components/templates/cows/PageHeader';
import { useAppDispatch } from '@/store';
import { setLoading } from '@/store/reducers/Loading';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import CowForm from '@/components/templates/cows/Form/CowForm';
import {ICow} from '@/models/Cow';
import React from 'react';
import { ICountry } from '@/models/Country';

import { getData as getCow } from 'pages/api/cows/[id]';
import countries, { getData as getCountries } from 'pages/api/countries';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function ShowCow({
  countries,
  cow
}) {

  // const router = useRouter();
  // const { id } = router.query;
  
  // const dispatch = useAppDispatch();

  // const [countries, setCountries] = useState<ICountry[]>(null);
  // const [cow, setCow] = useState<ICow>();

  // useEffect(() => {
  //   dispatch(setLoading(true));
  //   if(!router.isReady) return;
    
  //   loadInit();
  // }, [router.isReady]);

  // const loadInit = async () => {
  //   await getCountries('', true,
  //   (countries: ICountry[]) => {
  //     setCountries(countries)
  //   }, (error: any) => {

  //   });

  //   getCows((id as any), (cow: ICow) => {
  //     setCow(cow)

  //   }, (error: any) => {

  //   })
  //   dispatch(setLoading(false));
  // }

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
                <PageHeader type={"edit"}/>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <CowForm 
                  cow={cow}
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

ShowCow.getLayout = (page: any) => (
  <Master>{page}</Master>
);

export default ShowCow;

export async function getServerSideProps(context: any) {
  const cow = await getCow(context.query.id);

  if (!cow){
    return {
      notFound: true
    }
  }

  const countries = await getCountries({
    req: context.req,
    filterCountry: true,
  });
  
  return{
    props:{
      countries: JSON.parse(JSON.stringify(countries)),
      cow: JSON.parse(JSON.stringify(cow))
    }
  }
}