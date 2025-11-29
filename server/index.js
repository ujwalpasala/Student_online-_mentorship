const express = require('express');
const cors = require('cors');
const { db, init } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

init();

// mentors CRUD
app.get('/api/mentors', (req, res) => {
  db.all('SELECT * FROM mentors ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/mentors/:id', (req, res) => {
  db.get('SELECT * FROM mentors WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Mentor not found' });
    res.json(row);
  });
});

app.post('/api/mentors', (req, res) => {
  const { name, email, expertise, phone } = req.body;
  const createdAt = new Date().toISOString();
  db.run('INSERT INTO mentors (name,email,expertise,phone,createdAt) VALUES (?,?,?,?,?)', [name, email, expertise, phone, createdAt], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM mentors WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

app.put('/api/mentors/:id', (req, res) => {
  const { name, email, expertise, phone } = req.body;
  db.run('UPDATE mentors SET name=?, email=?, expertise=?, phone=? WHERE id=?', [name, email, expertise, phone, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM mentors WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

app.delete('/api/mentors/:id', (req, res) => {
  db.run('DELETE FROM mentors WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

// bookings CRUD
app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/bookings', (req, res) => {
  const { mentorId, mentorName, studentEmail, studentName, date, time } = req.body;
  const createdAt = new Date().toISOString();
  db.run('INSERT INTO bookings (mentorId, mentorName, studentEmail, studentName, date, time, status, createdAt) VALUES (?,?,?,?,?,?,?,?)', [mentorId, mentorName, studentEmail, studentName, date, time, 'pending', createdAt], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM bookings WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

app.patch('/api/bookings/:id', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE bookings SET status=? WHERE id=?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

app.delete('/api/bookings/:id', (req, res) => {
  db.run('DELETE FROM bookings WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Demo API running on http://localhost:${PORT}`);
});
