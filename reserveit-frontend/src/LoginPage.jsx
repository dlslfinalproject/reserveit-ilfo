import dlslLogo from './assets/dlsl-logo.png';
import ilfoLogo from './assets/ilfo-logo.png';
import reserveitLogo from '/reserveit-logo.png'; // notice the leading slash for public folder
import './App.css';

function LoginPage({ email, setEmail, password, setPassword, role, setRole, handleSubmit }) {
  const handleRoleSelect = (selectedRole) => setRole(selectedRole);

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
            autoComplete="off"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
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

export default LoginPage;