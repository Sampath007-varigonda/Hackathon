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
  console.log('✅ Connected to database');
});

// Check all admin users
db.all('SELECT * FROM users WHERE role = ?', ['admin'], (err, admins) => {
  if (err) {
    console.error('Error checking admins:', err);
    db.close();
    process.exit(1);
  }

  console.log('\n📋 Current Admin Users in Database:');
  console.log('=====================================');
  
  if (admins.length === 0) {
    console.log('❌ No admin users found!');
    console.log('\n🔧 Creating admin user...');
    
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
        console.log('\n✅ Admin user created successfully!');
        console.log('=====================================');
        console.log('Username: @admin');
        console.log('Password: admin123');
        console.log('Email: admin@example.com');
        console.log('\n⚠️  IMPORTANT: Use "@admin" (with @ symbol) to login!');
        db.close();
      }
    );
  } else {
    admins.forEach((admin, index) => {
      console.log(`\nAdmin ${index + 1}:`);
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
    });
    
    console.log('\n🔧 Resetting password for all admin users...');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    let updated = 0;
    let total = admins.length;
    
    admins.forEach((admin) => {
      db.run(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, admin.username],
        (err) => {
          if (err) {
            console.error(`❌ Error updating ${admin.username}:`, err);
          } else {
            updated++;
            console.log(`✅ Password reset for: ${admin.username}`);
          }
          
          if (updated === total) {
            console.log('\n✅ All admin passwords have been reset!');
            console.log('=====================================');
            console.log('\n📝 Login Credentials:');
            admins.forEach((admin) => {
              console.log(`\nUsername: ${admin.username}`);
              console.log('Password: admin123');
            });
            console.log('\n⚠️  IMPORTANT: Use the EXACT username shown above (including @ or !) to login!');
            db.close();
          }
        }
      );
    });
  }
});

