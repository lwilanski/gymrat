import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Footer from './components/Footer';
import Exercises from './components/Exercises';
import Workouts from './components/Workouts';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        console.log('Zalogowano pomyślnie:', data);
      } else {
        throw new Error(data.detail || 'Nie można się zalogować');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      alert('Logowanie nieudane: ' + error.message);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginForm onLogin={login} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
