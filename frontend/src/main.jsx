import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="849806952511-hcdtjmtl769ihmjdeqcgdkr11tbp007o.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
  </StrictMode>
);