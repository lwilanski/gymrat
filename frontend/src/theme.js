// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#fdc705',
    },
    error: {
      main: '#fdc705',
    },
    background: {
      default: '#f4f4f4',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    // Możesz tutaj dodać więcej stylów typograficznych
  },
  // Możesz również dodać inne globalne style
});

export default theme;
