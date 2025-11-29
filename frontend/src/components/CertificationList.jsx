import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format, differenceInDays, isPast } from 'date-fns';
import './CertificationList.css';

function CertificationList() {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await axios.get('/api/certifications');
      setCertifications(response.data);
    } catch (error) {
      setError('Failed to fetch certifications');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      await axios.delete(`/api/certifications/${id}`);
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (error) {
      alert('Failed to delete certification');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (cert) => {
    if (cert.status !== 'active') {
      return <span className="badge badge-info">{cert.status}</span>;
    }

    if (!cert.expiration_date) {
      return <span className="badge badge-success">No Expiration</span>;
    }

    const expirationDate = new Date(cert.expiration_date);
    const daysLeft = differenceInDays(expirationDate, new Date());

    if (isPast(expirationDate)) {
      return <span className="badge badge-danger">Expired</span>;
    } else if (daysLeft <= 30) {
      return <span className="badge badge-warning">{daysLeft} days left</span>;
    } else {
      return <span className="badge badge-success">Active</span>;
    }
  };

  if (loading) {
    return <div className="loading">Loading certifications...</div>;
  }

  return (
    <div className="container">
      <div className="list-header">
        <h1>{user.role === 'admin' ? 'All Certifications' : 'My Certifications'}</h1>
        <Link to="/certifications/new" className="btn btn-primary">
          + Add New Certification
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {certifications.length === 0 ? (
        <div className="card">
          <p className="empty-state">No certifications found. Add your first certification to get started!</p>
          <Link to="/certifications/new" className="btn btn-primary">
            Add Certification
          </Link>
        </div>
      ) : (
        <div className="certifications-grid">
          {certifications.map((cert) => (
            <div key={cert.id} className="certification-card">
              <div className="cert-header">
                <h3>{cert.name}</h3>
                {getStatusBadge(cert)}
              </div>
              
              <div className="cert-details">
                <p className="cert-issuer">
                  <strong>Issuer:</strong> {cert.issuer}
                </p>
                <p className="cert-date">
                  <strong>Issue Date:</strong> {format(new Date(cert.issue_date), 'MMM dd, yyyy')}
                </p>
                {cert.expiration_date && (
                  <p className="cert-expiration">
                    <strong>Expiration:</strong> {format(new Date(cert.expiration_date), 'MMM dd, yyyy')}
                  </p>
                )}
                {cert.notes && (
                  <p className="cert-notes">{cert.notes}</p>
                )}
                {user.role === 'admin' && cert.username && (
                  <p className="cert-user">
                    <strong>User:</strong> {cert.username} ({cert.email})
                  </p>
                )}
              </div>

              <div className="cert-actions">
                {cert.certificate_file && (
                  <a
                    href={`http://localhost:5000${cert.certificate_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View Certificate
                  </a>
                )}
                <Link
                  to={`/certifications/edit/${cert.id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CertificationList;




