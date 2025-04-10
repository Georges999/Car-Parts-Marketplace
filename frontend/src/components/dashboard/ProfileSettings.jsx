import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/Auth/AuthContext';

const ProfileSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    partAlerts: true,
    reviewReminders: true
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const validateProfileForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', content: 'Name is required' });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setMessage({ type: 'error', content: 'Valid email is required' });
      return false;
    }
    
    return true;
  };

  const validatePasswordForm = () => {
    if (!formData.currentPassword) {
      setMessage({ type: 'error', content: 'Current password is required' });
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', content: 'New password must be at least 6 characters' });
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', content: 'New passwords do not match' });
      return false;
    }
    
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });
    
    if (!validateProfileForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', content: 'Profile updated successfully' });
        // Update local storage with new user info
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          name: formData.name,
          email: formData.email
        }));
      } else {
        setMessage({ type: 'error', content: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', content: 'Network error occurred' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', content: 'Password updated successfully' });
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', content: data.message || 'Failed to update password' });
      }
    } catch (err) {
      setMessage({ type: 'error', content: 'Network error occurred' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    // Here you would typically save notification preferences to the backend
    setMessage({ type: 'success', content: 'Notification preferences saved' });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/users/profile', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          logout();
          navigate('/');
        } else {
          const data = await response.json();
          setMessage({ type: 'error', content: data.message || 'Failed to delete account' });
        }
      } catch (err) {
        setMessage({ type: 'error', content: 'Network error occurred' });
        console.error(err);
      }
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      
      <div className="settings-tabs">
        <button 
          className={activeTab === 'account' ? 'active' : ''} 
          onClick={() => setActiveTab('account')}
        >
          Account Information
        </button>
        <button 
          className={activeTab === 'password' ? 'active' : ''} 
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button 
          className={activeTab === 'notifications' ? 'active' : ''} 
          onClick={() => setActiveTab('notifications')}
        >
          Notification Preferences
        </button>
        <button 
          className={activeTab === 'danger' ? 'active' : ''} 
          onClick={() => setActiveTab('danger')}
        >
          Danger Zone
        </button>
      </div>
      
      {message.content && (
        <div className={`alert alert-${message.type}`}>
          {message.content}
        </div>
      )}
      
      <div className="tab-content">
        {activeTab === 'account' && (
          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
        
        {activeTab === 'password' && (
          <form onSubmit={handleUpdatePassword} className="settings-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
              />
              <div className="password-hint">
                Password must be at least 6 characters
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
        
        {activeTab === 'notifications' && (
          <div className="notification-settings">
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="orderUpdates"
                name="orderUpdates"
                checked={notificationSettings.orderUpdates}
                onChange={handleNotificationChange}
              />
              <label htmlFor="orderUpdates">
                Order Updates and Shipping Notifications
              </label>
            </div>
            
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="promotions"
                name="promotions"
                checked={notificationSettings.promotions}
                onChange={handleNotificationChange}
              />
              <label htmlFor="promotions">
                Deals, Promotions and Discounts
              </label>
            </div>
            
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="partAlerts"
                name="partAlerts"
                checked={notificationSettings.partAlerts}
                onChange={handleNotificationChange}
              />
              <label htmlFor="partAlerts">
                Price Alerts for Saved Parts
              </label>
            </div>
            
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="reviewReminders"
                name="reviewReminders"
                checked={notificationSettings.reviewReminders}
                onChange={handleNotificationChange}
              />
              <label htmlFor="reviewReminders">
                Review Reminders for Purchased Parts
              </label>
            </div>
            
            <button 
              onClick={handleSaveNotifications} 
              className="btn-primary"
            >
              Save Preferences
            </button>
          </div>
        )}
        
        {activeTab === 'danger' && (
          <div className="danger-zone">
            <h3>Delete Account</h3>
            <p>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>
            <button 
              onClick={handleDeleteAccount} 
              className="btn-danger"
            >
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;