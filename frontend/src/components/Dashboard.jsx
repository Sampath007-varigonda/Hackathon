import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format, differenceInDays, isPast, isAfter } from 'date-fns';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
    pendingRequests: 0
  });
  const [expiringCertifications, setExpiringCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certificationsRes, expiringRes, requestsRes] = await Promise.all([
        axios.get('/api/certifications'),
        axios.get('/api/certifications/expiring/soon'),
        axios.get('/api/requests')
      ]);

      const certifications = certificationsRes.data;
      const expiring = expiringRes.data;
      const requests = requestsRes.data;

      const now = new Date();
      const stats = {
        total: certifications.length,
        active: certifications.filter(c => c.status === 'active').length,
        expiring: expiring.length,
        expired: certifications.filter(c => {
          if (!c.expiration_date) return false;
          return isPast(new Date(c.expiration_date));
        }).length,
        pendingRequests: user.role === 'admin' 
          ? requests.filter(r => r.approval_status === 'pending').length
          : requests.filter(r => r.approval_status === 'pending' && r.user_id === user.id).length
      };

      setStats(stats);
      setExpiringCertifications(expiring);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null;
    const days = differenceInDays(new Date(expirationDate), new Date());
    return days;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.username}!</h1>
        <Link 
          to={user.role === 'admin' ? '/certifications/new' : '/requests/new'} 
          className="btn btn-primary"
        >
          + {user.role === 'admin' ? 'Add New Certification' : 'Submit Request'}
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Certifications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.active}</h3>
          <p>Active Certifications</p>
        </div>
        <div className="stat-card stat-warning">
          <h3>{stats.expiring}</h3>
          <p>Expiring Soon (30 days)</p>
        </div>
        <div className="stat-card stat-danger">
          <h3>{stats.expired}</h3>
          <p>Expired Certifications</p>
        </div>
        {stats.pendingRequests > 0 && (
          <div className="stat-card stat-warning">
            <h3>{stats.pendingRequests}</h3>
            <p>{user.role === 'admin' ? 'Pending Requests' : 'My Pending Requests'}</p>
          </div>
        )}
      </div>

      {expiringCertifications.length > 0 && (
        <div className="card">
          <h2>⚠️ Certifications Expiring Soon</h2>
          <p className="section-subtitle">
            These certifications will expire within the next 30 days
          </p>
          <div className="expiring-list">
            {expiringCertifications.map((cert) => {
              const daysLeft = getDaysUntilExpiration(cert.expiration_date);
              return (
                <div key={cert.id} className="expiring-item">
                  <div className="expiring-info">
                    <h4>{cert.name}</h4>
                    <p className="expiring-issuer">Issued by: {cert.issuer}</p>
                    <p className="expiring-date">
                      Expires: {format(new Date(cert.expiration_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="expiring-action">
                    <span className={`badge ${daysLeft <= 7 ? 'badge-danger' : 'badge-warning'}`}>
                      {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                    </span>
                    <Link
                      to={`/certifications/edit/${cert.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Renew
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/certifications" className="action-card">
            <span className="action-icon">📋</span>
            <h3>View All Certifications</h3>
            <p>Manage and view all your certifications</p>
          </Link>
          <Link 
            to={user.role === 'admin' ? '/certifications/new' : '/requests/new'} 
            className="action-card"
          >
            <span className="action-icon">➕</span>
            <h3>{user.role === 'admin' ? 'Add Certification' : 'Submit Request'}</h3>
            <p>{user.role === 'admin' 
              ? 'Record a new professional certification' 
              : 'Submit a new certification request for approval'}</p>
          </Link>
          {user.role !== 'admin' && (
            <Link to="/requests" className="action-card">
              <span className="action-icon">📝</span>
              <h3>My Requests</h3>
              <p>View and track your certification requests</p>
            </Link>
          )}
          {user.role === 'admin' && (
            <Link to="/requests" className="action-card admin-card">
              <span className="action-icon">✅</span>
              <h3>Approve Requests</h3>
              <p>Review and approve certification requests</p>
            </Link>
          )}
          {user.role === 'admin' && (
            <div className="action-card admin-card">
              <span className="action-icon">👑</span>
              <h3>Admin Panel</h3>
              <p>Manage all users and certifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

