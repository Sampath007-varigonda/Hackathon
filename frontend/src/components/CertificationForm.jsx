import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
import './CertificationForm.css';

function CertificationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    expiration_date: '',
    notes: '',
    status: 'active'
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCertification();
    }
  }, [id]);

  const fetchCertification = async () => {
    try {
      const response = await api.get(`/api/certifications/${id}`);
      const cert = response.data;
      setFormData({
        name: cert.name || '',
        issuer: cert.issuer || '',
        issue_date: cert.issue_date ? cert.issue_date.split('T')[0] : '',
        expiration_date: cert.expiration_date ? cert.expiration_date.split('T')[0] : '',
        notes: cert.notes || '',
        status: cert.status || 'active'
      });
      if (cert.certificate_file) {
        setExistingFile(cert.certificate_file);
      }
    } catch (error) {
      setError('Failed to fetch certification');
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCertificateFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('issuer', formData.issuer);
      submitData.append('issue_date', formData.issue_date);
      submitData.append('expiration_date', formData.expiration_date || '');
      submitData.append('notes', formData.notes || '');
      submitData.append('status', formData.status);

      if (certificateFile) {
        submitData.append('certificate', certificateFile);
      }

      if (isEdit) {
        await api.put(`/api/certifications/${id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Certification updated successfully!');
        setTimeout(() => {
          navigate('/certifications');
        }, 1500);
      } else {
        // Submit as request for regular users, direct creation for admin
        const endpoint = user?.role === 'admin' ? '/api/certifications' : '/api/requests';
        const redirectPath = user?.role === 'admin' ? '/certifications' : '/requests';
        
        await api.post(endpoint, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (user?.role === 'admin') {
          setSuccess('Certification created successfully!');
        } else {
          setSuccess('Certification request submitted! Waiting for admin approval.');
        }
        
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save certification');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-header">
        <h1>{isEdit ? 'Edit Certification' : 'Add New Certification'}</h1>
        <button onClick={() => navigate('/certifications')} className="btn btn-secondary">
          ← Back to List
        </button>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Certification Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>

          <div className="form-group">
            <label>Issuer *</label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              placeholder="e.g., Amazon Web Services"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Issue Date *</label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Expiration Date</label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                placeholder="Leave empty if no expiration"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="form-group">
            <label>Certificate File</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            {existingFile && !certificateFile && (
              <p className="file-info">
                Current file: <a href={`http://localhost:5000${existingFile}`} target="_blank" rel="noopener noreferrer">View</a>
              </p>
            )}
            {certificateFile && (
              <p className="file-info">New file selected: {certificateFile.name}</p>
            )}
            <small className="form-help">Accepted formats: JPEG, PNG, PDF (max 10MB)</small>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or information about this certification..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(user?.role === 'admin' ? '/certifications' : '/requests')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading 
                ? 'Saving...' 
                : isEdit 
                  ? 'Update Certification' 
                  : user?.role === 'admin'
                    ? 'Create Certification'
                    : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CertificationForm;

