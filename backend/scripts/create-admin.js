const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs-extra');

const dbPath = path.join(__dirname, '../data/certifications.db');

// Ensure data directory exists
fs.ensureDirSync(path.dirname(dbPath));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
    process.exit(1);
  }
  console.log('Users table ready');
  
  // Check if any admin exists (@admin, !admin, or admin)
  db.get('SELECT * FROM users WHERE username IN (?, ?, ?) AND role = ?', ['@admin', '!admin', 'admin', 'admin'], (err, row) => {
    if (err) {
      console.error('Error checking admin:', err);
      process.exit(1);
    }
    
    if (row) {
      console.log('Admin user already exists');
      console.log('Username:', row.username);
      console.log('Email:', row.email);
      console.log('Role:', row.role);
      
      // Reset password for the existing admin
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, row.username],
        (err) => {
          if (err) {
            console.error('Error updating password:', err);
            process.exit(1);
          }
          console.log('\n✅ Admin password has been reset!');
          console.log(`Username: ${row.username}`);
          console.log('Password: admin123');
          console.log('\n⚠️ IMPORTANT: Use the username shown above to login!');
          db.close();
        }
      );
    } else {
      // Create admin user with @ prefix
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      const adminUsername = '@admin';
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [adminUsername, 'admin@example.com', hashedPassword, 'admin'],
        function(err) {
          if (err) {
            console.error('Error creating admin:', err);
            process.exit(1);
          }
          console.log('\n✅ Admin user created successfully!');
          console.log('Username: @admin');
          console.log('Password: admin123');
          console.log('Email: admin@example.com');
          console.log('Role: admin');
          console.log('\n⚠️ IMPORTANT: Use "@admin" (with @ symbol) as username to login!');
          db.close();
        }
      );
    }
  });
});


