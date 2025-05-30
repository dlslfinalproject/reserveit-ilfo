import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import ReservationForm from './ReservationForm';
import LoginPage from './LoginPage';
import UserRecords from './UserRecords';
import ReservationDetails from './ReservationDetails';
import Settings from './Settings';
import ILFO from './ILFO';
import RequestForm from './RequestForm';

// Define a base URL for your PHP API.
// IMPORTANT: You will need to ensure your PHP backend is running on this URL.
// For local development, this will typically be something like 'http://localhost:8000/api'.
// In a real application, you'd use a more robust environment variable setup.
const PHP_API_BASE_URL = 'http://localhost:8000/api';

function App() {
  // `session` will now represent the logged-in user's information,
  // which you'll receive from your PHP backend upon successful authentication.
  // It will be `null` if the user is not logged in.
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // User role will be determined by your PHP backend
  const [authError, setAuthError] = useState(null);
  // `loadingSession` is simplified as there's no initial Supabase session to fetch.
  // In a full app, you might check localStorage for a token here.
  const [loadingSession, setLoadingSession] = useState(false);

  // This useEffect now serves as a placeholder.
  // In a complete application, you would use this to check for a persistent login
  // (e.g., by checking for an authentication token in localStorage and validating it with your PHP backend).
  useEffect(() => {
    // For now, we assume no session on initial load unless explicitly logged in via LoginPage.
    // Set loading to false immediately.
    setLoadingSession(false);
    // Example: If you implement token-based auth with PHP, you might do something like:
    /*
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // You would then send this token to your PHP backend to validate the session
      // and fetch user details, then setSession(data.user)
      // For now, we'll just simulate a session if a token exists (NOT RECOMMENDED FOR PRODUCTION)
      setSession({ user: { email: 'simulated@dlsl.edu.ph', role: 'user' } });
    }
    */
  }, []);

  // Log the email of the current session user for debugging purposes.
  console.log(session?.user?.email);

  /**
   * Handles user sign-out by making a request to the PHP backend.
   * On successful logout, clears the local session state and any stored tokens.
   */
  const signOut = async () => {
    setAuthError(null); // Clear any previous authentication errors
    try {
      // Make a fetch call to your PHP backend's logout endpoint.
      // Adjust the URL and method (POST/GET) based on your PHP backend's implementation.
      const response = await fetch(`${PHP_API_BASE_URL}/auth/logout.php`, {
        method: 'POST', // Common for logout, but depends on your backend
        headers: {
          'Content-Type': 'application/json',
          // If using JWT, include the token in the Authorization header for the backend to invalidate
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json(); // Parse the JSON response from the backend

      if (response.ok && data.success) {
        // If the backend indicates successful logout, clear local session state
        setSession(null);
        setEmail('');
        setPassword('');
        setRole('');
        // Remove any stored authentication tokens or session IDs from local storage
        localStorage.removeItem('authToken'); // Example: if you use a token
        console.log('Signed out successfully.');
      } else {
        // Handle logout errors from the backend
        console.error('Error signing out:', data.message || 'Unknown error during sign out.');
        setAuthError(data.message || 'Failed to sign out.');
      }
    } catch (error) {
      // Handle network or unexpected errors during the sign-out process
      console.error('Network error during sign out:', error);
      setAuthError('An unexpected error occurred during sign out. Please try again.');
    }
  };

  /**
   * Handles user login by sending credentials to the PHP backend.
   * Validates email domain and password presence before making the API call.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setAuthError(null); // Clear any previous authentication errors

    // Frontend validation for DLSL email domain
    if (!email.endsWith('@dlsl.edu.ph')) {
      setAuthError('Only DLSL email addresses are allowed.');
      return;
    }

    // Frontend validation for password presence
    if (!password) {
      setAuthError('Password is required.');
      return;
    }

    try {
      // Make a fetch call to your PHP backend's login endpoint.
      // Ensure your PHP backend is configured to handle POST requests to this URL.
      const response = await fetch(`${PHP_API_BASE_URL}/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate that the request body is JSON
        },
        body: JSON.stringify({ email, password }), // Send email and password as JSON
      });

      const data = await response.json(); // Parse the JSON response from the backend

      if (response.ok && data.success) {
        // If login is successful, update the session state with user data from the backend.
        // Assuming your PHP backend returns a `user` object with `email` and `role`.
        setSession({ user: { email: data.user.email, role: data.user.role } });
        setRole(data.user.role); // Set the role based on backend response

        // If your PHP backend returns an authentication token (e.g., JWT), store it for persistence.
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        console.log('Login successful!');
      } else {
        // Handle login errors reported by the backend (e.g., invalid credentials)
        setAuthError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Handle network or unexpected errors during the sign-in process
      console.error('Error signing in:', error);
      setAuthError('An unexpected error occurred during sign in. Please try again.');
    }
  };

  // Display a loading indicator while the session is being checked (if `loadingSession` is true).
  if (loadingSession) {
    return <div>Loading session...</div>; // You can replace this with a more sophisticated spinner
  }

  return (
    <Router>
      <Routes>
        {/* Root path: If session exists, navigate to dashboard; otherwise, show LoginPage */}
        <Route
          path="/"
          element={
            session ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole} // Pass setRole to LoginPage if it needs to update role directly (e.g., for registration)
                handleSubmit={handleSubmit}
                authError={authError}
              />
            )
          }
        />
        {/* Protected Routes: These routes are only accessible if a session exists.
            If no session, they redirect to the login page ("/") using <Navigate>. */}
        <Route
          path="/dashboard"
          element={session ? <Dashboard onSignOut={signOut} /> : <Navigate to="/" />}
        />
        <Route
          path="/new-reservation"
          element={session ? <ReservationForm /> : <Navigate to="/" />}
        />
        <Route
          path="/user-records"
          element={session ? <UserRecords /> : <Navigate to="/" />}
        />
        <Route
          path="/reservation/:id"
          element={session ? <ReservationDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={session ? <Settings /> : <Navigate to="/" />}
        />
        <Route
          path="/ilfo-designs"
          element={session ? <ILFO /> : <Navigate to="/" />}
        />
        <Route
          path="/request-form"
          element={session ? <RequestForm /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
