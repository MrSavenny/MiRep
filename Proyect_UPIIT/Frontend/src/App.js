import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

function App() {
  const isAuth = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* RUTA DE LOGIN: Si ya está logueado, mandarlo al dashboard */}
        <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* RUTA DE REGISTRO */}
        <Route path="/register" element={<Register />} />

        {/* RUTA DEL DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* RUTA POR DEFECTO: Si escriben cualquier cosa, mandarlos al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;