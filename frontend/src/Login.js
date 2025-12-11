import React, { useState } from 'react';
import axios from 'axios';
import { 
    Container, Card, CardContent, Typography, TextField, Button, 
    CircularProgress, Box, Snackbar, Alert, Modal, Backdrop, Fade 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// La URL de tu backend de Flask
const API_URL = 'http://127.0.0.1:5000/api/login';

// Estilo del Modal para el MFA
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Se pasa onAuthSuccess como prop desde App.js
function Login({ onAuthSuccess }) {
  // Valores de prueba (que coinciden con el usuario "admin@nuam.cl" del backend)
  const [correo, setCorreo] = useState('admin@nuam.cl'); 
  const [password, setPassword] = useState('admin123'); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaOpen, setMfaOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Petición POST a la API de Flask
      const response = await axios.post(API_URL, { correo, password });
      
      setIsLoading(false);

      // Si el backend responde que necesita MFA (el valor que definimos en Flask)
      if (response.data.mfa_required) {
        setMfaOpen(true);
      } else {
        // En caso contrario (si el backend no pide MFA o solo es login)
        onAuthSuccess(response.data.rol);
      }

    } catch (err) {
      setIsLoading(false);
      // Muestra el error de credenciales si el backend lo envía (401)
      setError(err.response?.data?.error || 'Error de conexión o credenciales inválidas.');
    }
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    // Simulación de la verificación MFA
    if (mfaCode === '123456') { // Código MFA de prueba
      setMfaOpen(false);
      // Si el MFA es correcto, autenticamos al usuario
      onAuthSuccess('Administrador'); // Asumimos que es el Administrador
    } else {
      alert('Código MFA incorrecto o expirado.');
      setMfaCode('');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LockOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography component="h1" variant="h5">
          Acceso NUAM Regional
        </Typography>
        <Card sx={{ mt: 3, width: '100%', boxShadow: 3 }}>
          <CardContent>
            <form onSubmit={handleLogin} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="correo"
                label="Correo Electrónico"
                name="correo"
                autoComplete="email"
                autoFocus
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#003366', '&:hover': { backgroundColor: '#004488' } }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* Mensaje de error (Snackbar) */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Modal para MFA (criterio de seguridad) */}
      <Modal
        aria-labelledby="mfa-title"
        open={mfaOpen}
        onClose={() => setMfaOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={mfaOpen}>
          <Box sx={modalStyle}>
            <VpnKeyIcon color="secondary" sx={{ fontSize: 30, mb: 1 }} />
            <Typography id="mfa-title" variant="h6" component="h2" mb={2}>
              Verificación de Dos Factores
            </Typography>
            <form onSubmit={handleMfaSubmit}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Código OTP (123456)"
                    inputProps={{ maxLength: 6 }}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#FF6600', '&:hover': { backgroundColor: '#CC5500' } }}
                >
                    Verificar Código
                </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}

export default Login;