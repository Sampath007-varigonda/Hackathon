const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { getDb } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
// UUID generation without external package

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/certificates');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG) and PDF files are allowed'));
    }
  }
});

// Generate unique request ID
const generateRequestId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `REQ-${timestamp}-${random}`;
};

// Create certification request (User submits request)
router.post('/', authenticate, upload.single('certificate'), (req, res) => {
  const { name, issuer, issue_date, expiration_date, notes } = req.body;

  if (!name || !issuer || !issue_date) {
    return res.status(400).json({ error: 'Name, issuer, and issue date are required' });
  }

  const db = getDb();
  const requestId = generateRequestId();
  const certificateFile = req.file ? `/uploads/certificates/${req.file.filename}` : null;

  db.run(
    `INSERT INTO certification_requests 
     (request_id, user_id, name, issuer, issue_date, expiration_date, certificate_file, notes, approval_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [requestId, req.user.id, name, issuer, issue_date, expiration_date || null, certificateFile, notes || null, 'pending'],
    function(err) {
      if (err) {
        // Delete uploaded file if database insert fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: 'Error creating certification request' });
      }

      db.get('SELECT * FROM certification_requests WHERE id = ?', [this.lastID], (err, request) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching request' });
        }
        res.status(201).json({
          ...request,
          message: 'Certification request submitted successfully. Waiting for admin approval.'
        });
      });
    }
  );
});

// Get all requests (User sees their own, Admin sees all)
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT cr.*, u.username, u.email,
             a.username as approved_by_username
      FROM certification_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN users a ON cr.approved_by = a.id
      ORDER BY cr.created_at DESC
    `;
    params = [];
  } else {
    query = `
      SELECT cr.*, u.username, u.email
      FROM certification_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      WHERE cr.user_id = ?
      ORDER BY cr.created_at DESC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(requests);
  });
});

// Get pending requests (Admin only)
router.get('/pending', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT cr.*, u.username, u.email
    FROM certification_requests cr
    LEFT JOIN users u ON cr.user_id = u.id
    WHERE cr.approval_status = 'pending'
    ORDER BY cr.created_at ASC
  `, [], (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(requests);
  });
});

// Get request by ID
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT cr.*, u.username, u.email,
             a.username as approved_by_username
      FROM certification_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN users a ON cr.approved_by = a.id
      WHERE cr.id = ?
    `;
    params = [id];
  } else {
    query = `
      SELECT cr.*, u.username, u.email
      FROM certification_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      WHERE cr.id = ? AND cr.user_id = ?
    `;
    params = [id, req.user.id];
  }

  db.get(query, params, (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  });
});

// Approve request (Admin only)
router.post('/:id/approve', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  // Get the request
  db.get('SELECT * FROM certification_requests WHERE id = ?', [id], (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (request.approval_status !== 'pending') {
      return res.status(400).json({ error: 'Request is not pending' });
    }

    // Update request status
    db.run(
      `UPDATE certification_requests 
       SET approval_status = 'approved', 
           approved_by = ?, 
           approved_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.user.id, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error approving request' });
        }

        // Create certification from approved request
        // First check if certification with this request_id already exists
        db.get('SELECT id FROM certifications WHERE request_id = ?', [request.request_id], (checkErr, existing) => {
          if (checkErr) {
            console.error('Error checking existing certification:', checkErr);
            // Rollback request approval
            db.run(
              'UPDATE certification_requests SET approval_status = ? WHERE id = ?',
              ['pending', id]
            );
            return res.status(500).json({ 
              error: 'Error checking existing certification: ' + checkErr.message 
            });
          }

          if (existing) {
            // Certification already exists, just update the request status
            console.log('Certification already exists for request_id:', request.request_id);
            db.get('SELECT * FROM certification_requests WHERE id = ?', [id], (err, updatedRequest) => {
              if (err) {
                return res.status(500).json({ error: 'Error fetching request' });
              }
              return res.json({
                ...updatedRequest,
                message: 'Request already approved. Certification exists.'
              });
            });
            return;
          }

          // Insert new certification
          db.run(
            `INSERT INTO certifications 
             (user_id, name, issuer, issue_date, expiration_date, certificate_file, notes, status, request_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              request.user_id,
              request.name,
              request.issuer,
              request.issue_date,
              request.expiration_date || null,
              request.certificate_file || null,
              request.notes || null,
              'active',
              request.request_id
            ],
            function(err) {
              if (err) {
                console.error('Error creating certification:', err);
                console.error('Error details:', err.message);
                console.error('Request data:', {
                  user_id: request.user_id,
                  name: request.name,
                  issuer: request.issuer,
                  issue_date: request.issue_date,
                  expiration_date: request.expiration_date,
                  certificate_file: request.certificate_file,
                  notes: request.notes,
                  request_id: request.request_id
                });
                
                // Rollback request approval
                db.run(
                  'UPDATE certification_requests SET approval_status = ? WHERE id = ?',
                  ['pending', id],
                  (rollbackErr) => {
                    if (rollbackErr) {
                      console.error('Error rolling back approval:', rollbackErr);
                    }
                  }
                );
                
                // Check for specific error types
                if (err.message && err.message.includes('UNIQUE constraint')) {
                  return res.status(500).json({ 
                    error: 'Certification with this request ID already exists. This request may have been approved already.' 
                  });
                }
                if (err.message && err.message.includes('no such column')) {
                  return res.status(500).json({ 
                    error: 'Database schema needs update. Please run: cd backend && node scripts/migrate-database.js' 
                  });
                }
                if (err.message && err.message.includes('NOT NULL constraint')) {
                  return res.status(500).json({ 
                    error: 'Missing required data: ' + err.message 
                  });
                }
                
                return res.status(500).json({ 
                  error: 'Error creating certification: ' + (err.message || 'Unknown error') 
                });
              }

              // Get updated request
              db.get('SELECT * FROM certification_requests WHERE id = ?', [id], (err, updatedRequest) => {
                if (err) {
                  return res.status(500).json({ error: 'Error fetching request' });
                }
                res.json({
                  ...updatedRequest,
                  message: 'Request approved and certification created successfully'
                });
              });
            }
          );
        });
      }
    );
  });
});

// Reject request (Admin only)
router.post('/:id/reject', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { rejection_reason } = req.body;

  // Get the request
  db.get('SELECT * FROM certification_requests WHERE id = ?', [id], (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (request.approval_status !== 'pending') {
      return res.status(400).json({ error: 'Request is not pending' });
    }

    // Update request status
    db.run(
      `UPDATE certification_requests 
       SET approval_status = 'rejected', 
           approved_by = ?, 
           approved_at = CURRENT_TIMESTAMP,
           rejection_reason = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [req.user.id, rejection_reason || 'Rejected by admin', id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error rejecting request' });
        }

        // Get updated request
        db.get('SELECT * FROM certification_requests WHERE id = ?', [id], (err, updatedRequest) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching request' });
          }
          res.json({
            ...updatedRequest,
            message: 'Request rejected successfully'
          });
        });
      }
    );
  });
});

// Delete request (User can delete their own pending requests, Admin can delete any)
router.delete('/:id', authenticate, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  // Get the request
  db.get('SELECT * FROM certification_requests WHERE id = ?', [id], (err, request) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && request.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow deletion of pending requests (unless admin)
    if (req.user.role !== 'admin' && request.approval_status !== 'pending') {
      return res.status(400).json({ error: 'Can only delete pending requests' });
    }

    // Delete certificate file if exists
    if (request.certificate_file) {
      const filePath = path.join(__dirname, '..', request.certificate_file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete request
    db.run('DELETE FROM certification_requests WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting request' });
      }
      res.json({ message: 'Request deleted successfully' });
    });
  });
});

module.exports = router;

