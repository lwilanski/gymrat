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
    text: {
      primary: '#000000', 
      secondary: '#fdc705', 
      third: '#FFFFFF' ,
      disabled:'#9e9e9e', 
      hint: '#bdbdbd', 
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
 
});

export default theme;
