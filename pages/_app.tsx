import './../src/styles/global.css';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { appWithTranslation } from 'next-i18next';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useScrollTop from 'src/hooks/useScrollTop';
import { SnackbarProvider } from 'notistack';
import NextNProgress from 'nextjs-progressbar';
import { SessionProvider } from 'next-auth/react';

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page) => page);
  useScrollTop();
 
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      nProgress.start;
    });
    
    router.events.on('routeChangeComplete', () => {
      nProgress.done;
    });

    router.events.on('routeChangeError', () => () => {
      nProgress.done;
    });
  }, [router.events]);
  
  return (
    <CacheProvider value={emotionCache}>
      <ReduxProvider store={store}>
        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SessionProvider session={(pageProps as any).session}>
                <NextNProgress />
                <SnackbarProvider
                  maxSnack={6}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  >
                  <CssBaseline />
                  {
                    getLayout(<Component {...pageProps} />)
                  }
                </SnackbarProvider>
              </SessionProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </ReduxProvider>
    </CacheProvider>
  ); 
}

export default appWithTranslation(MyApp);