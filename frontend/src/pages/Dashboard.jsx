import { useState, useEffect } from 'react';
import { Flame, Thermometer, Snowflake, Search, RefreshCw, Database, Globe, Layers } from 'lucide-react';
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
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors text-sm">
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
    </div>
  );
}
