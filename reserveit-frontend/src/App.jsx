import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import ReservationForm from './ReservationForm';
import LoginPage from './LoginPage';
import UserRecords from './UserRecords';
import ReservationDetails from './ReservationDetails'; // ✅ Add this line

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith('@dlsl.edu.ph')) {
      alert('Only DLSL email addresses are allowed.');
      return;
    }

    if (!role) {
      alert('Please select a role.');
      return;
    }

    console.log('Simulated login:', { email, password, role });
    setLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn
              ? <Navigate to="/dashboard" />
              : <LoginPage
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  role={role}
                  setRole={setRole}
                  handleSubmit={handleSubmit}
                />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-reservation" element={<ReservationForm />} />
        <Route path="/user-records" element={<UserRecords />} />
        <Route path="/reservation/:id" element={<ReservationDetails />} /> {/* ✅ Add this line */}
      </Routes>
    </Router>
  );
}

export default App;
