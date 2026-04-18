const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const dbPath = path.resolve(__dirname, '../database/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to SQLite Database.");
});

// Setup Schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    industry TEXT,
    size TEXT,
    hiring BOOLEAN,
    score TEXT
  )`);

  // Simple seed mechanism for Hackathon
  db.get("SELECT COUNT(*) as count FROM leads", (err, row) => {
    if (row && row.count === 0) {
      try {
        const seedPath = path.resolve(__dirname, '../database/data.json');
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const stmt = db.prepare("INSERT INTO leads (name, industry, size, hiring, score) VALUES (?, ?, ?, ?, ?)");
        seedData.forEach(lead => {
          stmt.run(lead.name, lead.industry, lead.size, lead.hiring, lead.score);
        });
        stmt.finalize();
        console.log("Database seeded with sample data.");
      } catch (e) {
        console.error("Failed to seed data:", e);
      }
    }
  });
});

// Simple Auth Route
app.post('/api/auth', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = jwt.sign({ email }, 'hackathon_secret', { expiresIn: '1d' });
    res.json({ token, success: true });
  } else {
    res.status(400).json({ error: 'Missing credentials' });
  }
});

// Get Leads Route
app.get('/api/leads', (req, res) => {
  db.all("SELECT * FROM leads", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Scoring Engine Logic Hook
function calculateScore(size, industry, hiring) {
  let score = 0;
  if (industry.toLowerCase().includes('ai') || industry === 'SaaS') score += 10;
  if (size === '50-200' || size === '200-500') score += 10;
  if (hiring === true || hiring === 'true') score += 20;

  if (score >= 30) return 'Hot';
  if (score >= 10) return 'Warm';
  return 'Cold';
}

// Add Lead Route
app.post('/api/leads', (req, res) => {
  const { name, industry, size, hiring } = req.body;
  const score = calculateScore(size, industry, hiring);
  
  db.run(`INSERT INTO leads (name, industry, size, hiring, score) VALUES (?, ?, ?, ?, ?)`,
    [name, industry, size, hiring, score],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, name, score, success: true });
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
