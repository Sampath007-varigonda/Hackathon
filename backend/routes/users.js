const express = require('express');
const { getDb } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  db.all(
    'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(users);
    }
  );
});

// Get user by ID
router.get('/:id', authenticate, requireAdmin, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  db.get(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Get user's certifications (admin can view any user's certifications)
router.get('/:id/certifications', authenticate, (req, res) => {
  const db = getDb();
  const { id } = req.params;

  // Only admin can view other users' certifications
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.all(
    'SELECT * FROM certifications WHERE user_id = ? ORDER BY expiration_date ASC, created_at DESC',
    [id],
    (err, certifications) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(certifications);
    }
  );
});

module.exports = router;




