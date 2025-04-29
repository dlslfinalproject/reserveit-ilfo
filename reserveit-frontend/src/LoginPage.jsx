import dlslLogo from './assets/dlsl-logo.png';
import ilfoLogo from './assets/ilfo-logo.png';
import reserveitLogo from '/reserveit-logo.png'; // notice the leading slash for public folder
import './App.css';
import { supabaseClient } from '../supbaseClient.js'; // Import supabaseClient if not already imported in this file

function LoginPage({ email, setEmail, password, setPassword, role, setRole, handleSubmit, authError }) {
  const handleRoleSelect = (selectedRole) => setRole(selectedRole);

  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        // Optionally set an authError state to display to the user
        // setAuthError(error.message);
      }
      // After successful redirect to Google, Supabase handles the callback
      // and your auth state listener in App.jsx will update the session.
    } catch (error) {
      console.error('Unexpected error signing in with Google:', error);
      // Optionally set an authError state to display to the user
      // setAuthError('An unexpected error occurred during Google sign in.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="logo-text">ReserveIT</h1>
        <p className="description">
          ReserveIT helps you with reservation of Retreat Complex enabling you to schedule different event and activities within the area.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {authError && <p className="error-message">{authError}</p>}

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

        <div className="social-login">
          <hr className="divider" />
          <p className="social-text">Or sign in with</p>
          <button type="button" className="google-button" onClick={handleSignInWithGoogle}>
            <img src="/google-logo.png" alt="Google Logo" className="social-icon" />
            Sign in with Google
          </button>
        </div>
      </div>

      <div className="login-right">
        <img src={reserveitLogo} alt="ReserveIT Logo" className="big-logo" />
      </div>
    </div>
  );
}

export default LoginPage;