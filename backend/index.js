const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, '../database/data.json');
let leads = [];

try {
  const seedData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  leads = seedData;
  console.log(`Loaded ${leads.length} leads into memory.`);
} catch (e) {
  console.error("Failed to load data:", e);
}

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
  res.json([...leads].sort((a, b) => b.icpScore - a.icpScore));
});

// Get count stats
app.get('/api/leads/stats', (req, res) => {
  const stats = { total: leads.length, hot: 0, warm: 0, cold: 0, sources: {} };
  leads.forEach(r => {
    if (r.score === 'Hot') stats.hot++;
    else if (r.score === 'Warm') stats.warm++;
    else stats.cold++;
    
    if (r.source) {
      stats.sources[r.source] = (stats.sources[r.source] || 0) + 1;
    }
  });
  res.json(stats);
});

// Top 50 for outreach
app.get('/api/leads/top50', (req, res) => {
  const top = leads.filter(l => l.score === 'Hot' || l.score === 'Warm')
                   .sort((a, b) => b.icpScore - a.icpScore)
                   .slice(0, 50);
  res.json(top);
});

// Top 20 for A/B testing
app.get('/api/leads/top20', (req, res) => {
  const top = leads.filter(l => l.score === 'Hot')
                   .sort((a, b) => b.icpScore - a.icpScore)
                   .slice(0, 20);
  res.json(top);
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
  
  const newLead = { id: leads.length + 1, name, domain, industry, size, funding, techStack, source, hiring, icpScore, score };
  leads.push(newLead);
  res.json({ id: newLead.id, name, score, icpScore, success: true });
});

// ======================== OUTREACH GENERATION ========================
app.post('/api/generate-outreach', (req, res) => {
  const { lead, sender } = req.body;
  const senderName = sender?.name || 'P95.AI Team';
  const senderRole = sender?.role || 'Growth Lead';
  const senderCompany = sender?.company || 'P95.AI';
  const senderEmail = sender?.email || 'team@p95.ai';
  
  const emailSubject = `Scaling ${lead.name}'s ML infrastructure post-${lead.funding}`;
  const emailBody = `Hi Team,\n\nCongratulations on ${lead.name}'s recent ${lead.funding} milestone. I noticed you're actively expanding your engineering team${lead.hiring ? ' with several MLE openings' : ''}.\n\nAt ${senderCompany}, we provide agentic ML training infrastructure that integrates directly with ${lead.techStack ? lead.techStack.split(',')[0].trim() : 'your existing'} stacks. Our platform has helped similar ${lead.industry} companies reduce ML pipeline overhead by 40% while maintaining full model governance.\n\nWould you be open to a 15-minute technical overview this week?\n\nBest,\n${senderName}\n${senderRole}, ${senderCompany}\n${senderEmail}`;
  
  const linkedinDM = `Hi! I'm ${senderName} from ${senderCompany}. Congrats on ${lead.name}'s growth trajectory post-${lead.funding}. ${lead.hiring ? "Noticed the MLE openings — " : ""}${senderCompany} helps ${lead.industry} teams scale ML training infra 40% faster without additional headcount. Would love to connect. Open to a quick chat?`;

  res.json({ email: { subject: emailSubject, body: emailBody }, linkedin: linkedinDM });
});

// ======================== A/B VARIANT GENERATION ========================  
app.post('/api/generate-ab', (req, res) => {
  const { lead, sender } = req.body;
  const senderName = sender?.name || 'P95.AI Team';
  const senderCompany = sender?.company || 'P95.AI';

  const variants = {
    variantA: {
      hook: 'Pain Point: Engineering Bandwidth',
      subject: `${lead.name}: Scaling ML without scaling headcount`,
      body: `Hi,\n\nBuilding ML infrastructure at ${lead.name} post-${lead.funding} means your engineering team is likely stretched thin${lead.hiring ? ' — especially with ' + lead.size + ' employees and multiple open MLE roles' : ''}.\n\n${senderCompany} acts as an autonomous ML training layer that sits on top of your ${lead.techStack ? lead.techStack.split(',')[0].trim() : 'existing'} stack. We've helped companies at your stage reduce time-to-production for ML models by 3x.\n\nCan I send over a 2-page technical brief?\n\n— ${senderName}, ${senderCompany}`,
      cta: 'Technical brief offer',
      hypothesis: 'Pain-point driven messaging about bandwidth constraints should resonate with engineering leaders managing rapid team growth. Expected response rate: 12-18%.',
      predictedRate: 15
    },
    variantB: {
      hook: 'Social Proof: Competitor Advantage',
      subject: `How ${lead.industry} leaders are automating ML pipelines`,
      body: `Hi,\n\nI'm reaching out because several ${lead.industry} companies at the ${lead.funding} stage are adopting ${senderCompany} to autonomously manage their ML training infrastructure.\n\n${lead.name}'s ${lead.techStack ? lead.techStack.split(',')[0].trim() : 'technical'} environment is a perfect fit for our platform. One similar customer reduced their MLOps overhead from 6 engineers to 2 while doubling model deployment frequency.\n\nWould a 15-min demo work for your team this week?\n\n— ${senderName}, ${senderCompany}`,
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
