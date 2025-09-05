import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <h1>Please log in to view your profile</h1>
            <button className="btn" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            👤
          </div>
          <div className="profile-info">
            <h1>{user.name || 'User'}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">{user.role || 'Customer'}</p>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Account Actions</h3>
            <div className="action-buttons">
              <button className="btn" onClick={() => navigate('/myorders')}>
                My Orders
              </button>
              <button className="btn" onClick={() => navigate('/wishlist')}>
                My Wishlist
              </button>
              <button className="btn" onClick={() => navigate('/cart')}>
                My Cart
              </button>
              <button className="btn secondary" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{user.name || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span>{user.role || 'Customer'}</span>
              </div>
              <div className="info-item">
                <label>Member Since:</label>
                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
