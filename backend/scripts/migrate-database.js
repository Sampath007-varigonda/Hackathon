const sqlite3 = require('sqlite3').verbose();
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
  console.log('Connected to database for migration');
});

// Check if request_id column exists in certifications table
db.all("PRAGMA table_info(certifications)", (err, columns) => {
  if (err) {
    console.error('Error checking table info:', err);
    db.close();
    process.exit(1);
  }

  const hasRequestId = columns.some(col => col.name === 'request_id');

  if (!hasRequestId) {
    console.log('Adding request_id column to certifications table...');
    db.run(
      'ALTER TABLE certifications ADD COLUMN request_id TEXT UNIQUE',
      (err) => {
        if (err) {
          console.error('Error adding request_id column:', err);
          db.close();
          process.exit(1);
        }
        console.log('✅ Successfully added request_id column');
        db.close();
      }
    );
  } else {
    console.log('✅ request_id column already exists');
    db.close();
  }
});






