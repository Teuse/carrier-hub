import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(77,133,255)',
    },
    background: {
      default: '#ffffff',   // Hauptbereich
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000', // Header schwarz
        },
      },
    },
  },
});

export default theme;