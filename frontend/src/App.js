import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Footer from './components/Footer';
import Exercises from './components/Exercises';
import Workouts from './components/Workouts';


function App() {
  return (
    
 
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes> 
      <Footer /> 
    </Router>
 

  );
}

export default App;

