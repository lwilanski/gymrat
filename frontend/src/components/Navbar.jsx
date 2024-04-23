import React from 'react';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png'; 
import Avatar from '@mui/material/Avatar';

const Navbar = () => {
  const theme = useTheme(); // Używa hooka useTheme, aby uzyskać dostęp do motywu

  // Tutaj przykładowy URL zdjęcia zalogowanego użytkownika, w prawdziwej aplikacji 
  // należy go odpowiednio dostosować do twojego przypadku użycia
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
          <NavLink to="/progress" style={({ isActive }) => (isActive ? activeStyle : linkStyle)}>Progress</NavLink>
        </div>

        {/* Avatar użytkownika */}
        <Avatar src={userPhotoUrl} alt="User Photo" sx={{ bgcolor: theme.palette.secondary.main }} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
