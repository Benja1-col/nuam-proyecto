import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de que este archivo exista
import App from './App';
import reportWebVitals from './reportWebVitals'; // Esto es opcional

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si no lo quieres, puedes borrar el siguiente bloque
reportWebVitals();