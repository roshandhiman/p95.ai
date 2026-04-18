import { useState, useEffect } from 'react';
import { Mail, Linkedin, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

export default function Outreach() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [generatedMessages, setGeneratedMessages] = useState({});
  const [generating, setGenerating] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    axios.get('/api/leads/top50').then(res => {
      setLeads(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const generateForLead = async (lead) => {
    setGenerating(lead.id);
    try {
      const res = await axios.post('/api/generate-outreach', { lead, sender: profile });
      setGeneratedMessages(prev => ({ ...prev, [lead.id]: res.data }));
    } catch(e) { console.error(e); }
    finally { setGenerating(null); }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personalized Outreach</h2>
        <p className="text-gray-500 text-sm mt-1">Top 50 qualified leads. Generate context-aware cold emails and LinkedIn DMs for each account.</p>
      </div>

      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Mail size={16} /> Cold Email + <Linkedin size={16} /> LinkedIn DM for each lead
        </div>
        <div className="ml-auto text-xs font-mono bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full border border-gray-200">
          {leads.length} leads queued
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead, idx) => (
            <div key={lead.id} className="card overflow-hidden transition-all">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(lead.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{lead.name}</div>
                    <div className="text-xs text-gray-400">{lead.domain} · {lead.industry} · {lead.funding}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${lead.score === 'Hot' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.score} ({lead.icpScore})</span>
                  {!generatedMessages[lead.id] ? (
                    <button onClick={(e) => { e.stopPropagation(); generateForLead(lead); }} disabled={generating === lead.id} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Sparkles size={12} className={generating === lead.id ? 'animate-spin' : ''} />
                      {generating === lead.id ? 'Generating...' : 'Generate'}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-green-600">Generated</span>
                  )}
                  {expandedId === lead.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>

              {expandedId === lead.id && generatedMessages[lead.id] && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 grid md:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900"><Mail size={14} /> Cold Email</div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Subject</div>
                        <div className="text-sm font-semibold text-gray-900 mt-1">{generatedMessages[lead.id].email.subject}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Body</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1 leading-relaxed">{generatedMessages[lead.id].email.body}</div>
                      </div>
                    </div>
                  </div>
                  {/* LinkedIn DM */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900"><Linkedin size={14} /> LinkedIn DM</div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="text-sm text-gray-700 italic leading-relaxed">"{generatedMessages[lead.id].linkedin}"</div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Character count: {generatedMessages[lead.id].linkedin.length}/300</div>
                  </div>
                </div>
              )}

              {expandedId === lead.id && !generatedMessages[lead.id] && (
                <div className="border-t border-gray-100 p-8 bg-gray-50 text-center">
                  <p className="text-sm text-gray-400">Click "Generate" to create personalized outreach for {lead.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
