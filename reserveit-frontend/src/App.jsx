import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { supabaseClient } from '../supbaseClient.js';
import Dashboard from './Dashboard';
import ReservationForm from './ReservationForm';
import LoginPage from './LoginPage';
import UserRecords from './UserRecords';
import ReservationDetails from './ReservationDetails';
import Settings from './Settings'; 
import ILFO from './ILFO'; 
import RequestForm from './RequestForm'; // <-- ADD THIS


function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [authError, setAuthError] = useState(null); 
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })
    .catch((error) => console.error("Error fetching session:", error))
    .finally(() => setLoadingSession(false)); // Set loading to false
    
  const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe()
  }, []); 

  console.log(session?.user?.email)

  const signOut = async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
  }; 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null); // Clear any previous errors

    if (!email.endsWith('@dlsl.edu.ph')) {
      setAuthError('Only DLSL email addresses are allowed.');
      return;
    }

    if (!password) {
      setAuthError('Password is required.');
      return;
    }

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setAuthError(error.message);
      }
      // If successful, the onAuthStateChange listener will update the session
    } catch (error) {
      console.error('Error signing in:', error);
      setAuthError('An unexpected error occurred during sign in.');
    }
  };

  if (loadingSession) {
    return <div>Loading session...</div>; // Or a spinner
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              <Navigate to="/dashboard" />
            )  : <LoginPage
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  role={role}
                  setRole={setRole}
                  handleSubmit={handleSubmit}
                  authError={authError}
                />
          }
        />
        <Route path="/new-reservation" element={<ReservationForm />} />
        <Route path="/user-records" element={<UserRecords />} />
        <Route path="/reservation/:id" element={<ReservationDetails />} />
        <Route path="/settings" element={<Settings />} /> 
        <Route path="/ilfo-designs" element={<ILFO />} />
        <Route path="/request-form" element={<RequestForm />} />
        <Route path="/dashboard"element={session ? <Dashboard onSignOut={signOut} /> : <Navigate to="/" />}/>
      </Routes>
    </Router>
  );
}

export default App;
