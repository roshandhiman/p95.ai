import { useState } from 'react';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

export default function Outreach() {
  const [apiKey, setApiKey] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!targetCompany) return;
    
    setGenerating(true);
    setResults(null);
    
    // Simulate generation
    setTimeout(() => {
      setGenerating(false);
      setResults({
        email: {
          variantA: {
            subject: `Scaling the MLE team at ${targetCompany} post-Series B`,
            body: `Hi Team,\n\nHuge congrats on the recent traction at ${targetCompany}.\n\nI noticed you just opened new Machine Learning Engineer roles. P95.AI provides scalable agentic ML infrastructure that essentially acts as a localized execution environment for your current team, reducing the need for immediate specialized hires by 40%.\n\nOpen to a technical overview next Tuesday?`,
            score: 84
          },
          variantB: {
            subject: `Infrastructure integration for ${targetCompany}`,
            body: `Hello,\n\nI saw your openings for MLEs. We help scale ML infrastructure autonomously without needing to double headcount.\n\nLet's chat.`,
            score: 32
          }
        },
        linkedin: `Congrats on the recent growth at ${targetCompany}! Saw the MLE openings and thought P95 could help scale your throughput 40% immediately. Open to connecting?`
      });
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Agentic Outreach Engine</h2>
        <p className="text-gray-500 text-sm">Generate hyper-personalized messages based on firmographic context. Multi-armed testing built-in.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="card p-5 bg-gray-50 border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Wand2 size={16} /> Generation Config
            </h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Target Account</label>
                <input 
                  type="text" 
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Acme AI" 
                  className="input-field bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">OpenAI API Key (Optional for Local Demo)</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..." 
                  className="input-field bg-white font-mono text-xs" 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={generating || !targetCompany}
                  className="btn-primary w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                >
                  {generating ? (
                    <span className="flex items-center gap-2"><Sparkles className="animate-pulse" size={16} /> Synthesizing...</span>
                  ) : (
                    <span className="flex items-center gap-2">Generate Outreach <ArrowRight size={16} /></span>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* LinkedIn Output */}
          {results && (
            <div className="card p-5 animate-in slide-in-from-left">
              <h3 className="text-sm font-bold text-gray-900 mb-2">LinkedIn DM</h3>
              <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded border border-gray-100">
                "{results.linkedin}"
              </p>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="md:col-span-2">
          {generating ? (
            <div className="h-full min-h-[400px] card p-8 flex flex-col items-center justify-center border-dashed border-gray-300 bg-gray-50">
               <Sparkles className="animate-pulse text-gray-400 mb-4" size={32} />
               <div className="text-sm font-mono text-gray-500">Retrieving context vector...</div>
               <div className="text-xs font-mono text-gray-400 mt-2">Constructing A/B variants via Claude API</div>
            </div>
          ) : results ? (
            <div className="grid sm:grid-cols-2 gap-6 h-full">
              {/* Variant A */}
              <div className="card border-2 border-gray-900 shadow-xl overflow-hidden relative flex flex-col">
                <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
                  <div className="text-xs font-bold font-mono">Variant A</div>
                  <div className="text-xs font-mono text-green-400">Pred. Conv: {results.email.variantA.score}%</div>
                </div>
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Subject</div>
                    <div className="font-semibold text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {results.email.variantA.subject}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Body</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {results.email.variantA.body}
                    </div>
                  </div>
                </div>
              </div>

              {/* Variant B */}
              <div className="card border-gray-200 overflow-hidden relative flex flex-col opacity-80 h-full">
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex justify-between items-center text-gray-600">
                  <div className="text-xs font-bold font-mono">Variant B</div>
                  <div className="text-xs font-mono text-red-400 mt-1 sm:mt-0 leading-tight">Pred. Conv: {results.email.variantB.score}%</div>
                </div>
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Subject</div>
                    <div className="font-semibold text-sm text-gray-600 bg-white border border-gray-100 p-2 rounded">
                      {results.email.variantB.subject}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Body</div>
                    <div className="text-sm text-gray-500 whitespace-pre-wrap">
                      {results.email.variantB.body}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="h-full min-h-[400px] card p-8 flex flex-col items-center justify-center border-dashed border-gray-300">
               <div className="text-sm font-semibold text-gray-400">System idle. Ready to generate variants.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
