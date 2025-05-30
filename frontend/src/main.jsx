// frontend/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';
import { ReservationProvider } from './ReservationContext'; // ✅ Your existing import


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ⭐⭐⭐ IMPORTANT: Wrap your app with GoogleOAuthProvider ⭐⭐⭐ */}
    {/* Replace "YOUR_GOOGLE_CLIENT_ID" with your actual Client ID from Google Cloud Console */}
    <GoogleOAuthProvider clientId="849806952511-hcdtjmtl769ihmjdeqcgdkr11tbp007o.apps.googleusercontent.com">
      <ReservationProvider> {/* Your existing ReservationProvider */}
        <App />
      </ReservationProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);