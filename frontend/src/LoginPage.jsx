import React from 'react';
import reserveitLogo from '/reserveit-logo.png';
import googleLogo from '/google-logo.png'; // Import Google logo if you want to keep the image, but the functionality is removed for now
import './LoginPage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'; // Import Form component from react-bootstrap

// This component is responsible for rendering the login form.
// It receives props from App.jsx to manage email, password, role,
// handle form submission, and display authentication errors.
function LoginPage({ email, setEmail, password, setPassword, handleSubmit, authError }) {
  // The handleSignInWithGoogle function and its associated logic have been removed
  // as they were tied to Supabase's authentication.
  // Google authentication will need to be re-implemented on the PHP backend side.

  return (
    <div className="login-container-centered">
      <div className="login-content">
        <img src={reserveitLogo} alt="ReserveIT Logo" className="center-logo" />
        <p className="description-centered">
          ReserveIT helps you with reservation of Retreat Complex enabling you to schedule different event and activities within the area.
        </p>

        {/* Display authentication errors if any */}
        {authError && <p className="error-message-centered">{authError}</p>}

        {/* Email and Password Login Form */}
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter DLSL email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Sign In
          </Button>
        </Form>

        {/* The Google Sign-in button is commented out/removed as its functionality
            was tied to Supabase and needs a PHP backend implementation. */}
        {/*
        <div className="social-login-centered">
          <Button variant="primary" className="google-signin-button-centered" onClick={handleSignInWithGoogle}>
            <img
              src={googleLogo} // Using imported googleLogo
              alt="Google Logo"
              style={{ height: '20px', width: '20px', marginRight: '8px' }}
            />
            Sign in with Google
          </Button>
        </div>
        */}
      </div>
    </div>
  );
}

export default LoginPage;
