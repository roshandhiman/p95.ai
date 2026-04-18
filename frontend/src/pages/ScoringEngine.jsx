import { useState } from 'react';
import { Shield, Flame, Thermometer, Snowflake, Info } from 'lucide-react';

const scoringCriteria = [
  { factor: 'Industry Match', description: 'AI/ML companies receive maximum weight as primary ICP targets.', weights: { 'AI/ML': 15, 'SaaS': 10, 'DevTools': 10, 'Cloud Infra': 8, 'Data Analytics': 8, 'Other': 5 }, maxScore: 15 },
  { factor: 'Company Size', description: 'Series B sweet spot: 50-200 employees indicates growth velocity.', weights: { '50-200': 12, '200-500': 10, '500+': 6, '1-50': 4 }, maxScore: 12 },
  { factor: 'Funding Stage', description: 'Series B companies have budget + urgency to scale ML infra.', weights: { 'Series B': 15, 'Series C': 12, 'Series A': 8, 'Other': 3 }, maxScore: 15 },
  { factor: 'Hiring Signal', description: 'Actively hiring MLEs is the strongest buy intent signal.', weights: { 'Yes': 20, 'No': 0 }, maxScore: 20 },
  { factor: 'Tech Stack Affinity', description: 'Python/PyTorch users have highest adoption potential.', weights: { 'Python/PyTorch': 5, 'Other': 0 }, maxScore: 5 },
];

const tiers = [
  { name: 'Hot', range: '45-67', color: 'red', icon: <Flame size={20} />, desc: 'Immediate outreach priority. Custom A/B tested sequences. High conversion probability.', action: 'Deploy personalized email + LinkedIn DM with A/B variants' },
  { name: 'Warm', range: '25-44', color: 'yellow', icon: <Thermometer size={20} />, desc: 'Qualified prospect. Standard personalized outreach. Medium-term nurture.', action: 'Deploy cold email sequence with company-specific hooks' },
  { name: 'Cold', range: '0-24', color: 'blue', icon: <Snowflake size={20} />, desc: 'Low ICP fit. Monitor for signal changes. Minimal resource allocation.', action: 'Add to awareness campaign. Re-score quarterly.' },
];

export default function ScoringEngine() {
  const [testInput, setTestInput] = useState({ industry: 'AI/ML', size: '50-200', funding: 'Series B', hiring: true, techStack: 'Python, PyTorch, AWS' });
  const [testResult, setTestResult] = useState(null);

  const runTest = () => {
    let score = 0;
    if (testInput.industry === 'AI/ML') score += 15;
    else if (testInput.industry === 'SaaS' || testInput.industry === 'DevTools') score += 10;
    else if (testInput.industry === 'Cloud Infra' || testInput.industry === 'Data Analytics') score += 8;
    else score += 5;

    if (testInput.size === '50-200') score += 12;
    else if (testInput.size === '200-500') score += 10;
    else if (testInput.size === '500+') score += 6;
    else score += 4;

    if (testInput.funding === 'Series B') score += 15;
    else if (testInput.funding === 'Series C') score += 12;
    else if (testInput.funding === 'Series A') score += 8;
    else score += 3;

    if (testInput.hiring) score += 20;
    if (testInput.techStack.includes('Python') || testInput.techStack.includes('PyTorch')) score += 5;

    let tier = 'Cold';
    if (score >= 45) tier = 'Hot';
    else if (score >= 25) tier = 'Warm';

    setTestResult({ score, tier });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ICP Scoring Engine</h2>
        <p className="text-gray-500 text-sm mt-1">Transparent, explainable lead qualification model. Every score is fully auditable.</p>
      </div>

      {/* Scoring Criteria Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Shield size={16} /> Scoring Rubric (Max: 67 pts)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Factor</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Weight Breakdown</th>
                <th className="px-5 py-3 font-semibold text-right">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm">
              {scoringCriteria.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-900">{c.factor}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{c.description}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(c.weights).map(([k, v]) => (
                        <span key={k} className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{k}: +{v}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-black text-gray-900">+{c.maxScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Classification */}
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div key={tier.name} className={`card p-5 border-l-4 border-l-${tier.color}-500 space-y-3`}>
            <div className={`flex items-center gap-2 font-bold text-${tier.color}-700`}>
              {tier.icon} {tier.name} ({tier.range} pts)
            </div>
            <p className="text-sm text-gray-600">{tier.desc}</p>
            <div className={`text-xs font-semibold text-${tier.color}-600 bg-${tier.color}-50 px-3 py-2 rounded border border-${tier.color}-200`}>
              Action: {tier.action}
            </div>
          </div>
        ))}
      </div>

      {/* Live Scorer */}
      <div className="card p-6 bg-gray-50 border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Info size={16} /> Live Score Simulator</h3>
        <div className="grid md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Industry</label>
            <select className="input-field bg-white" value={testInput.industry} onChange={e => setTestInput({...testInput, industry: e.target.value})}>
              {['AI/ML', 'SaaS', 'DevTools', 'Cloud Infra', 'Data Analytics', 'Fintech', 'Other'].map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Size</label>
            <select className="input-field bg-white" value={testInput.size} onChange={e => setTestInput({...testInput, size: e.target.value})}>
              {['1-50', '50-200', '200-500', '500+'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Funding</label>
            <select className="input-field bg-white" value={testInput.funding} onChange={e => setTestInput({...testInput, funding: e.target.value})}>
              {['Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'IPO'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Hiring MLEs?</label>
            <select className="input-field bg-white" value={testInput.hiring} onChange={e => setTestInput({...testInput, hiring: e.target.value === 'true'})}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={runTest} className="btn-primary w-full">Score</button>
          </div>
        </div>
        {testResult && (
          <div className={`p-4 rounded-lg border flex items-center justify-between ${testResult.tier === 'Hot' ? 'bg-red-50 border-red-200' : testResult.tier === 'Warm' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black">{testResult.score}</div>
              <div className="text-sm text-gray-600">out of 67</div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${testResult.tier === 'Hot' ? 'bg-red-100 text-red-800' : testResult.tier === 'Warm' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {testResult.tier}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
