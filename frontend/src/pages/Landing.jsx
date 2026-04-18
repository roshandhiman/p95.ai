import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Server, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black tracking-tighter text-xl">
            <Bot size={24} className="text-gray-900" /> P95.AI
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#architecture" className="hover:text-gray-900 transition-colors">Architecture</a>
            <a href="#pipeline" className="hover:text-gray-900 transition-colors">Data Pipeline</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Agentic Core</a>
          </div>
          <div>
            <Link to="/app" className="btn-primary py-2 px-5 text-sm shadow-xl shadow-gray-200">
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-gray-50 to-gray-200 rounded-full blur-[120px] -z-10 opacity-60"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-600 mb-4 tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Track A: ThinkRoot x Vortex
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Outbound, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Automated.</span><br />
            Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Scaled.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            P95.AI replaces manual SDR teams with an autonomous data pipeline. We combine Clay.com enrichment, exact Python-based ML scoring, and Claude 3 to hyper-personalize outreach for Series B tech companies locking in MLE hires.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/app" className="h-14 px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-2xl shadow-gray-900/20 w-full sm:w-auto">
              Initialize Engine <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Mac Window Mockup */}
        <div className={`mt-24 max-w-5xl mx-auto transition-transform duration-1000 ease-out`} style={{ transform: `translateY(${Math.max(0, 50 - scrollY * 0.1)}px)`, opacity: Math.min(1, 0.2 + scrollY * 0.002) }}>
          <div className="rounded-2xl border border-gray-200 shadow-2xl overflow-hidden bg-gray-900 relative ring-1 ring-white/10">
            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="mx-auto text-xs font-mono text-gray-500 pr-10">root@p95.ai: ~/pipeline</div>
            </div>
            <div className="p-8 font-mono text-sm leading-relaxed overflow-x-hidden">
              <div className="text-green-400 mb-2">14:02:01 <span className="text-blue-400">[Clay_Enrich]</span> Webhook payload received. 200+ enterprise leads extracted.</div>
              <div className="text-green-400 mb-2">14:02:04 <span className="text-blue-400">[Scorer_ML]</span> Evaluated firmographics against ICP constraints...</div>
              <div className="text-green-400 mb-2">14:02:08 <span className="text-yellow-400">[Pipeline]</span> ==> Identified 87 accounts actively hiring MLEs (Score: HOT)</div>
              <div className="text-gray-400 mt-6 animate-pulse">Waiting for execution directive..._</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100">
                <Server className="text-gray-900" size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Data Enrichment</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Instantly parses 200+ companies from Clay, cross-referencing Apollo constraints targeting only verified Series B entities.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100">
                <ShieldCheck className="text-gray-900" size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Algorithmic Scoring</h3>
              <p className="text-gray-500 text-sm leading-relaxed">No arbitrary estimations. Evaluates definitive ICP signals—tech stack, funding velocity, and active engineering headcounts.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100">
                <Zap className="text-gray-900" size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Multi-Armed Drafter</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Generates high-conversion personalized emails referencing explicit firmographic triggers and automatically tests variance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white text-center">
        <div className="text-gray-500 font-medium text-sm">
          Developed natively for <strong className="text-gray-900">ThinkRoot x Vortex Hackathon 2026</strong>. Built for scale.
        </div>
      </footer>

    </div>
  );
}
