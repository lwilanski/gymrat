import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function LoginForm({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(username, password);
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const success = await onRegister(registerUsername, registerPassword);
    if (success) {
      setIsRegisterOpen(false);
    }
  };

  return (
    <>
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
        <Button variant="outlined" onClick={() => setIsRegisterOpen(true)}>
          Zarejestruj się
        </Button>
      </Box>
      <Dialog open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <DialogTitle>Rejestracja</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nazwa użytkownika"
            type="text"
            fullWidth
            value={registerUsername}
            onChange={e => setRegisterUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Hasło"
            type="password"
            fullWidth
            value={registerPassword}
            onChange={e => setRegisterPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Powtórz hasło"
            type="password"
            fullWidth
            value={registerConfirmPassword}
            onChange={e => setRegisterConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
          <Button onClick={handleRegisterSubmit} variant="contained">Zarejestruj się</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginForm;
