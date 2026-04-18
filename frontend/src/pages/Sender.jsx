import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, X, Linkedin, Copy, Loader2, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

export default function Sender() {
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ sent: 0, total: 0 });
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [openedCount, setOpenedCount] = useState(0);

  useEffect(() => {
    axios.get('/api/leads/top50').then(res => {
      setLeads(res.data.slice(0, 30));
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

  const copyLinkedIn = async (lead) => {
    try {
      const res = await axios.post('/api/generate-outreach', { lead, sender: profile });
      navigator.clipboard.writeText(res.data.linkedin);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) { console.error(e); }
  };

  const openLinkedIn = (lead) => {
    const slug = lead.name.toLowerCase().replace(/\s/g, '-').replace(/\./g, '');
    window.open(`https://linkedin.com/company/${slug}`, '_blank');
  };

  // Generate all emails and show preview
  const handlePrepareEmails = async () => {
    if (selectedLeads.length === 0) return;
    setSending(true);
    setSendProgress({ sent: 0, total: selectedLeads.length });
    setGeneratedEmails([]);

    const selectedData = leads.filter(l => selectedLeads.includes(l.id));
    const emails = [];

    for (let i = 0; i < selectedData.length; i++) {
      const lead = selectedData[i];
      try {
        const res = await axios.post('/api/generate-outreach', { lead, sender: profile });
        emails.push({ lead, email: res.data.email, linkedin: res.data.linkedin });
      } catch (e) {
        emails.push({ lead, email: { subject: `Regarding ${lead.name}`, body: 'Failed to generate' }, linkedin: '' });
      }
      setSendProgress({ sent: i + 1, total: selectedData.length });
    }

    setGeneratedEmails(emails);
    setShowPreview(true);
    setSending(false);
    setOpenedCount(0);
  };

  // Open Gmail compose with pre-filled email
  const openGmailCompose = (email, lead) => {
    const subject = encodeURIComponent(email.subject);
    const body = encodeURIComponent(email.body);
    // Opens Gmail compose in new tab with subject and body pre-filled
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
    setOpenedCount(prev => prev + 1);
  };

  // Open all Gmail composes sequentially
  const openAllGmail = () => {
    generatedEmails.forEach((item, idx) => {
      setTimeout(() => {
        openGmailCompose(item.email, item.lead);
      }, idx * 800); // stagger by 800ms to avoid popup blocker
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Campaign Execution</h2>
        <p className="text-gray-500 text-sm mt-1">Select leads → Generate emails → Open Gmail with pre-written content → Send.</p>
      </div>

      {/* Disclaimer */}
      <div className="card p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-900">How It Works</div>
            <p className="text-xs text-amber-800 mt-1">
              Clicking <strong>"Send via Gmail"</strong> opens Gmail Compose in a new tab with the subject and body <strong>pre-filled automatically</strong>. 
              You just add the recipient email and hit Send. <strong>Full SMTP auto-send integration coming soon</strong> — currently in beta with Gmail OAuth 2.0.
            </p>
          </div>
        </div>
      </div>

      {!showPreview ? (
        <>
          {/* LinkedIn Quick Actions */}
          <div className="card p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900"><Linkedin size={16} /> LinkedIn DM</div>
            <p className="text-xs text-blue-700 mt-1"><strong>"Copy DM"</strong> copies the personalized message → <strong>"Open"</strong> takes you to their LinkedIn page.</p>
          </div>

          {/* Lead Selection */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button onClick={handleSelectAll} className="text-xs font-semibold text-blue-600 hover:text-blue-800">{selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}</button>
                <span className="text-xs text-gray-400 font-mono">{selectedLeads.length} selected</span>
              </div>
              <div className="flex items-center gap-3">
                {sending && <span className="text-xs font-mono text-gray-500">Generating {sendProgress.sent}/{sendProgress.total}...</span>}
                <button onClick={handlePrepareEmails}
                  disabled={selectedLeads.length === 0 || sending}
                  className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
                  {sending ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate & Preview Emails</>}
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50 bg-white max-h-[420px] overflow-y-auto">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 animate-pulse flex items-center gap-4">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))
              ) : leads.map(lead => (
                <div key={lead.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                    checked={selectedLeads.includes(lead.id)} onChange={() => handleToggle(lead.id)} disabled={sending} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900">{lead.name}</div>
                    <div className="text-xs text-gray-400">{lead.domain} · {lead.industry} · {lead.funding}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${lead.score === 'Hot' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.score}</span>
                    <button onClick={() => copyLinkedIn(lead)}
                      className="text-xs font-semibold px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-1 text-gray-600 transition-colors">
                      {copiedId === lead.id ? <><CheckCircle2 size={10} className="text-green-600" /> Copied!</> : <><Copy size={10} /> Copy DM</>}
                    </button>
                    <button onClick={() => openLinkedIn(lead)}
                      className="text-xs font-semibold px-2 py-1 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 text-blue-700 transition-colors">
                      <Linkedin size={10} /> Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Email Preview + Gmail Send */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-bold text-gray-900">{generatedEmails.length} Emails Ready</div>
              <div className="text-xs text-gray-500">{openedCount} opened in Gmail</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPreview(false)} className="text-xs font-semibold text-gray-500 hover:text-gray-900">← Back to Selection</button>
              <button onClick={openAllGmail} className="btn-primary text-sm flex items-center gap-2">
                <Mail size={14} /> Open All in Gmail
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto">
            {generatedEmails.map((item, idx) => (
              <div key={idx} className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] font-bold">{idx + 1}</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{item.lead.name}</div>
                      <div className="text-[11px] text-gray-400">{item.lead.domain} · {item.lead.industry}</div>
                    </div>
                  </div>
                  <button onClick={() => openGmailCompose(item.email, item.lead)}
                    className="btn-primary text-xs flex items-center gap-1.5 py-2 px-3">
                    <Mail size={12} /> Send via Gmail <ExternalLink size={10} />
                  </button>
                </div>
                <div className="p-4 bg-gray-50 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject: </span>
                    <span className="text-sm font-semibold text-gray-900">{item.email.subject}</span>
                  </div>
                  <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded border border-gray-200 max-h-28 overflow-y-auto">{item.email.body}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
