import { Target, Building2, Users, DollarSign, Cpu, TrendingUp } from 'lucide-react';

const icpDimensions = [
  { icon: <Building2 size={20} />, title: 'Industry Vertical', primary: 'AI/ML, SaaS', secondary: 'Cloud Infra, Data Analytics, DevTools', excluded: 'Hardware, Manufacturing, Retail', rationale: 'AI/ML companies have the strongest product-market fit for autonomous ML training infrastructure. SaaS companies at scale face similar ML pipeline challenges.' },
  { icon: <Users size={20} />, title: 'Company Size', primary: '50-200 employees', secondary: '200-500 employees', excluded: '1-50 (too early), 500+ (enterprise sales cycle)', rationale: 'The 50-200 sweet spot indicates a company large enough to need ML infrastructure but small enough to adopt quickly without procurement friction.' },
  { icon: <DollarSign size={20} />, title: 'Funding Stage', primary: 'Series B', secondary: 'Series C', excluded: 'Pre-seed, Seed (no budget), Series D+ (already built)', rationale: 'Series B companies have just raised capital to scale. They need to build ML infra but cannot yet justify a full MLOps team — making them ideal P95.AI customers.' },
  { icon: <Cpu size={20} />, title: 'Tech Stack Signals', primary: 'Python, PyTorch, TensorFlow', secondary: 'Go, Rust (systems-oriented)', excluded: 'PHP, WordPress (non-technical)', rationale: 'Python/PyTorch stack signals active ML development. These companies are already investing in model training and would benefit most from infrastructure automation.' },
  { icon: <TrendingUp size={20} />, title: 'Hiring Signals', primary: 'Active MLE/ML Eng job postings', secondary: 'Data Engineering hires', excluded: 'No technical hiring activity', rationale: 'Hiring MLEs is the strongest buy-intent signal. It indicates the company needs ML capabilities NOW — but we can deliver results faster than a new hire ramps up.' },
];

const platforms = [
  { name: 'Clay.com', role: 'Primary enrichment backbone', data: 'Company firmographics, technographics, funding data, team size' },
  { name: 'Apollo.io', role: 'Contact discovery & verification', data: 'Email addresses, direct phone, job titles, seniority levels' },
  { name: 'LinkedIn Sales Nav', role: 'Hiring signal detection', data: 'Active job postings, headcount trends, decision-maker profiles' },
  { name: 'Crunchbase', role: 'Funding intelligence', data: 'Funding rounds, investors, valuations, growth metrics' },
  { name: 'BuiltWith', role: 'Technology stack analysis', data: 'Frontend/backend frameworks, cloud providers, analytics tools' },
  { name: 'GitHub Search', role: 'Technical depth validation', data: 'Public repos, ML frameworks used, engineering team activity' },
];

export default function ICPFramework() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Target size={24} /> ICP Framework Document</h2>
        <p className="text-gray-500 text-sm mt-1">Ideal Customer Profile for P95.AI agentic ML training infrastructure. All scoring decisions trace back to these criteria.</p>
      </div>

      {/* Target Company Profile */}
      <div className="card p-6 bg-gray-900 text-white">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Target Company Profile</div>
        <div className="text-xl font-bold">Series B AI/SaaS company, 50-200 employees, actively hiring ML Engineers, running Python/PyTorch stacks</div>
        <div className="text-sm text-gray-400 mt-2">This profile maximizes product-market fit, minimizes sales cycle, and targets companies with immediate infrastructure pain.</div>
      </div>

      {/* ICP Dimensions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Qualification Dimensions</h3>
        {icpDimensions.map((dim, i) => (
          <div key={i} className="card p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 flex-shrink-0 mt-0.5">{dim.icon}</div>
              <div className="flex-1 space-y-3">
                <div className="font-bold text-gray-900">{dim.title}</div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-[10px] uppercase font-bold text-green-600 tracking-wider mb-1">Primary Target</div>
                    <div className="text-sm font-semibold text-green-800">{dim.primary}</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-[10px] uppercase font-bold text-yellow-600 tracking-wider mb-1">Secondary</div>
                    <div className="text-sm font-semibold text-yellow-800">{dim.secondary}</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-[10px] uppercase font-bold text-red-600 tracking-wider mb-1">Excluded</div>
                    <div className="text-sm font-semibold text-red-800">{dim.excluded}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200 italic">{dim.rationale}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Platform Sources */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Multi-Platform Data Sources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {platforms.map((p, i) => (
            <div key={i} className="card p-4 hover:shadow-sm transition-shadow">
              <div className="font-bold text-gray-900 text-sm">{p.name}</div>
              <div className="text-xs text-blue-600 font-semibold mt-1">{p.role}</div>
              <div className="text-xs text-gray-500 mt-2">{p.data}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
