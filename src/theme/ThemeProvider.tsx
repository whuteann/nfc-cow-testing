import { FC, useState, createContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';
import Loader from '@/components/atoms/Loader';

export const ThemeContext = createContext((_themeName: string): void => {});

const ThemeProviderWrapper = (props: any) => {
  const [themeName, _setThemeName] = useState('');

  useEffect(() => {
    const curThemeName = window.localStorage.getItem('appTheme') || 'ICareChannelsTheme';
    _setThemeName(curThemeName);
  }, []);
  
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };
  
  if(themeName == '') {
    return <Loader />
  }

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
