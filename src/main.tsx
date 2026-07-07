import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Catch benign Vite HMR errors to prevent fullscreen crash overlays in development
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason && (
      reason.message === 'WebSocket closed without opened.' ||
      (typeof reason === 'string' && reason.includes('WebSocket')) ||
      (reason.message && reason.message.includes('websocket'))
    )) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('WebSocket') || 
      event.message.includes('websocket')
    )) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

