import { useState } from 'react';
import { UploadCloud, Plus } from 'lucide-react';
import axios from 'axios';

export default function UploadLeads() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [manualLead, setManualLead] = useState({
    name: '', industry: '', size: '', hiring: false
  });

  const handleFileUpload = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    // Simulate upload delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFile(null);
    }, 1500);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setManualLead({ name: '', industry: '', size: '', hiring: false });
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead Intake</h2>
        <p className="text-gray-500 text-sm">Upload bulk CSV lists from Apollo or manually inject high-priority accounts.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CSV Upload */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
            <UploadCloud size={18} /> Bulk CSV Enrichment
          </div>
          <p className="text-sm text-gray-500 mb-6">Drops a CSV file detailing companies. Background intelligence scoring will begin immediately.</p>
          
          <form onSubmit={handleFileUpload}>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors mb-4">
              <UploadCloud size={32} className="text-gray-400 mb-3" />
              <span className="text-sm font-semibold text-gray-700">Select or drop CSV file</span>
              <span className="text-xs text-gray-400 mt-1">.csv formats supported up to 500 rows</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </label>
            {file && <div className="text-xs font-mono text-gray-500 mb-4 bg-gray-100 p-2 rounded">Selected: {file.name}</div>}
            
            <button type="submit" disabled={!file || loading} className="btn-primary w-full">
              {loading ? 'Processing Pipeline...' : 'Initialize Enrichment'}
            </button>
          </form>
        </div>

        {/* Manual Form */}
        <div className="card p-6 bg-gray-50 border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
            <Plus size={18} /> Manual Injection
          </div>
          <p className="text-sm text-gray-500 mb-6">Manually input a target account for immediate scoring evaluation.</p>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
              <input 
                type="text" 
                className="input-field bg-white" 
                value={manualLead.name}
                onChange={e => setManualLead({...manualLead, name: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Industry</label>
                <select 
                  className="input-field bg-white"
                  value={manualLead.industry}
                  onChange={e => setManualLead({...manualLead, industry: e.target.value})}
                  required
                >
                  <option value="">Select...</option>
                  <option value="SaaS">SaaS</option>
                  <option value="AI">AI/ML</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company Size</label>
                <select 
                  className="input-field bg-white"
                  value={manualLead.size}
                  onChange={e => setManualLead({...manualLead, size: e.target.value})}
                  required
                >
                  <option value="">Select...</option>
                  <option value="1-50">1-50</option>
                  <option value="50-200">50-200</option>
                  <option value="200-500">200-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="hiring"
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                checked={manualLead.hiring}
                onChange={e => setManualLead({...manualLead, hiring: e.target.checked})}
              />
              <label htmlFor="hiring" className="text-sm font-semibold text-gray-700">Actively hiring MLEs?</label>
            </div>

            <button type="submit" disabled={loading} className="btn-secondary w-full mt-4 bg-white">
              {loading ? 'Evaluating...' : 'Inject Record'}
            </button>
          </form>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm font-semibold flex items-center justify-between">
          <span>Success: Pipeline has digested the new records seamlessly. Check dashboard for scoring.</span>
          <button onClick={() => setSuccess(false)}><Plus className="rotate-45" size={16} /></button>
        </div>
      )}
    </div>
  );
}
