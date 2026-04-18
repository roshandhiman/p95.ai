import { useState, useEffect } from 'react';
import { Flame, Thermometer, Snowflake, Search, RefreshCw, Database, Globe, Layers, X, ExternalLink, Building2, Users, DollarSign, Cpu, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, hot: 0, warm: 0, cold: 0, sources: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [filterScore, setFilterScore] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [leadsRes, statsRes] = await Promise.all([
        axios.get('/api/leads'),
        axios.get('/api/leads/stats')
      ]);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await axios.post('/api/sync-apollo');
      setSyncMsg(res.data.message);
      setTimeout(() => { fetchAll(); setSyncMsg(''); }, 3000);
    } catch(e) { console.error(e); }
    finally { setSyncing(false); }
  };

  const safeLeads = Array.isArray(leads) ? leads : [];
  const filteredLeads = safeLeads
    .filter(l => l.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(l => filterScore === 'All' || l.score === filterScore)
    .filter(l => filterSource === 'All' || l.source === filterSource);

  const sourceList = [...new Set(safeLeads.map(l => l.source).filter(Boolean))];

  // Score breakdown calculator
  const getScoreBreakdown = (lead) => {
    const breakdown = [];
    // Industry
    let indPts = 5;
    if (lead.industry === 'AI/ML') indPts = 15;
    else if (lead.industry === 'SaaS' || lead.industry === 'DevTools') indPts = 10;
    else if (lead.industry === 'Cloud Infra' || lead.industry === 'Data Analytics') indPts = 8;
    breakdown.push({ factor: 'Industry Match', value: lead.industry, pts: indPts, max: 15 });
    // Size
    let sizePts = 4;
    if (lead.size === '50-200') sizePts = 12;
    else if (lead.size === '200-500') sizePts = 10;
    else if (lead.size === '500+') sizePts = 6;
    breakdown.push({ factor: 'Company Size', value: lead.size + ' employees', pts: sizePts, max: 12 });
    // Funding
    let fundPts = 3;
    if (lead.funding === 'Series B') fundPts = 15;
    else if (lead.funding === 'Series C') fundPts = 12;
    else if (lead.funding === 'Series A') fundPts = 8;
    else if (lead.funding === 'Series D' || lead.funding === 'Series E') fundPts = 6;
    breakdown.push({ factor: 'Funding Stage', value: lead.funding, pts: fundPts, max: 15 });
    // Hiring
    const hirePts = lead.hiring ? 20 : 0;
    breakdown.push({ factor: 'Hiring Signal', value: lead.hiring ? 'Active MLE roles' : 'No active roles', pts: hirePts, max: 20 });
    // Tech
    const techPts = (lead.techStack && (lead.techStack.includes('Python') || lead.techStack.includes('PyTorch'))) ? 5 : 0;
    breakdown.push({ factor: 'Tech Affinity', value: lead.techStack || 'N/A', pts: techPts, max: 5 });
    return breakdown;
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-100 rounded w-1/2 mt-1.5"></div></td>
      <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
      <td className="px-5 py-4"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
      <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
      <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded w-10"></div></td>
      <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded-full w-14"></div></td>
    </tr>
  );

  // Company Detail Modal
  const CompanyModal = ({ lead, onClose }) => {
    if (!lead) return null;
    const breakdown = getScoreBreakdown(lead);
    const totalMax = 67;
    const pct = Math.round((lead.icpScore / totalMax) * 100);
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">{lead.name}</h2>
              <a href={`https://${lead.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 font-medium">
                {lead.domain} <ExternalLink size={12} />
              </a>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"><X size={16} /></button>
          </div>

          {/* Score Ring */}
          <div className="p-6 flex items-center gap-6 border-b border-gray-100 bg-gray-50">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={lead.score === 'Hot' ? '#ef4444' : lead.score === 'Warm' ? '#eab308' : '#3b82f6'} strokeWidth="3" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900">{lead.icpScore}</span>
                <span className="text-[9px] text-gray-400 font-semibold">/{totalMax}</span>
              </div>
            </div>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${lead.score === 'Hot' ? 'bg-red-100 text-red-700' : lead.score === 'Warm' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                {lead.score === 'Hot' && <Flame size={14} />}
                {lead.score === 'Warm' && <Thermometer size={14} />}
                {lead.score === 'Cold' && <Snowflake size={14} />}
                {lead.score} Lead
              </span>
              <p className="text-xs text-gray-500 mt-2">{lead.score === 'Hot' ? 'Priority outreach. A/B test variants deployed.' : lead.score === 'Warm' ? 'Qualified. Standard personalized outreach.' : 'Low ICP fit. Monitor for signal changes.'}</p>
            </div>
          </div>

          {/* Company Info Grid */}
          <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Building2 size={14} className="text-gray-500" /></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase">Industry</div><div className="text-sm font-semibold text-gray-900">{lead.industry}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Users size={14} className="text-gray-500" /></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase">Size</div><div className="text-sm font-semibold text-gray-900">{lead.size} employees</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><DollarSign size={14} className="text-gray-500" /></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase">Funding</div><div className="text-sm font-semibold text-gray-900">{lead.funding}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Globe size={14} className="text-gray-500" /></div>
              <div><div className="text-[10px] font-bold text-gray-400 uppercase">Source</div><div className="text-sm font-semibold text-gray-900">{lead.source}</div></div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2"><Cpu size={14} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase">Tech Stack</span></div>
            <div className="flex flex-wrap gap-1.5">
              {(lead.techStack || 'N/A').split(',').map((t, i) => (
                <span key={i} className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">{t.trim()}</span>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3"><TrendingUp size={14} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase">ICP Score Breakdown</span></div>
            <div className="space-y-2.5">
              {breakdown.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-semibold text-gray-500 flex-shrink-0">{b.factor}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(b.pts / b.max) * 100}%`, backgroundColor: b.pts === b.max ? '#22c55e' : b.pts > 0 ? '#eab308' : '#e5e7eb' }}></div>
                  </div>
                  <div className="text-xs font-mono font-bold text-gray-700 w-12 text-right">+{b.pts}/{b.max}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
            <a href={`https://${lead.domain}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center text-sm flex items-center justify-center gap-2">Visit Website <ExternalLink size={14} /></a>
            <a href={`https://linkedin.com/company/${lead.name?.toLowerCase().replace(/\s/g, '-').replace(/\./g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">LinkedIn Profile</a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Sync Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Data Synchronization</h2>
          <p className="text-sm text-gray-500">Pull enriched leads from Clay.com, Apollo.io, LinkedIn, Crunchbase, BuiltWith, GitHub.</p>
        </div>
        <button onClick={handleSync} disabled={syncing} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing Platforms...' : 'Run Multi-Platform Sync'}
        </button>
      </div>

      {syncMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm font-semibold">{syncMsg}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-gray-900">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1"><Database size={14} /> Total Leads</div>
          <div className="text-3xl font-black text-gray-900">{loading ? '—' : stats.total}</div>
        </div>
        <div className="card p-5 border-l-4 border-l-red-500 bg-red-50/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-1"><Flame size={14} /> Hot</div>
          <div className="text-3xl font-black text-red-900">{loading ? '—' : stats.hot}</div>
        </div>
        <div className="card p-5 border-l-4 border-l-yellow-500 bg-yellow-50/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-yellow-600 mb-1"><Thermometer size={14} /> Warm</div>
          <div className="text-3xl font-black text-yellow-900">{loading ? '—' : stats.warm}</div>
        </div>
        <div className="card p-5 border-l-4 border-l-blue-400 bg-blue-50/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1"><Snowflake size={14} /> Cold</div>
          <div className="text-3xl font-black text-blue-900">{loading ? '—' : stats.cold}</div>
        </div>
      </div>

      {/* Source Breakdown */}
      {!loading && stats.sources && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(stats.sources).map(([src, count]) => (
            <div key={src} className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setFilterSource(filterSource === src ? 'All' : src)}>
              <div className={`text-xs font-bold mb-1 ${filterSource === src ? 'text-blue-600' : 'text-gray-500'}`}>{src}</div>
              <div className="text-lg font-black text-gray-900">{count}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters & Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Clay Enrichment Table</h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">{filteredLeads.length} rows</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select value={filterScore} onChange={e => setFilterScore(e.target.value)} className="input-field h-9 text-sm bg-gray-50 border-gray-200 w-24">
              <option value="All">All</option>
              <option value="Hot">Hot</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="text" placeholder="Filter companies..." className="input-field pl-9 h-9 text-sm bg-gray-50 border-gray-200 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Industry</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Funding</th>
                <th className="px-5 py-3 font-semibold">Tech Stack</th>
                <th className="px-5 py-3 font-semibold">Size</th>
                <th className="px-5 py-3 font-semibold">ICP</th>
                <th className="px-5 py-3 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {loading ? (
                [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              ) : filteredLeads.map((lead, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors text-sm cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-gray-900">{lead.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{lead.domain}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{lead.industry}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                      <Globe size={10} /> {lead.source}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-medium">{lead.funding}</td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{lead.techStack}</td>
                  <td className="px-5 py-3.5 text-gray-600">{lead.size}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-black" style={{
                        borderColor: lead.icpScore >= 45 ? '#ef4444' : lead.icpScore >= 25 ? '#eab308' : '#3b82f6',
                        color: lead.icpScore >= 45 ? '#991b1b' : lead.icpScore >= 25 ? '#854d0e' : '#1e40af'
                      }}>
                        {lead.icpScore}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      lead.score === 'Hot' ? 'bg-red-50 text-red-700 border-red-200' :
                      lead.score === 'Warm' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {lead.score === 'Hot' && <Flame size={10} />}
                      {lead.score === 'Warm' && <Thermometer size={10} />}
                      {lead.score === 'Cold' && <Snowflake size={10} />}
                      {lead.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Detail Modal */}
      <CompanyModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
