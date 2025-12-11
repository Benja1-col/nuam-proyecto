import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Button, LinearProgress, Box, Alert, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const API_URL_UPLOAD = 'http://127.0.0.1:5000/api/upload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function UploadModule() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && (selectedFile.name.endsWith('.xml') || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setMessage(`Archivo seleccionado: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`);
      setError('');
      setUploadProgress(0);
      setUploadResult(null);
    } else {
      setFile(null);
      setError('Tipo de archivo inválido. Solo se permiten archivos .xml o .csv');
      setUploadResult(null);
    }
  };

  // Manejo de drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      validateAndSetFile(droppedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }

    setIsUploading(true);
    setMessage('Iniciando carga y procesamiento...');
    setError('');
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(API_URL_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // Procesar respuesta exitosa del servidor
      setUploadResult(response.data);
      setMessage(`✅ Carga completada`);
      setUploadProgress(100);
      setIsUploading(false);
      setFile(null);

    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      const errorMessage = err.response?.data?.error || 'Error grave al procesar el archivo en el servidor. Revise logs.';
      setError(errorMessage);
      setMessage('');
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 'bold' }}>
        📁 Módulo de Carga Masiva
      </Typography>
      
      <Card sx={{ p: 4, boxShadow: 6, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Subir Archivos XML / CSV de Transacciones
          </Typography>
          
          <Box 
            sx={{ 
              border: dragActive ? '3px solid #FF6600' : '2px dashed #FF6600', 
              borderRadius: 2, 
              p: 5, 
              textAlign: 'center', 
              mb: 3,
              backgroundColor: dragActive ? '#FFF3E0' : '#FAFAFA',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <UploadFileIcon sx={{ fontSize: 50, color: '#FF6600', mb: 2 }} />
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Arrastra y suelta tu archivo aquí, o haz clic para seleccionar.
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Formatos aceptados: .XML, .CSV • Máximo 500 MB
            </Typography>
            <VisuallyHiddenInput 
                id="file-input"
                type="file" 
                onChange={handleFileChange}
                accept=".xml,.csv"
                disabled={isUploading}
            />
          </Box>

          {file && (
            <Chip 
                label={`Archivo Listo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`} 
                icon={<UploadFileIcon />} 
                color="primary" 
                variant="outlined"
                onDelete={() => {
                  setFile(null);
                  setMessage('');
                }}
                sx={{ mb: 2, fontSize: '0.95rem' }}
            />
          )}

          {(isUploading || uploadProgress > 0) && (
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}>
                {message} {uploadProgress > 0 && `(${uploadProgress}%)`}
              </Typography>
            </Box>
          )}

          {message && !isUploading && (
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleUpload}
            disabled={!file || isUploading || uploadProgress === 100}
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            sx={{ 
              mt: 2, 
              mb: 2,
              backgroundColor: '#003366', 
              '&:hover': { backgroundColor: '#004488' },
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {isUploading ? 'Procesando en Servidor...' : 'Confirmar Carga y Procesamiento'}
          </Button>

          {/* Mostrar resultados de carga */}
          {uploadResult && (
            <Box sx={{ mt: 4, p: 3, backgroundColor: '#E8F5E9', borderRadius: 2, border: '2px solid #4CAF50' }}>
              <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold', mb: 2 }}>
                ✅ Resultado del Procesamiento
              </Typography>
              
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#C8E6C9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Métrica</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Archivo Procesado</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{uploadResult.archivo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total de Registros</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        {uploadResult.total_registros}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Registros Procesados</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                        {uploadResult.registros_procesados}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Registros Fallidos</TableCell>
                      <TableCell align="right" sx={{ 
                        fontWeight: 'bold', 
                        color: uploadResult.registros_fallidos > 0 ? '#D32F2F' : '#2E7D32' 
                      }}>
                        {uploadResult.registros_fallidos}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#A5D6A7' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Porcentaje de Éxito</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1B5E20' }}>
                        {uploadResult.porcentaje_exito}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {uploadResult.errores && uploadResult.errores.length > 0 && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#FFF3E0', borderRadius: 1, border: '1px solid #FF9800' }}>
                  <Typography variant="body2" sx={{ color: '#E65100', fontWeight: 'bold', mb: 1 }}>
                    ⚠️ Errores Encontrados (primeros 10):
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {uploadResult.errores.map((error, index) => (
                      <li key={index} style={{ color: '#E65100', fontSize: '0.9rem', marginBottom: 4 }}>
                        {error}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                  setMessage('');
                  setError('');
                  setUploadProgress(0);
                }}
                sx={{ 
                  mt: 2,
                  backgroundColor: '#003366', 
                  '&:hover': { backgroundColor: '#004488' }
                }}
              >
                Procesar Otro Archivo
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default UploadModule;