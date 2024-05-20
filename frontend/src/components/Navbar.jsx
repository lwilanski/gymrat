import React from 'react';
import { AppBar, Toolbar, Typography, useTheme, Button, Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png';

const Navbar = ({ onLogout }) => {
  const theme = useTheme();

  const userPhotoUrl = "https://example.com/path/to/user/photo.jpg";

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
    <AppBar position="static">
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

        <div>
          <Avatar src={userPhotoUrl} alt="User Photo" sx={{ bgcolor: theme.palette.secondary.main, marginRight: 2 }} />
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
