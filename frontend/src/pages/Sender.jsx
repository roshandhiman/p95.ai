import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';

export default function Sender() {
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/leads/top50').then(res => {
      setLeads(res.data.slice(0, 20));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleToggle = (id) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) setSelectedLeads([]);
    else setSelectedLeads(leads.map(l => l.id));
  };

  const handleSend = () => {
    if (selectedLeads.length === 0) return;
    setSending(true);
    setSentCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSentCount(count);
      if (count === selectedLeads.length) {
        clearInterval(interval);
        setTimeout(() => setSending(false), 500);
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Campaign Execution</h2>
        <p className="text-gray-500 text-sm mt-1">Review and dispatch personalized sequences to qualified accounts.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={handleSelectAll} className="text-xs font-semibold text-blue-600 hover:text-blue-800">{selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}</button>
            <span className="text-xs text-gray-400 font-mono">{selectedLeads.length} selected</span>
          </div>
          <button onClick={handleSend} disabled={selectedLeads.length === 0 || sending || (sentCount === selectedLeads.length && sentCount > 0)} className="btn-primary text-sm">
            {sending ? `Dispatching ${sentCount}/${selectedLeads.length}...` : 'Execute Campaign'}
          </button>
        </div>

        <div className="divide-y divide-gray-50 bg-white max-h-[400px] overflow-y-auto">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse flex items-center gap-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : leads.map(lead => (
            <div key={lead.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer" checked={selectedLeads.includes(lead.id)} onChange={() => handleToggle(lead.id)} disabled={sending} />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">{lead.name}</div>
                <div className="text-xs text-gray-400">{lead.domain} · {lead.industry} · {lead.funding}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${lead.score === 'Hot' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.score}</span>
            </div>
          ))}
        </div>
      </div>

      {sentCount === selectedLeads.length && sentCount > 0 && !sending && (
        <div className="card p-5 border-green-200 bg-green-50 shadow-md flex justify-between items-start">
          <div className="flex gap-4">
            <CheckCircle2 className="text-green-600 mt-0.5" size={22} />
            <div>
              <h3 className="font-bold text-green-900">Campaign Deployed</h3>
              <p className="text-sm text-green-800 mt-1">{selectedLeads.length} personalized outreach sequences dispatched. Cold email + LinkedIn DM variants sent.</p>
            </div>
          </div>
          <button onClick={() => setSentCount(0)} className="text-green-600 hover:text-green-800"><X size={18} /></button>
        </div>
      )}
    </div>
  );
}
