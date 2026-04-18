import { useState, useEffect } from 'react';
import { Beaker, Flame, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

export default function ABTesting() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState({});
  const [generating, setGenerating] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    axios.get('/api/leads/top20').then(res => {
      setLeads(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const generateVariants = async (lead) => {
    setGenerating(lead.id);
    try {
      const res = await axios.post('/api/generate-ab', { lead, sender: profile });
      setVariants(prev => ({ ...prev, [lead.id]: res.data }));
      setSelectedLead(lead.id);
    } catch(e) { console.error(e); }
    finally { setGenerating(null); }
  };

  const activeVariant = selectedLead ? variants[selectedLead] : null;
  const activeLead = leads.find(l => l.id === selectedLead);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">A/B Testing Engine</h2>
        <p className="text-gray-500 text-sm mt-1">Top 20 HOT leads. 2 outreach variants each with different pain points, hooks, and CTAs. Includes response rate hypotheses.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left: Lead List */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Target Accounts ({leads.length})</div>
          {loading ? (
            [...Array(5)].map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>)
          ) : (
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
              {leads.map((lead, idx) => (
                <div key={lead.id} className={`card p-3 cursor-pointer transition-all hover:shadow-sm ${selectedLead === lead.id ? 'ring-2 ring-gray-900 shadow-md' : ''}`}
                  onClick={() => variants[lead.id] ? setSelectedLead(lead.id) : generateVariants(lead)}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[11px] font-bold">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">{lead.name}</div>
                      <div className="text-[11px] text-gray-400 truncate">{lead.industry} · {lead.funding} · ICP: {lead.icpScore}</div>
                    </div>
                    {variants[lead.id] ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">2 Variants</span>
                    ) : generating === lead.id ? (
                      <span className="text-[10px] font-bold text-gray-400 animate-pulse">Generating...</span>
                    ) : (
                      <ArrowRight size={14} className="text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: A/B Variant Display */}
        <div className="md:col-span-8">
          {activeVariant && activeLead ? (
            <div className="space-y-5">
              <div className="text-sm font-semibold text-gray-500">Variants for <span className="text-gray-900">{activeLead.name}</span></div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Variant A */}
                <div className="card border-2 border-gray-900 overflow-hidden shadow-lg">
                  <div className="bg-gray-900 text-white px-4 py-2.5 flex justify-between items-center">
                    <div className="text-xs font-bold font-mono flex items-center gap-2"><Beaker size={12} /> VARIANT A</div>
                    <div className="text-xs font-mono text-green-400">Pred: {activeVariant.variantA.predictedRate}%</div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hook Strategy</div>
                      <div className="text-sm font-semibold text-blue-700 mt-1 bg-blue-50 px-3 py-1.5 rounded">{activeVariant.variantA.hook}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Subject Line</div>
                      <div className="text-sm font-bold text-gray-900 mt-1">{activeVariant.variantA.subject}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Body</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1 leading-relaxed">{activeVariant.variantA.body}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">CTA Type</div>
                      <div className="text-xs font-semibold text-gray-600 mt-1">{activeVariant.variantA.cta}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Hypothesis</div>
                      <div className="text-xs text-gray-600 italic leading-relaxed">{activeVariant.variantA.hypothesis}</div>
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div className="card border-gray-200 overflow-hidden">
                  <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
                    <div className="text-xs font-bold font-mono text-gray-600 flex items-center gap-2"><Beaker size={12} /> VARIANT B</div>
                    <div className="text-xs font-mono text-orange-500">Pred: {activeVariant.variantB.predictedRate}%</div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hook Strategy</div>
                      <div className="text-sm font-semibold text-purple-700 mt-1 bg-purple-50 px-3 py-1.5 rounded">{activeVariant.variantB.hook}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Subject Line</div>
                      <div className="text-sm font-bold text-gray-900 mt-1">{activeVariant.variantB.subject}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Body</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap mt-1 leading-relaxed">{activeVariant.variantB.body}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">CTA Type</div>
                      <div className="text-xs font-semibold text-gray-600 mt-1">{activeVariant.variantB.cta}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Hypothesis</div>
                      <div className="text-xs text-gray-600 italic leading-relaxed">{activeVariant.variantB.hypothesis}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] card p-8 flex flex-col items-center justify-center border-dashed border-gray-300">
              <Beaker className="text-gray-300 mb-3" size={32} />
              <div className="text-sm font-semibold text-gray-400 text-center">Select a lead from the left panel to generate A/B variants.</div>
              <div className="text-xs text-gray-300 mt-1">Each lead gets 2 unique versions with different hooks, CTAs, and hypotheses.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
