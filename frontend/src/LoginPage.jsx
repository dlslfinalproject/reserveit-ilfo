// frontend/src/LoginPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useGoogleLogin } from '@react-oauth/google'; // Import the Google login hook

import reserveitLogo from '/reserveit-logo.png';
import googleLogo from '/google-logo.png';
import './LoginPage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Adjust to your backend's API base URL.
// Ensure this matches the actual path to your auth.php file.
const API_BASE_URL = 'http://localhost/reserveit-ilfo/backend/api'; 

// This component is responsible for rendering the login form.
// It receives props from App.jsx to manage email, password,
// handle traditional form submission, and display authentication errors.
function LoginPage({ email, setEmail, password, setPassword, handleSubmit, authError }) {
  const navigate = useNavigate(); // Initialize navigate hook

  // --- Google Sign-In Logic ---
  const handleGoogleSuccess = async (response) => {
    // response.credential contains the ID token
    const idToken = response.credential;

    try {
      // Send the ID token to your PHP backend for verification and user handling
     const backendResponse = await fetch(`${API_BASE_URL}/auth.php`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include', // This is the correct way to include credentials
    body: JSON.stringify({ id_token: idToken }),
});
      const data = await backendResponse.json();

      if (backendResponse.ok && data.success) {
        // Store user info (e.g., in localStorage or a React Context for global state)
        localStorage.setItem('user_data', JSON.stringify(data.user));

        // Redirect based on the role returned by the backend
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.role === 'general_user') {
          navigate('/dashboard'); // General user dashboard
        } else {
          // Fallback for unexpected roles
          console.error("Unknown user role:", data.user.role);
          alert("Login failed: Unknown user role.");
          navigate('/login'); // Redirect back to login
        }
      } else {
        // Backend returned an error (e.g., domain restriction, invalid token)
        alert(`Login failed: ${data.message}`);
        console.error("Backend login error:", data.message);
      }
    } catch (error) {
      alert('An error occurred during Google Sign-In. Please try again.');
      console.error("Frontend network or API error during Google Sign-In:", error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed.');
    alert('Google Sign-In failed. Please try again.');
  };

  // Hook to get the Google login function
  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    // You might want to specify scope if you need more than default (email, profile)
    // scope: 'email profile',
    // Consider adding `prompt_select_account: true` if you want to force account selection
    // prompt_select_account: true,
  });

  // --- End Google Sign-In Logic ---

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

        {/* Google Sign-in Button */}
        <div className="social-login-centered">
          <Button variant="primary" className="google-signin-button-centered" onClick={() => login()}>
            <img
              src={googleLogo}
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