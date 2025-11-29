const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireOwnerOrAdmin = (req, res, next) => {
  const db = getDb();
  const certificationId = req.params.id || req.body.certification_id;

  if (req.user.role === 'admin') {
    return next();
  }

  db.get(
    'SELECT user_id FROM certifications WHERE id = ?',
    [certificationId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      if (row.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    }
  );
};

module.exports = {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin,
  JWT_SECRET
};




