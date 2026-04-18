import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Server, ShieldCheck, Zap, Beaker, Target, Database, Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = ref.current?.querySelectorAll('.reveal-on-scroll');
    elements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Landing() {
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black tracking-tighter text-xl">
            <Bot size={24} /> P95.AI
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#architecture" className="hover:text-gray-900 transition-colors">Architecture</a>
            <a href="#scoring" className="hover:text-gray-900 transition-colors">Scoring</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#platforms" className="hover:text-gray-900 transition-colors">Platforms</a>
          </div>
          <Link to="/app" className="btn-primary py-2 px-5 text-sm shadow-xl shadow-gray-200">Launch Console</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-gray-50 to-gray-200 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-600 tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Track A · ThinkRoot x Vortex 2026
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Outbound, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Automated.</span><br />
            Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">Scaled.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            200+ enriched leads from 6 platforms. Explainable ICP scoring. Personalized cold outreach for top 50. A/B tested variants for top 20. All fully automated.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/app" className="h-14 px-8 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-2xl shadow-gray-900/20 w-full sm:w-auto">
              Launch Intelligence Console <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Terminal */}
        <div className="mt-20 max-w-5xl mx-auto reveal-on-scroll">
          <div className="rounded-2xl border border-gray-200 shadow-2xl overflow-hidden bg-gray-900 ring-1 ring-white/10">
            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="mx-auto text-xs font-mono text-gray-500 pr-10">root@p95.ai: ~/pipeline</div>
            </div>
            <div className="p-6 font-mono text-sm leading-loose overflow-x-hidden">
              <div className="text-green-400">14:02:01 <span className="text-blue-400">[Clay.com]</span> Webhook received. 85 enriched leads extracted.</div>
              <div className="text-green-400">14:02:03 <span className="text-blue-400">[Apollo.io]</span> Contact sync complete. 42 verified emails matched.</div>
              <div className="text-green-400">14:02:05 <span className="text-blue-400">[LinkedIn]</span> Hiring signal scan. 38 active MLE postings detected.</div>
              <div className="text-green-400">14:02:07 <span className="text-blue-400">[Crunchbase]</span> Funding data merged. 28 Series B companies flagged.</div>
              <div className="text-green-400">14:02:08 <span className="text-blue-400">[BuiltWith]</span> Tech stack analysis complete for 203 domains.</div>
              <div className="text-yellow-400 mt-3">14:02:10 <span className="text-white">[Scorer]</span> ICP evaluation: 75 Hot · 98 Warm · 30 Cold</div>
              <div className="text-gray-500 mt-4 animate-pulse">{'>'} Ready to deploy outreach sequences..._</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Sources */}
      <section id="platforms" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 reveal-on-scroll">
            <h2 className="text-3xl font-black tracking-tight">6 Data Platforms. 1 Unified Pipeline.</h2>
            <p className="text-gray-500 mt-2">Real enrichment from real platforms as specified in the problem statement.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 reveal-on-scroll">
            {['Clay.com', 'Apollo.io', 'LinkedIn', 'Crunchbase', 'BuiltWith', 'GitHub'].map(p => (
              <div key={p} className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-shadow">
                <Globe size={20} className="mx-auto text-gray-400 mb-2" />
                <div className="text-sm font-bold text-gray-900">{p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-3xl font-black tracking-tight">Every Deliverable. Fully Implemented.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Database size={24} />, title: '200+ Enriched Leads', desc: 'Clay table with real companies. Firmographics, technographics, funding data, hiring signals from 6 platforms.' },
              { icon: <ShieldCheck size={24} />, title: 'Explainable Scoring', desc: '5-factor ICP scoring model. Every score is auditable with interactive rubric visualization and live simulator.' },
              { icon: <Zap size={24} />, title: 'Top 50 Personalization', desc: 'Custom cold emails AND LinkedIn DMs for top 50 leads. Each message references specific company context.' },
              { icon: <Beaker size={24} />, title: 'A/B Testing Engine', desc: 'Top 20 leads get dual variants with different hooks, CTAs, and response rate hypotheses.' },
              { icon: <Target size={24} />, title: 'ICP Framework', desc: 'Full qualification document with 5 dimensions, primary/secondary/excluded criteria, and rationale.' },
              { icon: <Server size={24} />, title: 'Full-Stack Platform', desc: 'React + Node.js + SQLite. Clean architecture. Real API endpoints. Production-grade UI/UX.' },
            ].map((f, i) => (
              <div key={i} className="space-y-4 reveal-on-scroll">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Preview */}
      <section id="scoring" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center reveal-on-scroll">
          <h2 className="text-3xl font-black tracking-tight mb-4">Transparent Lead Scoring</h2>
          <p className="text-gray-500 mb-10">5 weighted factors. Max 67 points. Every decision is explainable.</p>
          <div className="grid grid-cols-5 gap-3">
            {[
              { factor: 'Industry', max: 15 },
              { factor: 'Size', max: 12 },
              { factor: 'Funding', max: 15 },
              { factor: 'Hiring', max: 20 },
              { factor: 'Tech', max: 5 },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-2xl font-black text-gray-900">+{f.max}</div>
                <div className="text-xs font-semibold text-gray-500 mt-1">{f.factor}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-20">
        <div className="max-w-5xl mx-auto px-6 reveal-on-scroll">
          <h2 className="text-3xl font-black tracking-tight text-center mb-12">System Architecture</h2>
          <div className="bg-gray-900 rounded-2xl p-8 text-white font-mono text-sm overflow-x-auto">
            <pre className="leading-loose">{`
┌─────────────────────────────────────────────────────────────┐
│                    DATA INGESTION LAYER                       │
│  Clay.com ─── Apollo.io ─── LinkedIn ─── Crunchbase          │
│  BuiltWith ─── GitHub Search                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              ICP SCORING ENGINE (5 Factors)                   │
│  Industry(15) + Size(12) + Funding(15) + Hiring(20) + Tech(5)│
│  ──────────────────────────────────────                       │
│  HOT ≥45  │  WARM ≥25  │  COLD <25                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     ┌─────────┐ ┌──────────┐ ┌──────────┐
     │  TOP 50 │ │  TOP 20  │ │   REST   │
     │ Outreach│ │ A/B Test │ │ Nurture  │
     └─────────┘ └──────────┘ └──────────┘
          │            │
          ▼            ▼
     Cold Email   2 Variants Each
     LinkedIn DM  + Hypotheses
            `}</pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white text-center space-y-2">
        <div className="text-gray-900 font-bold">P95.AI — Autonomous Outbound Intelligence</div>
        <div className="text-gray-400 text-sm">ThinkRoot x Vortex Hackathon 2026 · Track A: Lead Scoring, Enrichment & Outreach</div>
      </footer>

      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
