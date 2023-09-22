import { useState } from 'react';
import {
  Box,
  Typography,
  Hidden,
  Container,
  Button,
  Grid,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';

import Head from 'next/head';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslation } from 'react-i18next';
import Master from '@/layouts/BaseLayout/master';
import { useRouter } from 'next/router';

const GridWrapper = styled(Grid)(
  ({ theme }) => `
    background: ${theme.colors.gradients.black1};
`
);

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function Status500() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const [pending, setPending] = useState(false);

  return (
    <>
      <Head>
        <title>Status - 500</title>
      </Head>
      <MainContent>
        <Grid
          container
          sx={{ height: '100%' }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            md={12}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container 
              maxWidth="sm" 
              sx={{
                mt: 6
              }}>
              <Box textAlign="center">
                <img
                  alt="500"
                  height={260}
                  src="/static/images/status/500.svg"
                />
                <Typography variant="h2" sx={{ my: 2 }}>
                  {t('There was an error, please try again later')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  {t(
                    'The server encountered an internal error and was not able to complete your request'
                  )}
                </Typography>
                <LoadingButton
                  onClick={() => { setPending(true); router.reload()}}
                  loading={pending}
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshTwoToneIcon />}
                >
                  {t('Refresh view')}
                </LoadingButton>
                <Button onClick={() => router.back()} variant="contained" sx={{ ml: 1 }}>
                  {t('Go back')}
                </Button>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </MainContent>
    </>
  );
}

export default Status500;

Status500.getLayout = function getLayout(page: ReactElement) {
  return <Master>{page}</Master>;
};