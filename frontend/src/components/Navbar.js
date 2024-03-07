import React from 'react';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme(); // Używa hooka useTheme, aby uzyskać dostęp do motywu

  const activeStyle = {
    color: theme.palette.secondary.main, // Poprawnie używa koloru wtórnego z motywu
    textDecoration: 'none',
    margin: '0 10px', // Dodaje trochę przestrzeni między linkami
  };

  const linkStyle = {
    color: theme.palette.primary.contrastText, // Używa kontrastowego tekstu dla koloru pierwotnego
    textDecoration: 'none',
    margin: '0 10px', // Podobnie, dodaje przestrzeń
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Nazwa Strony
        </Typography>
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          Home
        </NavLink>
        <NavLink
          to="/workouts"
          style={({ isActive }) => (isActive ? activeStyle : linkStyle)}
        >
          My Workouts
        </NavLink>
        {/* Możesz dodać więcej linków tutaj, zgodnie z potrzebą */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
