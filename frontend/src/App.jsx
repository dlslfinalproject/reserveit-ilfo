import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';
import ReservationForm from './ReservationForm';
import ReservationFormUser from './ReservationFormUser';
import ReservationRecords from './ReservationRecords';
import UserRecords from './UserRecords';
import Settings from './Settings';
import RequestForm from './RequestForm';
import ApprovalSuccess from './ApprovalSuccess';

const PHP_API_BASE_URL = 'http://localhost/reserveit-ilfo/backend/api';

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('');
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setSession({ user: parsedUser });
      setRole(parsedUser.role);
    }
  }, []);

  const signOut = async () => {
    setAuthError(null);
    try {
      const response = await fetch(`${PHP_API_BASE_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSession(null);
        setRole('');
        localStorage.removeItem('user_data');
        localStorage.removeItem('authToken');
        console.log('Signed out successfully.');
      } else {
        console.error('Error signing out:', data.message || 'Unknown error.');
        setAuthError(data.message || 'Failed to sign out.');
      }
    } catch (error) {
      console.error('Network error during sign out:', error);
      setAuthError('An unexpected error occurred during sign out.');
    }
  };

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.endsWith('@dlsl.edu.ph')) {
      setAuthError('Only DLSL email addresses are allowed.');
      return;
    }
    if (!password) {
      setAuthError('Password is required.');
      return;
    }

    try {
      const response = await fetch(`${PHP_API_BASE_URL}/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSession({ user: data.user });
        setRole(data.user.role);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        console.log('Login successful!');
      } else {
        setAuthError(data.message || 'Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setAuthError('An unexpected error occurred during sign in.');
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              session.user.role === 'admin' ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/general-user" />
              )
            ) : (
              <LoginPage
                authError={authError}
                handleSubmit={handleSubmit}
                setSession={setSession}
                setRole={setRole}
              />
            )
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              authError={authError}
              handleSubmit={handleSubmit}
              setSession={setSession}
              setRole={setRole}
            />
          }
        />

        <Route
          path="/admin"
          element={
            session?.user?.role === 'admin' ? (
              <AdminDashboard session={session} onSignOut={signOut} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/general-user"
          element={
            session && session.user.role == 'general_user' ? (
              <Dashboard onSignOut={signOut} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/new-reservation"
          element={
            session?.user?.role === 'admin' ? (
              <ReservationForm />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/general-user/new-reservation"
          element={
            session?.user?.role === 'general_user' ? (
              <ReservationFormUser />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/admin/reservation-records"
          element={
            session?.user?.role === 'admin' ? (
              <ReservationRecords />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/general-user/reservations"
          element={
            session?.user?.role === 'general_user' ? (
              <UserRecords />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        

        
        <Route path="/user-records" element={session ? <UserRecords /> : <Navigate to="/" />} />
        <Route path="/settings" element={session ? <Settings /> : <Navigate to="/" />} />
        <Route path="/request-form" element={session ? <RequestForm /> : <Navigate to="/" />} />
        <Route path="/admin/approval-success" element={<ApprovalSuccess />} />

        {/* Optional: Catch-all for unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
