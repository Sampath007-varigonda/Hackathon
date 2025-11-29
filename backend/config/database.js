const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

const dbPath = path.join(__dirname, '../data/certifications.db');
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure directories exist
fs.ensureDirSync(path.dirname(dbPath));
fs.ensureDirSync(uploadsDir);

let db;

const init = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
      createTables();
      // Wait a bit for tables to be created before creating admin
      setTimeout(() => {
        createDefaultAdmin();
        resolve();
      }, 100);
    });
  });
};

const createTables = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Certifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      issue_date DATE NOT NULL,
      expiration_date DATE,
      certificate_file TEXT,
      status TEXT DEFAULT 'active',
      notes TEXT,
      request_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating certifications table:', err);
    } else {
      // Check if request_id column exists, if not add it
      setTimeout(() => {
        db.all("PRAGMA table_info(certifications)", (err, columns) => {
          if (err) {
            console.error('Error checking table info:', err);
            return;
          }
          if (columns) {
            const hasRequestId = columns.some(col => col.name === 'request_id');
            if (!hasRequestId) {
              console.log('Adding request_id column to certifications table...');
              db.run('ALTER TABLE certifications ADD COLUMN request_id TEXT', (err) => {
                if (err) {
                  // If unique constraint fails, try without unique
                  if (err.message.includes('UNIQUE')) {
                    db.run('ALTER TABLE certifications ADD COLUMN request_id TEXT', (err2) => {
                      if (err2) {
                        console.error('Error adding request_id column:', err2);
                      } else {
                        console.log('✅ Added request_id column to certifications table');
                      }
                    });
                  } else {
                    console.error('Error adding request_id column:', err);
                  }
                } else {
                  console.log('✅ Added request_id column to certifications table');
                }
              });
            } else {
              console.log('✅ request_id column already exists in certifications table');
            }
          }
        });
      }, 200);
    }
  });

  // Certification Requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS certification_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      issue_date DATE NOT NULL,
      expiration_date DATE,
      certificate_file TEXT,
      notes TEXT,
      approval_status TEXT DEFAULT 'pending',
      approved_by INTEGER,
      approved_at DATETIME,
      rejection_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (approved_by) REFERENCES users(id)
    )
  `);
};

const createDefaultAdmin = () => {
  const bcrypt = require('bcryptjs');
  const defaultPassword = bcrypt.hashSync('admin123', 10);
  const adminUsername = '@admin';
  
  // Check for existing admin (try @admin, !admin, or admin)
  db.get('SELECT * FROM users WHERE username IN (?, ?, ?) AND role = ?', ['@admin', '!admin', 'admin', 'admin'], (err, row) => {
    if (err) {
      console.error('Error checking admin user:', err);
      return;
    }
    if (!row) {
      // Create admin with @ prefix
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [adminUsername, 'admin@example.com', defaultPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('✅ Default admin user created (username: @admin, password: admin123)');
            console.log('Note: Admin usernames must start with @ or !');
          }
        }
      );
    } else {
      // Admin exists - reset password to ensure it works
      db.run(
        'UPDATE users SET password = ? WHERE username = ? AND role = ?',
        [defaultPassword, row.username, 'admin'],
        (err) => {
          if (err) {
            console.error('Error resetting admin password:', err);
          } else {
            console.log(`✅ Admin password reset (username: ${row.username}, password: admin123)`);
          }
        }
      );
    }
  });
};

const getDb = () => db;

const close = () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};

module.exports = {
  init,
  getDb,
  close
};

