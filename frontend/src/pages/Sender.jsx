import { useState } from 'react';
import { Mail, CheckCircle2, UserCheck, X } from 'lucide-react';

export default function Sender() {
  const [selectedLeads, setSelectedLeads] = useState([1, 2]);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  
  // Demo Leads
  const queue = [
    { id: 1, name: 'Acme AI', contact: 'sarah@acme.ai', score: 'Hot' },
    { id: 2, name: 'Globex Corp', contact: 'cto@globex.co', score: 'Warm' },
    { id: 3, name: 'Soylent Inc', contact: 'vp@soylent.com', score: 'Cold' },
  ];

  const handleToggle = (id) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleSend = () => {
    if (selectedLeads.length === 0) return;
    setSending(true);
    setSentCount(0);
    
    // Simulate sequential sending
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSentCount(count);
      if (count === selectedLeads.length) {
        clearInterval(interval);
        setTimeout(() => setSending(false), 500);
      }
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Execution</h2>
        <p className="text-gray-500 text-sm">Review your generated outreach variants and execute bounds safely. Mocks sending.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <UserCheck size={16} /> Queued Targets ({queue.length})
          </div>
          <button 
            onClick={handleSend}
            disabled={selectedLeads.length === 0 || sending || sentCount === selectedLeads.length}
            className="btn-primary"
          >
            {sending ? `Sending ${sentCount}/${selectedLeads.length}...` : 'Dispatch Selected'}
          </button>
        </div>
        
        <div className="divide-y divide-gray-100 bg-white">
          {queue.map((lead) => (
            <div key={lead.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                checked={selectedLeads.includes(lead.id)}
                onChange={() => handleToggle(lead.id)}
                disabled={sending}
              />
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">{lead.name}</div>
                <div className="text-xs text-gray-500">{lead.contact}</div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                  lead.score === 'Hot' ? 'bg-red-100 text-red-800' : 
                  lead.score === 'Warm' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {lead.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sentCount === selectedLeads.length && sentCount > 0 && !sending && (
        <div className="card p-6 border-green-200 bg-green-50 shadow-md animate-in slide-in-from-bottom flex justify-between items-start">
          <div className="flex gap-4">
            <CheckCircle2 className="text-green-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-green-900 text-lg">Campaign Executed</h3>
              <p className="text-sm text-green-800 mt-1">
                Successfully dispatched {selectedLeads.length} personalized messages utilizing Variant A logic.
              </p>
            </div>
          </div>
          <button onClick={() => setSentCount(0)} className="text-green-600 hover:text-green-800">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Demo Email Compose Interface */}
      <div className="card p-6 bg-white border-dashed border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Mail size={16} /> Manual Verification Draft
        </h3>
        <div className="space-y-4">
          <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
             <input type="text" className="input-field bg-gray-50" value="sarah@acme.ai" readOnly />
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
             <input type="text" className="input-field bg-gray-50" value="Scaling the MLE team at Acme AI post-Series B" readOnly />
          </div>
          <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1">Body</label>
             <textarea className="input-field bg-gray-50 h-32 resize-none" readOnly value="Hi Team,\n\nHuge congrats on the recent traction at Acme AI...\n\n(Auto-generated via Claude 3)" />
          </div>
        </div>
      </div>

    </div>
  );
}
