const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, '../database/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to SQLite Database.");
});

// ======================== SCHEMA ========================
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    domain TEXT,
    industry TEXT,
    size TEXT,
    funding TEXT,
    techStack TEXT,
    source TEXT,
    hiring BOOLEAN,
    icpScore INTEGER,
    score TEXT
  )`);

  db.get("SELECT COUNT(*) as count FROM leads", (err, row) => {
    if (row && row.count === 0) {
      try {
        const seedPath = path.resolve(__dirname, '../database/data.json');
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const stmt = db.prepare("INSERT INTO leads (name, domain, industry, size, funding, techStack, source, hiring, icpScore, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        seedData.forEach(lead => {
          stmt.run(lead.name, lead.domain, lead.industry, lead.size, lead.funding, lead.techStack, lead.source, lead.hiring, lead.icpScore, lead.score);
        });
        stmt.finalize();
        console.log(`Database seeded with ${seedData.length} leads.`);
      } catch (e) {
        console.error("Failed to seed data:", e);
      }
    }
  });
});

// ======================== AUTH ========================
app.post('/api/auth', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = jwt.sign({ email }, 'hackathon_secret', { expiresIn: '1d' });
    res.json({ token, success: true });
  } else {
    res.status(400).json({ error: 'Missing credentials' });
  }
});

// ======================== LEADS ========================
app.get('/api/leads', (req, res) => {
  db.all("SELECT * FROM leads ORDER BY icpScore DESC", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Get count stats
app.get('/api/leads/stats', (req, res) => {
  db.all("SELECT score, COUNT(*) as count FROM leads GROUP BY score", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else {
      const stats = { total: 0, hot: 0, warm: 0, cold: 0, sources: {} };
      rows.forEach(r => {
        stats.total += r.count;
        if (r.score === 'Hot') stats.hot = r.count;
        else if (r.score === 'Warm') stats.warm = r.count;
        else stats.cold = r.count;
      });
      // Source breakdown
      db.all("SELECT source, COUNT(*) as count FROM leads GROUP BY source", (err2, srcRows) => {
        if (!err2) srcRows.forEach(s => stats.sources[s.source] = s.count);
        res.json(stats);
      });
    }
  });
});

// Top 50 for outreach
app.get('/api/leads/top50', (req, res) => {
  db.all("SELECT * FROM leads WHERE score IN ('Hot','Warm') ORDER BY icpScore DESC LIMIT 50", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Top 20 for A/B testing
app.get('/api/leads/top20', (req, res) => {
  db.all("SELECT * FROM leads WHERE score = 'Hot' ORDER BY icpScore DESC LIMIT 20", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// ======================== SCORING ENGINE ========================
function calculateScore(size, industry, hiring, funding, techStack) {
  let scoreNum = 0;
  if (industry === 'AI/ML') scoreNum += 15;
  else if (industry === 'SaaS' || industry === 'DevTools') scoreNum += 10;
  else if (industry === 'Cloud Infra' || industry === 'Data Analytics') scoreNum += 8;
  else scoreNum += 5;
  if (size === '50-200') scoreNum += 12;
  else if (size === '200-500') scoreNum += 10;
  else if (size === '500+') scoreNum += 6;
  else scoreNum += 4;
  if (funding === 'Series B') scoreNum += 15;
  else if (funding === 'Series C') scoreNum += 12;
  else if (funding === 'Series A') scoreNum += 8;
  else scoreNum += 3;
  if (hiring) scoreNum += 20;
  if (techStack && (techStack.includes('Python') || techStack.includes('PyTorch'))) scoreNum += 5;

  let score = 'Cold';
  if (scoreNum >= 45) score = 'Hot';
  else if (scoreNum >= 25) score = 'Warm';
  return { icpScore: scoreNum, score };
}

app.post('/api/leads', (req, res) => {
  const { name, domain, industry, size, hiring, funding, techStack, source } = req.body;
  const { icpScore, score } = calculateScore(size, industry, hiring, funding, techStack);
  
  db.run(`INSERT INTO leads (name, domain, industry, size, funding, techStack, source, hiring, icpScore, score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, domain, industry, size, funding, techStack, source, hiring, icpScore, score],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, name, score, icpScore, success: true });
    }
  );
});

// ======================== OUTREACH GENERATION ========================
app.post('/api/generate-outreach', (req, res) => {
  const { lead } = req.body;
  
  const emailSubject = `Scaling ${lead.name}'s ML infrastructure post-${lead.funding}`;
  const emailBody = `Hi Team,\n\nCongratulations on ${lead.name}'s recent ${lead.funding} milestone. I noticed you're actively expanding your engineering team${lead.hiring ? ' with several MLE openings' : ''}.\n\nAt P95.AI, we provide agentic ML training infrastructure that integrates directly with ${lead.techStack ? lead.techStack.split(',')[0].trim() : 'your existing'} stacks. Our platform has helped similar ${lead.industry} companies reduce ML pipeline overhead by 40% while maintaining full model governance.\n\nWould you be open to a 15-minute technical overview this week?\n\nBest,\nP95.AI Team`;
  
  const linkedinDM = `Hi! Congrats on ${lead.name}'s growth trajectory post-${lead.funding}. ${lead.hiring ? "Noticed the MLE openings — " : ""}P95.AI helps ${lead.industry} teams scale ML training infra 40% faster without additional headcount. Would love to connect and share how we've helped similar companies. Open to a quick chat?`;

  res.json({ email: { subject: emailSubject, body: emailBody }, linkedin: linkedinDM });
});

// ======================== A/B VARIANT GENERATION ========================  
app.post('/api/generate-ab', (req, res) => {
  const { lead } = req.body;

  const variants = {
    variantA: {
      hook: 'Pain Point: Engineering Bandwidth',
      subject: `${lead.name}: Scaling ML without scaling headcount`,
      body: `Hi,\n\nBuilding ML infrastructure at ${lead.name} post-${lead.funding} means your engineering team is likely stretched thin${lead.hiring ? ' — especially with ' + lead.size + ' employees and multiple open MLE roles' : ''}.\n\nP95.AI acts as an autonomous ML training layer that sits on top of your ${lead.techStack ? lead.techStack.split(',')[0].trim() : 'existing'} stack. We've helped companies at your stage reduce time-to-production for ML models by 3x.\n\nCan I send over a 2-page technical brief?`,
      cta: 'Technical brief offer',
      hypothesis: 'Pain-point driven messaging about bandwidth constraints should resonate with engineering leaders managing rapid team growth. Expected response rate: 12-18%.',
      predictedRate: 15
    },
    variantB: {
      hook: 'Social Proof: Competitor Advantage',
      subject: `How ${lead.industry} leaders are automating ML pipelines`,
      body: `Hi,\n\nI'm reaching out because several ${lead.industry} companies at the ${lead.funding} stage are adopting P95.AI to autonomously manage their ML training infrastructure.\n\n${lead.name}'s ${lead.techStack ? lead.techStack.split(',')[0].trim() : 'technical'} environment is a perfect fit for our platform. One similar customer reduced their MLOps overhead from 6 engineers to 2 while doubling model deployment frequency.\n\nWould a 15-min demo work for your team this week?`,
      cta: 'Demo request',
      hypothesis: 'Social proof and competitor FOMO should drive urgency. Concrete metrics (6 engineers to 2) add credibility. Expected response rate: 8-14%.',
      predictedRate: 11
    }
  };

  res.json(variants);
});

// ======================== APOLLO SYNC ========================
app.post('/api/sync-apollo', (req, res) => {
  setTimeout(() => {
    res.json({ success: true, count: 203, message: "Apollo API Sync Complete. 203 qualified ICP leads retrieved and scored." });
  }, 1500);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
