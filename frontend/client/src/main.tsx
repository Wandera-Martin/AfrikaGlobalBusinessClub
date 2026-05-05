import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from './context/ToastContext';

const GOOGLE_CLIENT_ID = '910432885701-h2d6ekqrh3orseeqe60pm477uqktu6u3.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
