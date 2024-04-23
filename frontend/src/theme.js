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
      primary: '#000000', // Główny kolor tekstu
      secondary: '#fdc705', 
      third: '#FFFFFF' ,// Drugorzędny kolor tekstu
      disabled:'#9e9e9e', // Kolor dla nieaktywnego tekstu
      hint: '#bdbdbd', // Kolor dla tekstu typu 'podpowiedź'
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
