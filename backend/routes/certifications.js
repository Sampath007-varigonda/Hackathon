const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { getDb } = require('../config/database');
const { authenticate, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');

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

// Get all certifications (admin sees all, user sees only their own)
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT c.*, u.username, u.email 
      FROM certifications c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.expiration_date ASC, c.created_at DESC
    `;
    params = [];
  } else {
    query = `
      SELECT * FROM certifications 
      WHERE user_id = ? 
      ORDER BY expiration_date ASC, created_at DESC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, certifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(certifications);
  });
});

// Get certification by ID
router.get('/:id', authenticate, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  let query;
  let params;

  if (req.user.role === 'admin') {
    query = `
      SELECT c.*, u.username, u.email 
      FROM certifications c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    params = [id];
  } else {
    query = 'SELECT * FROM certifications WHERE id = ? AND user_id = ?';
    params = [id, req.user.id];
  }

  db.get(query, params, (err, certification) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json(certification);
  });
});

// Create certification (Admin can create directly, users should use requests)
router.post('/', authenticate, upload.single('certificate'), (req, res) => {
  // Only admin can create certifications directly
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Users must submit certification requests. Please use /api/requests endpoint.' 
    });
  }

  const { name, issuer, issue_date, expiration_date, notes } = req.body;

  if (!name || !issuer || !issue_date) {
    return res.status(400).json({ error: 'Name, issuer, and issue date are required' });
  }

  const db = getDb();
  const certificateFile = req.file ? `/uploads/certificates/${req.file.filename}` : null;

  db.run(
    `INSERT INTO certifications 
     (user_id, name, issuer, issue_date, expiration_date, certificate_file, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, name, issuer, issue_date, expiration_date || null, certificateFile, notes || null, 'active'],
    function(err) {
      if (err) {
        // Delete uploaded file if database insert fails
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: 'Error creating certification' });
      }

      db.get('SELECT * FROM certifications WHERE id = ?', [this.lastID], (err, certification) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching certification' });
        }
        res.status(201).json(certification);
      });
    }
  );
});

// Update certification
router.put('/:id', authenticate, requireOwnerOrAdmin, upload.single('certificate'), (req, res) => {
  const { id } = req.params;
  const { name, issuer, issue_date, expiration_date, notes, status } = req.body;
  const db = getDb();

  // Get existing certification
  db.get('SELECT * FROM certifications WHERE id = ?', [id], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!existing) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    let certificateFile = existing.certificate_file;
    
    // If new file uploaded, delete old one and use new path
    if (req.file) {
      if (existing.certificate_file) {
        const oldFilePath = path.join(__dirname, '..', existing.certificate_file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      certificateFile = `/uploads/certificates/${req.file.filename}`;
    }

    db.run(
      `UPDATE certifications 
       SET name = ?, issuer = ?, issue_date = ?, expiration_date = ?, 
           certificate_file = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name || existing.name,
        issuer || existing.issuer,
        issue_date || existing.issue_date,
        expiration_date !== undefined ? expiration_date : existing.expiration_date,
        certificateFile,
        notes !== undefined ? notes : existing.notes,
        status || existing.status,
        id
      ],
      function(err) {
        if (err) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(500).json({ error: 'Error updating certification' });
        }

        db.get('SELECT * FROM certifications WHERE id = ?', [id], (err, certification) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching certification' });
          }
          res.json(certification);
        });
      }
    );
  });
});

// Delete certification
router.delete('/:id', authenticate, requireOwnerOrAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.get('SELECT * FROM certifications WHERE id = ?', [id], (err, certification) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    // Delete certificate file if exists
    if (certification.certificate_file) {
      const filePath = path.join(__dirname, '..', certification.certificate_file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.run('DELETE FROM certifications WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting certification' });
      }
      res.json({ message: 'Certification deleted successfully' });
    });
  });
});

// Get expiring certifications (within next 30 days)
router.get('/expiring/soon', authenticate, (req, res) => {
  const db = getDb();
  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT c.*, u.username, u.email 
      FROM certifications c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.expiration_date IS NOT NULL 
      AND c.expiration_date BETWEEN date('now') AND date('now', '+30 days')
      AND c.status = 'active'
      ORDER BY c.expiration_date ASC
    `;
    params = [];
  } else {
    query = `
      SELECT * FROM certifications 
      WHERE user_id = ? 
      AND expiration_date IS NOT NULL 
      AND expiration_date BETWEEN date('now') AND date('now', '+30 days')
      AND status = 'active'
      ORDER BY expiration_date ASC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, certifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(certifications);
  });
});

module.exports = router;

