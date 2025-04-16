import { useState } from 'react';
import './App.css';
import dlslLogo from './assets/dlsl-logo.png';
import ilfoLogo from './assets/ilfo-logo.png'; // Replace with your real path
import reserveitLogo from '../public/reserveit-logo.png'; // Replace with your real path

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

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

    // ✅ Simulate success
    console.log('Simulated login with:', { email, password, role });
    setLoggedIn(true);
  };

  if (loggedIn) {
    return (
      <div className="success-page">
        <h1>Welcome, {role === 'user' ? 'User' : 'ILFO'}!</h1>
        <p>You’ve successfully logged in using {email}</p>
        <button onClick={() => setLoggedIn(false)}>Log out</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="logo-text">ReserveIT</h1>
        <p className="description">
          ReserveIT helps you with reservation of Retreat Complex enabling you to schedule different event and activities within the area.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="role-buttons">
            <div className="role-box-wrapper">
              <button
                type="button"
                className={`role-box ${role === 'user' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('user')}
              >
                <img src={dlslLogo} alt="DLSL Logo" className="role-box-logo dlsl-logo" />
              </button>
              <span className="role-label">USER</span>
            </div>

            <div className="role-box-wrapper">
              <button
                type="button"
                className={`role-box ${role === 'ilfo' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('ilfo')}
              >
                <img src={ilfoLogo} alt="ILFO Logo" className="role-box-logo ilfo-logo" />
              </button>
              <span className="role-label">ILFO</span>
            </div>
          </div>

          <button type="submit" className="login-button">Log in</button>
        </form>
      </div>

      <div className="login-right">
        <img src={reserveitLogo} alt="ReserveIT Logo" className="big-logo" />
      </div>
    </div>
  );
}

export default App;
