import { createTheme } from '@mui/material';
import { cyan, purple } from '@mui/material/colors';

export const LighTheme = createTheme({
  palette: {
    primary: {
      main: '#C897EF',
      dark: purple[800],
      light: purple[500],
      contrastText: '#ffffff',
    },
    secondary: {
      main: cyan[500],
      dark: cyan[400],
      light: cyan[300],
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f6f3',
      paper: '#ffffff',
    },
  },
});
