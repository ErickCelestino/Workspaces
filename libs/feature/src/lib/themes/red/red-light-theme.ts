import { createTheme } from '@mui/material';

export const RedLightTheme = createTheme({
  palette: {
    primary: {
      main: '#F41A43',
      dark: '#FD496E',
      light: '#F41A43',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#24153C',
      dark: '#342B5E',
      light: '#3B376F',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f6f3',
      paper: '#ffffff',
    },
  },
});
