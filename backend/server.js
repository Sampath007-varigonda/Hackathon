const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const certificationRoutes = require('./routes/certifications');
const userRoutes = require('./routes/users');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database
const db = require('./config/database');
db.init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

