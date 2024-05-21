import React from 'react';
import { AppBar, Toolbar, Typography, useTheme, Button, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png';

const Navbar = ({ onLogout }) => {
  const theme = useTheme();

  const currentUser = localStorage.getItem('currentUser');

  const activeStyle = {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    margin: '0 10px',
  };

  const linkStyle = {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
    margin: '0 10px',
  };

  return (
    <AppBar position="static" sx={{ marginBottom: 0 }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/">
            <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }}/>
          </NavLink>
          <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>Home</NavLink>
          <NavLink to="/workouts" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>My Workouts</NavLink>
          <NavLink to="/exercises" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>Exercises</NavLink>
          <NavLink to="/calendar" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>Calendar</NavLink>
        </div>

        {currentUser && (
          <Box display="flex" alignItems="center">
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.primary.contrastText, 
                marginRight: 2, 
                fontWeight: 'bold'
              }}
            >
              {currentUser}
            </Typography>
            <Button 
              onClick={onLogout}
              sx={{
                color: theme.palette.primary.contrastText,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              LOG OUT
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
