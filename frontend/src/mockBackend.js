import axios from 'axios';
import seedData from './data.json';

// In-memory database with auto-assigned IDs if missing
let leads = seedData.map((l, idx) => ({ 
  id: l.id || (idx + 1), 
  ...l 
}));

// Delay helper to simulate network latency
const delay = (ms, data) => new Promise(resolve => setTimeout(() => resolve({ data }), ms));

// Intercept Axios HTTP calls
const originalGet = axios.get;
const originalPost = axios.post;

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

// ======================== MOCK GET REQUESTS ========================
axios.get = async (url, config) => {
  if (url === '/api/leads') {
    return delay(200, [...leads].sort((a, b) => b.icpScore - a.icpScore));
  }
  
  if (url === '/api/leads/stats') {
    const stats = { total: leads.length, hot: 0, warm: 0, cold: 0, sources: {} };
    leads.forEach(r => {
      if (r.score === 'Hot') stats.hot++;
      else if (r.score === 'Warm') stats.warm++;
      else stats.cold++;
      if (r.source) stats.sources[r.source] = (stats.sources[r.source] || 0) + 1;
    });
    return delay(100, stats);
  }
  
  if (url === '/api/leads/top50') {
    const top = leads.filter(l => l.score === 'Hot' || l.score === 'Warm')
                     .sort((a, b) => b.icpScore - a.icpScore).slice(0, 50);
    return delay(200, top);
  }
  
  if (url === '/api/leads/top20') {
    const top = leads.filter(l => l.score === 'Hot')
                     .sort((a, b) => b.icpScore - a.icpScore).slice(0, 20);
    return delay(200, top);
  }

  // Fallback
  return originalGet(url, config);
};

// ======================== MOCK POST REQUESTS ========================
axios.post = async (url, data, config) => {
  if (url === '/api/auth') {
    return delay(400, { token: 'mock_jwt_token_123', success: true });
  }

  if (url === '/api/sync-apollo') {
    return delay(1500, { success: true, count: 203, message: "Apollo API Sync Complete. 203 qualified ICP leads retrieved and scored." });
  }

  if (url === '/api/leads') {
    const { name, domain, industry, size, hiring, funding, techStack, source } = data;
    const { icpScore, score } = calculateScore(size, industry, hiring, funding, techStack);
    const newLead = { id: leads.length + 1, name, domain, industry, size, funding, techStack, source, hiring, icpScore, score };
    leads.push(newLead);
    return delay(300, { id: newLead.id, name, score, icpScore, success: true });
  }

  if (url === '/api/generate-outreach') {
    const { lead, sender } = data;
    const senderName = sender?.name || 'P95.AI Team';
    const senderRole = sender?.role || 'Growth Lead';
    const senderCompany = sender?.company || 'P95.AI';
    const senderEmail = sender?.email || 'team@p95.ai';
    
    const emailSubject = `Scaling ${lead.name}'s ML infrastructure post-${lead.funding}`;
    const emailBody = `Hi Team,\n\nCongratulations on ${lead.name}'s recent ${lead.funding} milestone. I noticed you're actively expanding your engineering team${lead.hiring ? ' with several MLE openings' : ''}.\n\nAt ${senderCompany}, we provide agentic ML training infrastructure that integrates directly with ${lead.techStack ? (lead.techStack.includes(',') ? lead.techStack.split(',')[0].trim() : lead.techStack) : 'your existing'} stacks. Our platform has helped similar ${lead.industry} companies reduce ML pipeline overhead by 40% while maintaining full model governance.\n\nWould you be open to a 15-minute technical overview this week?\n\nBest,\n${senderName}\n${senderRole}, ${senderCompany}\n${senderEmail}`;
    
    const linkedinDM = `Hi! I'm ${senderName} from ${senderCompany}. Congrats on ${lead.name}'s growth trajectory post-${lead.funding}. ${lead.hiring ? "Noticed the MLE openings — " : ""}${senderCompany} helps ${lead.industry} teams scale ML training infra 40% faster without additional headcount. Would love to connect. Open to a quick chat?`;

    return delay(600, { email: { subject: emailSubject, body: emailBody }, linkedin: linkedinDM });
  }

  if (url === '/api/generate-ab') {
    const { lead, sender } = data;
    const senderName = sender?.name || 'P95.AI Team';
    const senderCompany = sender?.company || 'P95.AI';

    const variants = {
      variantA: {
        hook: 'Pain Point: Engineering Bandwidth',
        subject: `${lead.name}: Scaling ML without scaling headcount`,
        body: `Hi,\n\nBuilding ML infrastructure at ${lead.name} post-${lead.funding} means your engineering team is likely stretched thin${lead.hiring ? ' — especially with ' + lead.size + ' employees and multiple open MLE roles' : ''}.\n\n${senderCompany} acts as an autonomous ML training layer that sits on top of your ${lead.techStack ? (lead.techStack.includes(',') ? lead.techStack.split(',')[0].trim() : lead.techStack) : 'existing'} stack. We've helped companies at your stage reduce time-to-production for ML models by 3x.\n\nCan I send over a 2-page technical brief?\n\n— ${senderName}, ${senderCompany}`,
        cta: 'Technical brief offer',
        hypothesis: 'Pain-point driven messaging about bandwidth constraints should resonate with engineering leaders managing rapid team growth. Expected response rate: 12-18%.',
        predictedRate: 15
      },
      variantB: {
        hook: 'Social Proof: Competitor Advantage',
        subject: `How ${lead.industry} leaders are automating ML pipelines`,
        body: `Hi,\n\nI'm reaching out because several ${lead.industry} companies at the ${lead.funding} stage are adopting ${senderCompany} to autonomously manage their ML training infrastructure.\n\n${lead.name}'s ${lead.techStack ? (lead.techStack.includes(',') ? lead.techStack.split(',')[0].trim() : lead.techStack) : 'technical'} environment is a perfect fit for our platform. One similar customer reduced their MLOps overhead from 6 engineers to 2 while doubling model deployment frequency.\n\nWould a 15-min demo work for your team this week?\n\n— ${senderName}, ${senderCompany}`,
        cta: 'Demo request',
        hypothesis: 'Social proof and competitor FOMO should drive urgency. Concrete metrics (6 engineers to 2) add credibility. Expected response rate: 8-14%.',
        predictedRate: 11
      }
    };
    return delay(600, variants);
  }

  // Fallback
  return originalPost(url, data, config);
};
