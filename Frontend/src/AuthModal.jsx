import { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasDigit: false,
    hasSpecialChar: false
  });

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 5,
      hasUppercase: /[A-Z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordValidation(validation);
    return validation;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate password in real-time for signup
    if (name === 'password' && !isLogin) {
      validatePassword(value);
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      if (!isLogin) {
        // Validate password requirements
        const validation = validatePassword(formData.password);
        if (!validation.minLength || !validation.hasUppercase || !validation.hasDigit || !validation.hasSpecialChar) {
          setError('Password must meet all requirements');
          setLoading(false);
          return;
        }
        
        // Check password confirmation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        if (isLogin) {
          localStorage.setItem('token', data.jwtToken);
          localStorage.setItem('leeya_jwt', data.jwtToken);
          localStorage.setItem('user', JSON.stringify({
            name: data.name,
            email: data.email
          }));
          setTimeout(() => {
            onLoginSuccess(data);
            onClose();
          }, 1500);
        } else {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <span className="leaf">✿</span>
            <span>Leeya Herbals</span>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Join Our Community'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create your account to get started'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required={!isLogin}
                className="auth-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              className="auth-input"
            />
            {!isLogin && (
              <div className="password-requirements">
                <div className={`requirement ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
                  {passwordValidation.minLength ? '✓' : '✗'} At least 5 characters
                </div>
                <div className={`requirement ${passwordValidation.hasUppercase ? 'valid' : 'invalid'}`}>
                  {passwordValidation.hasUppercase ? '✓' : '✗'} One uppercase letter
                </div>
                <div className={`requirement ${passwordValidation.hasDigit ? 'valid' : 'invalid'}`}>
                  {passwordValidation.hasDigit ? '✓' : '✗'} One digit
                </div>
                <div className={`requirement ${passwordValidation.hasSpecialChar ? 'valid' : 'invalid'}`}>
                  {passwordValidation.hasSpecialChar ? '✓' : '✗'} One special character (@, #, $, etc.)
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isLogin}
                className="auth-input"
              />
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="auth-toggle-btn"
              onClick={toggleMode}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-auth">
          <button className="social-btn google">
            <span>🔍</span>
            Continue with Google
          </button>
          <button className="social-btn facebook">
            <span>📘</span>
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
