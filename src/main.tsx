import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register the service worker safely to prevent sandboxed iframe security crashes
if (
  typeof window !== 'undefined' && 
  'serviceWorker' in navigator && 
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
) {
  try {
    registerSW({ 
      immediate: true,
      onRegisterError(error: any) {
        console.warn('Service Worker registration failed:', error);
      }
    });
  } catch (e) {
    console.warn('PWA Service Worker registration skipped or blocked in this context:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
