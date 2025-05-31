import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import reserveitLogo from '/reserveit-logo.png';
import './LoginPage.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const API_BASE_URL = 'http://localhost/reserveit-ilfo/backend/api';

function LoginPage({ authError, handleSubmit, setSession, setRole }) {
  const navigate = useNavigate();

  // Local state for manual login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onManualSubmit = (e) => {
    handleSubmit(e, email, password);
  };

  const handleGoogleSuccess = async (response) => {
    const idToken = response.credential;
    console.log("Google ID Token:", idToken);

    try {
      const backendResponse = await fetch(`${API_BASE_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_token: idToken }),
      });

      const contentType = backendResponse.headers.get('Content-Type') || '';
      if (!contentType.includes('application/json')) {
        const rawText = await backendResponse.text();
        throw new Error(`Expected JSON, got: ${rawText}`);
      }

      const data = await backendResponse.json();

      if (backendResponse.ok && data.success) {
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setSession({ user: data.user });
        setRole(data.user.role);

        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'general_user') {
          navigate('/dashboard');
        } else {
          alert("Login failed: Unknown user role.");
          navigate('/');
        }
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Frontend error:", error);
      alert('An error occurred during Google Sign-In. Check console or network logs.');
    }
  };

  const handleGoogleError = () => {
    alert('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="login-container-centered">
      <div className="login-content">
        <img src={reserveitLogo} alt="ReserveIT Logo" className="center-logo" />
        <p className="description-centered">
          ReserveIT helps you reserve the Retreat Complex for different events and activities.
        </p>

        {authError && <p className="error-message-centered">{authError}</p>}

        <Form onSubmit={onManualSubmit} className="login-form">
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

        <div className="social-login-centered">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;