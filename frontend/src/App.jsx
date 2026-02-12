import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import LandingPage from './pages/LandingPage'; // <-- Naya Landing Page
import Home from './pages/Home';               // <-- Purana Portal Page
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* Main Website (Landing Page) */}
      {/* <Route path="/" element={<LandingPage />} /> */}
      
      {/* Student Verification Portal (Simple View) */}
      <Route path="/" element={<Home />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin Route */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;