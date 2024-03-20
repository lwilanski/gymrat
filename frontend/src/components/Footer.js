import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: 'primary.main', // Ustawienie koloru tła na kolor główny motywu
                color: 'white', // Ustawienie koloru tekstu na biały dla kontrastu
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom color="inherit">
                            O nas
                        </Typography>
                        <Typography variant="subtitle1" color="inherit">
                            Jesteśmy platformą dla wszystkich entuzjastów fitnessu.
                        </Typography>
                        <Box mt={1}>
                            <IconButton aria-label="facebook" href="https://facebook.com" color="inherit">
                                <FacebookIcon />
                            </IconButton>
                            <IconButton aria-label="instagram" href="https://instagram.com" color="inherit">
                                <InstagramIcon />
                            </IconButton>
                            <IconButton aria-label="twitter" href="https://twitter.com" color="inherit">
                                <TwitterIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom color="inherit">
                            Linki
                        </Typography>
                        <Link href="#" variant="subtitle1" display="block" color="inherit">
                            Blog
                        </Link>
                        <Link href="#" variant="subtitle1" display="block" color="inherit">
                            FAQ
                        </Link>
                        <Link href="#" variant="subtitle1" display="block" color="inherit">
                            Kontakt
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom color="inherit">
                            Regulamin i polityka prywatności
                        </Typography>
                        <Link href="#" variant="subtitle1" display="block" color="inherit">
                            Regulamin Strony
                        </Link>
                        <Link href="#" variant="subtitle1" display="block" color="inherit">
                            Polityka Prywatności
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={5} textAlign="center">
                    <Typography variant="body2" color="inherit">
                        © {new Date().getFullYear()} GymRat - Wszelkie prawa zastrzeżone.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
