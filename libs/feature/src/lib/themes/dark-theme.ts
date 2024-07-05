import { createTheme } from '@mui/material';
import { green, purple } from '@mui/material/colors';

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C897EF',
      dark: purple[800],
      light: purple[500],
      contrastText: '#ffffff',
    },
    secondary: {
      main: green[500],
      dark: green[400],
      light: green[300],
      contrastText: '#ffffff',
    },
    background: {
      default: '#202124',
      paper: '#303134',
    },
  },
  typography: {
    allVariants: {
      color: 'white',
    },
  },
});
