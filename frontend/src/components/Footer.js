import React from 'react';
import { Box, Container, Typography, Link, Grid, useTheme } from '@mui/material';

// Footer component using Material-UI
const Footer = () => {

    const theme = useTheme(); // Używa hooka useTheme, aby uzyskać dostęp do motywu

  return (
    // Box component works as a wrapper for your footer. You can control spacing, layout, and background.
    <Box 
      component="footer"
      sx={{
        py: 3, // padding Y-axis (top & bottom)
        px: 2, // padding X-axis (left & right)
        mt: 'auto', // margin top auto for pushing the footer to the bottom of the page
        backgroundColor: theme.palette.primary.main, // background color from theme.palette
    
      }}
    >
      <Container maxWidth="lg">
        {/* Container limits the width of the content inside it, based on maxWidth prop */}
        <Grid container spacing={5}>
          {/* Grid container for layout. `spacing` controls the space between grid items */}
          <Grid item xs={12} sm={4}>
            {/* Grid item for a section of the footer. Adjust `xs` and `sm` for responsive settings */}
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {/* Typography for text styling */}
              Regulamin i polityka prywatności
            </Typography>
            <ul>
              {/* List of links or items */}
              <li>
                <Link href="#" variant="subtitle1" color="textPrimary">
                  {/* Link component for navigation */}
                  Regulamin Strony
                </Link>
              </li>
              <li>
                <Link href="#" variant="subtitle1" color="textPrimary">
                  Polityka Prywatności
                </Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Footer Section 2
            </Typography>
            {/* Repeat list as needed per section */}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Footer Section 3
            </Typography>
            {/* More links or information */}
          </Grid>
        </Grid>
        <Box mt={5}>
          {/* Box for any additional information at the bottom of the footer, like copyright */}
          <Typography variant="body2" color="textThird" align="center">
            {/* Typography for styled text */}
            © {new Date().getFullYear()} GymRat
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
