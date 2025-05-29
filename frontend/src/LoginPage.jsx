import React from 'react';
import reserveitLogo from '/reserveit-logo.png';
import './LoginPage.css';
import Button from 'react-bootstrap/Button';
import { supabaseClient } from '../supbaseClient.js';

function LoginPage({ authError }) {
  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        // Optionally set an authError state
      }
    } catch (error) {
      console.error('Unexpected error signing in with Google:', error);
      // Optionally set an authError state
    }
  };

  return (
    <div className="login-container-centered">
      <div className="login-content">
        <img src={reserveitLogo} alt="ReserveIT Logo" className="center-logo" />
        <p className="description-centered">
          ReserveIT helps you with reservation of Retreat Complex enabling you to schedule different event and activities within the area.
        </p>

        {authError && <p className="error-message-centered">{authError}</p>}

        <div className="social-login-centered">
          <Button variant="primary" className="google-signin-button-centered" onClick={handleSignInWithGoogle}>
            <img
              src="/google-logo.png"
              alt="Google Logo"
              style={{ height: '20px', width: '20px', marginRight: '8px' }}
            />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;