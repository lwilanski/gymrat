import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; // Załóżmy, że masz komponent Home w odpowiedniej ścieżce


function App() {
  return (
    
 
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>  
    </Router>
 

  );
}

export default App;

