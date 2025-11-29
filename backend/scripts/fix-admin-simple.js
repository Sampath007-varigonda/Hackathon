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
  
  console.log('✅ Connected to database\n');
  
  // Delete ALL existing admin users first
  db.run('DELETE FROM users WHERE role = ?', ['admin'], (err) => {
    if (err) {
      console.error('Error deleting old admins:', err);
    } else {
      console.log('🧹 Cleaned up old admin users');
    }
    
    // Create fresh admin user
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const adminUsername = '@admin';
    
    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [adminUsername, 'admin@example.com', hashedPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('❌ Error creating admin:', err);
          db.close();
          process.exit(1);
        }
        
        console.log('\n✅✅✅ ADMIN USER CREATED SUCCESSFULLY! ✅✅✅\n');
        console.log('==========================================');
        console.log('Username: @admin');
        console.log('Password: admin123');
        console.log('==========================================\n');
        console.log('⚠️  IMPORTANT:');
        console.log('   1. Use "@admin" (with @ symbol) as username');
        console.log('   2. Use "admin123" as password');
        console.log('   3. Make sure you clicked "Admin Interface" button first\n');
        
        db.close();
      }
    );
  });
});


