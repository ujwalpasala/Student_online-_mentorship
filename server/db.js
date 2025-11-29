const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.resolve(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbFile);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS mentors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      expertise TEXT,
      phone TEXT,
      createdAt TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mentorId INTEGER,
      mentorName TEXT,
      studentEmail TEXT,
      studentName TEXT,
      date TEXT,
      time TEXT,
      status TEXT DEFAULT 'pending',
      createdAt TEXT,
      FOREIGN KEY(mentorId) REFERENCES mentors(id)
    )`);

    // seed mentors if empty
    db.get('SELECT COUNT(*) as c FROM mentors', (err, row) => {
      if (err) return console.error(err);
      if (row.c === 0) {
        const now = new Date().toISOString();
        const seedMentors = [
          ['Sai', 'sai@example.com', 'Web Development', '+1-555-3001', now],
          ['Rakesh', 'rakesh@example.com', 'Machine Learning', '+1-555-3003', now],
          ['Ujwal', 'ujwal@example.com', 'Software Engineering', '+1-555-3004', now],
        ];
        const stmt = db.prepare('INSERT INTO mentors (name,email,expertise,phone,createdAt) VALUES (?,?,?,?,?)');
        for (const m of seedMentors) stmt.run(m);
        stmt.finalize();
        console.log('Seeded mentors');
      }
    });

    // seed bookings if empty
    db.get('SELECT COUNT(*) as c FROM bookings', (err, row) => {
      if (err) return console.error(err);
      if (row.c === 0) {
        const seed = [
          [1, 'Sai', 'student1@example.com', 'John Student', '2025-12-01', '10:00', 'confirmed', new Date().toISOString()],
          [3, 'Ujwal', 'student2@example.com', 'Sarah Student', '2025-12-02', '14:00', 'pending', new Date().toISOString()],
        ];
        const stmt2 = db.prepare('INSERT INTO bookings (mentorId, mentorName, studentEmail, studentName, date, time, status, createdAt) VALUES (?,?,?,?,?,?,?,?)');
        for (const b of seed) stmt2.run(b);
        stmt2.finalize();
        console.log('Seeded bookings');
      }
    });
  });
}

module.exports = { db, init };
