import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './providers/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
