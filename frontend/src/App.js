import React, { useState } from 'react';
// IMPORTACIONES CLAVE PARA LA NAVEGACIÓN
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Alert } from '@mui/material';

import Login from './Login';
import AuditDashboard from './AuditDashboard';
// 1. IMPORTACIÓN CORREGIDA - Upload Module
import UploadModule from './Upload'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate(); // Necesario para redirigir después del login/logout

  const handleAuthSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Redirige al dashboard después del login
    navigate('/dashboard'); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/'); // Redirige a la página de login
  };

  // La lógica de renderizado se moverá a las rutas más abajo.
  // Ya no necesitamos la función renderContent() antigua.

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* BARRA DE NAVEGACIÓN */}
      <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NUAM Dashboard {userRole ? `| Rol: ${userRole}` : ''}
          </Typography>
          
          {isAuthenticated && (
            <>
              {/* BOTÓN 1: DASHBOARD DE AUDITORÍA (Visible para Admin/Auditor) */}
              {(userRole === 'Administrador' || userRole === 'Auditor') && (
                <Button color="inherit" component={Link} to="/dashboard">
                  Auditoría
                </Button>
              )}
              
              {/* BOTÓN 2: CARGA MASIVA (Visible para Administrador/Operador) */}
              {(userRole === 'Administrador' || userRole === 'Operador') && (
                   <Button color="inherit" component={Link} to="/upload">
                      Carga Masiva
                  </Button>
              )}

              {/* BOTÓN CERRAR SESIÓN */}
              <Button color="inherit" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <main>
        {/* DEFINICIÓN DE RUTAS (Esta parte reemplaza tu renderContent) */}
        <Routes>
            {/* Ruta por defecto o Login */}
            <Route path="/" element={<Login onAuthSuccess={handleAuthSuccess} />} />
            
            {/* Ruta del Dashboard de Auditoría */}
            <Route 
                path="/dashboard" 
                element={isAuthenticated && (userRole === 'Administrador' || userRole === 'Auditor') 
                    ? <AuditDashboard /> 
                    : <Alert severity="error">Acceso denegado</Alert>} 
            />
            
            {/* RUTA DE CARGA MASIVA */}
            <Route 
                path="/upload" 
                element={isAuthenticated && (userRole === 'Administrador' || userRole === 'Operador')
                    ? <UploadModule /> 
                    : <Alert severity="error">Acceso denegado</Alert>} 
            />
            
        </Routes>
      </main>
    </Box>
  );
}

// Envuelve la aplicación con Router para que Link y Route funcionen
const WrappedApp = () => (
    <Router>
        <App />
    </Router>
);

export default WrappedApp;