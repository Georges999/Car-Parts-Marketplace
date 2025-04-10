import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

// Dashboard components
import VehicleManager from '../components/dashboard/VehicleManager.jsx';
import PartsManager from '../components/dashboard/PartsManager';
import OrderHistory from '../components/dashboard/OrderHistory';
import SavedParts from '../components/dashboard/SavedParts';
import Reviews from '../components/dashboard/Reviews';
import ProfileSettings from '../components/dashboard/ProfileSettings';

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('vehicles');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !user) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
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

  // Render the appropriate component based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'vehicles':
        return <VehicleManager />;
      case 'parts':
        return <PartsManager />;
      case 'orders':
        return <OrderHistory />;
      case 'saved':
        return <SavedParts />;
      case 'reviews':
        return <Reviews />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <VehicleManager />;
    }
  };

  return (
    <div className="user-dashboard">
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user.name}!</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-sidebar">
            <div className="user-card">
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            
            <nav className="dashboard-nav">
              <ul>
                <li className={activeTab === 'vehicles' ? 'active' : ''}>
                  <button onClick={() => setActiveTab('vehicles')}>
                    <i className="fas fa-car"></i> My Vehicles
                  </button>
                </li>
                <li className={activeTab === 'parts' ? 'active' : ''}>
                  <button onClick={() => setActiveTab('parts')}>
                    <i className="fas fa-tools"></i> My Parts Listings
                  </button>
                </li>
                <li className={activeTab === 'orders' ? 'active' : ''}>
                  <button onClick={() => setActiveTab('orders')}>
                    <i className="fas fa-shopping-cart"></i> Order History
                  </button>
                </li>
                <li className={activeTab === 'saved' ? 'active' : ''}>
                  <button onClick={() => setActiveTab('saved')}>
                    <i className="fas fa-heart"></i> Saved Parts
                  </button>
                </li>
                <li className={activeTab === 'reviews' ? 'active' : ''}>
                  <button onClick={() => setActiveTab('reviews')}>
                    <i className="fas fa-star"></i> My Reviews
                  </button>
                </li>
                <li className={activeTab === 'profile' ? 'active' : ''}>
                  <button onClick={() => setActiveTab('profile')}>
                    <i className="fas fa-user-cog"></i> Profile Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="dashboard-main">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;