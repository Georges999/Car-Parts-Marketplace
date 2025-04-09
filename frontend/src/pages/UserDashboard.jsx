import { Link } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="user-dashboard">
        <div className="container">
          <div className="auth-required">
            <div className="auth-message">
              <h2>Sign in to access your dashboard</h2>
              <p>Please login or create an account to view your dashboard.</p>
              <div className="auth-buttons">
                <Link to="/login" className="btn-primary">Sign In</Link>
                <Link to="/register" className="btn-secondary">Create Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="container">
        <h1>My Dashboard</h1>
        <p>This is a placeholder for the user dashboard.</p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    </div>
  );
};

export default UserDashboard;