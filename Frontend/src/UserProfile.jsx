import { useState } from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'U'; // Default initial for undefined/null names
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-profile">
      <button 
        className="user-profile-btn"
        onClick={toggleDropdown}
        aria-label="User profile"
      >
        <div className="user-avatar">
          {getInitials(user.name)}
        </div>
        <span className="user-name">{user.name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isDropdownOpen && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {getInitials(user.name)}
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-name">{user.name}</div>
              <div className="dropdown-email">{user.email}</div>
            </div>
          </div>
          
          <div className="dropdown-menu">
            <button className="dropdown-item">
              <span className="dropdown-icon">👤</span>
              My Profile
            </button>
            <button className="dropdown-item" onClick={() => { window.location.href = '/myorders'; setIsDropdownOpen(false); }}>
              <span className="dropdown-icon">📦</span>
              My Orders
            </button>
            <button className="dropdown-item">
              <span className="dropdown-icon">❤️</span>
              Wishlist
            </button>
            <button className="dropdown-item">
              <span className="dropdown-icon">⚙️</span>
              Settings
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <span className="dropdown-icon">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
