import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ReservationProvider } from './ReservationContext'; // ✅ Import the provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReservationProvider> {/* ✅ Wrap your app here */}
      <App />
    </ReservationProvider>
  </StrictMode>
);
