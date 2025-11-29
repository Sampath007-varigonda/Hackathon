import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          📜 Certification Tracker
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/certifications" className="navbar-link">
            {user.role === 'admin' ? 'All Certifications' : 'My Certifications'}
          </Link>
          <Link to="/requests" className="navbar-link">
            {user.role === 'admin' ? 'Requests' : 'My Requests'}
          </Link>
          <div className="navbar-user">
            <span className="navbar-username">
              {user.username} {user.role === 'admin' && '(Admin)'}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

