import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [interfaceType, setInterfaceType] = useState(null); // 'user' or 'admin'
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate admin username format if admin interface selected
    if (interfaceType === 'admin') {
      if (!username.startsWith('@') && !username.startsWith('!')) {
        setError('Admin username must start with @ or !');
        return;
      }
    }
    
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Verify interface type matches user role
      if (interfaceType === 'admin' && result.user.role !== 'admin') {
        setError('This username is not an admin account');
        setLoading(false);
        return;
      }
      if (interfaceType === 'user' && result.user.role === 'admin') {
        setError('Please use Admin Interface for admin accounts');
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>📜 Certification Tracker</h1>
          <p className="auth-subtitle">Choose your interface to continue</p>
        </div>

        {!interfaceType ? (
          <div className="interface-selection">
            <button
              type="button"
              className="interface-btn user-interface"
              onClick={() => setInterfaceType('user')}
            >
              <div className="interface-icon">👤</div>
              <h2>User Interface</h2>
              <p>For regular users to submit and track certification requests</p>
            </button>

            <button
              type="button"
              className="interface-btn admin-interface"
              onClick={() => setInterfaceType('admin')}
            >
              <div className="interface-icon">👑</div>
              <h2>Admin Interface</h2>
              <p>For administrators to manage and approve requests</p>
              <small className="admin-note">Username must start with @ or !</small>
            </button>
          </div>
        ) : (
          <>
            <div className="interface-badge">
              <span className={`badge ${interfaceType === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {interfaceType === 'admin' ? '👑 Admin' : '👤 User'} Interface
              </span>
              <button
                type="button"
                className="btn-change-interface"
                onClick={() => {
                  setInterfaceType(null);
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
              >
                Change
              </button>
            </div>

            <h2 className="login-title">
              {interfaceType === 'admin' ? 'Admin Login' : 'User Login'}
            </h2>
            <p className="auth-subtitle">Welcome back! Please login to your account.</p>
            
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  {interfaceType === 'admin' ? 'Admin Username (starts with @ or !)' : 'Username or Email'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder={interfaceType === 'admin' ? '@admin or !admin' : 'Enter your username or email'}
                  className={interfaceType === 'admin' && username && !username.startsWith('@') && !username.startsWith('!') ? 'input-error' : ''}
                />
                {interfaceType === 'admin' && username && !username.startsWith('@') && !username.startsWith('!') && (
                  <small className="form-help error">Admin username must start with @ or !</small>
                )}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>

            {interfaceType === 'admin' && (
              <div className="auth-info">
                <p><strong>Admin Credentials:</strong></p>
                <p>Username: <code>@admin</code> or <code>!admin</code></p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;


