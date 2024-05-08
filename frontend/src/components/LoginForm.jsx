import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(username, password);  // Proste przekazanie danych do funkcji onLogin
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Typography component="h1" variant="h5">
        Logowanie
      </Typography>
      <TextField
        required
        label="Nazwa użytkownika"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        required
        label="Hasło"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Zaloguj się
      </Button>
    </Box>
  );
}

export default LoginForm;
