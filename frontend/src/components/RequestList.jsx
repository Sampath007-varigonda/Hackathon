import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import './RequestList.css';

function RequestList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/requests');
      setRequests(response.data);
    } catch (error) {
      setError('Failed to fetch requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await api.post(`/api/requests/${id}/approve`);
      alert(response.data.message || 'Request approved successfully!');
      fetchRequests();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to approve request';
      alert(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      await api.post(`/api/requests/${id}/reject`, { rejection_reason: reason });
      alert('Request rejected successfully!');
      fetchRequests();
    } catch (error) {
      alert('Failed to reject request');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await api.delete(`/api/requests/${id}`);
      setRequests(requests.filter(r => r.id !== id));
    } catch (error) {
      alert('Failed to delete request');
      console.error('Error:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending Approval</span>;
      case 'approved':
        return <span className="badge badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  const pendingRequests = requests.filter(r => r.approval_status === 'pending');
  const myRequests = user.role !== 'admin' ? requests : [];

  return (
    <div className="container">
      <div className="list-header">
        <h1>
          {user.role === 'admin' 
            ? 'Certification Requests' 
            : 'My Certification Requests'}
        </h1>
        <Link to="/requests/new" className="btn btn-primary">
          + Submit New Request
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {user.role === 'admin' && pendingRequests.length > 0 && (
        <div className="card alert-warning">
          <h2>⚠️ Pending Approval ({pendingRequests.length})</h2>
          <p>You have {pendingRequests.length} certification request(s) waiting for approval.</p>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card">
          <p className="empty-state">
            {user.role === 'admin' 
              ? 'No certification requests found.' 
              : 'No requests found. Submit your first certification request!'}
          </p>
          <Link to="/requests/new" className="btn btn-primary">
            Submit Request
          </Link>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div>
                  <h3>{request.name}</h3>
                  <p className="request-id">Request ID: {request.request_id}</p>
                </div>
                {getStatusBadge(request.approval_status)}
              </div>

              <div className="request-details">
                <p><strong>Issuer:</strong> {request.issuer}</p>
                <p><strong>Issue Date:</strong> {format(new Date(request.issue_date), 'MMM dd, yyyy')}</p>
                {request.expiration_date && (
                  <p><strong>Expiration:</strong> {format(new Date(request.expiration_date), 'MMM dd, yyyy')}</p>
                )}
                {request.notes && (
                  <p className="request-notes">{request.notes}</p>
                )}
                {user.role === 'admin' && (
                  <p className="request-user">
                    <strong>Submitted by:</strong> {request.username} ({request.email})
                  </p>
                )}
                {request.approval_status === 'rejected' && request.rejection_reason && (
                  <p className="rejection-reason">
                    <strong>Rejection Reason:</strong> {request.rejection_reason}
                  </p>
                )}
                {request.approval_status === 'approved' && request.approved_by_username && (
                  <p className="approval-info">
                    <strong>Approved by:</strong> {request.approved_by_username} on {format(new Date(request.approved_at), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>

              <div className="request-actions">
                {request.certificate_file && (
                  <a
                    href={`http://localhost:5000${request.certificate_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View Certificate
                  </a>
                )}
                {user.role === 'admin' && request.approval_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="btn btn-success"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="btn btn-danger"
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                {(request.approval_status === 'pending' || user.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestList;

