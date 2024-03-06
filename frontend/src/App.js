import React from 'react';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Witaj w React z MUI!
      </Typography>
      <Button variant="contained" color="primary">
        Kliknij mnie
      </Button>
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            To jest karta
          </Typography>
          <Typography component="p">
            Material-UI zapewnia bogaty zestaw gotowych do użycia komponentów, które ułatwiają szybkie tworzenie interfejsów użytkownika.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
