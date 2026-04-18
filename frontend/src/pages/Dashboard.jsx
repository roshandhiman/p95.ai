import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Flame, Thermometer, Snowflake, Search } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // Fetch from local backend
      const { data } = await axios.get('/api/leads');
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      // Fallback for hackathon demo in case backend isn't up
      setLeads([
        { id: 1, name: 'Acme AI', industry: 'SaaS', size: '50-200', hiring: true, score: 'Hot' },
        { id: 2, name: 'Globex Corp', industry: 'Fintech', size: '200-500', hiring: false, score: 'Warm' },
        { id: 3, name: 'Soylent Inc', industry: 'Foodtech', size: '1-50', hiring: false, score: 'Cold' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const safeLeads = Array.isArray(leads) ? leads : [];
  const filteredLeads = safeLeads.filter(l => l.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const hotCount = safeLeads.filter(l => l.score === 'Hot').length;
  const warmCount = safeLeads.filter(l => l.score === 'Warm').length;
  const coldCount = safeLeads.filter(l => l.score === 'Cold').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5 border-l-4 border-l-gray-900">
          <div className="text-sm font-semibold text-gray-500 mb-1">Total Leads</div>
          <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
        </div>
        <div className="card p-5 border-l-4 border-l-red-500 bg-red-50/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-1">
            <Flame size={16} /> Hot Prospects
          </div>
          <div className="text-3xl font-bold text-red-900">{hotCount}</div>
        </div>
        <div className="card p-5 border-l-4 border-l-yellow-500 bg-yellow-50/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-yellow-700 mb-1">
            <Thermometer size={16} /> Warm Intros
          </div>
          <div className="text-3xl font-bold text-yellow-900">{warmCount}</div>
        </div>
        <div className="card p-5 border-l-4 border-l-blue-400 bg-blue-50/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-1">
            <Snowflake size={16} /> Cold
          </div>
          <div className="text-3xl font-bold text-blue-900">{coldCount}</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-900">Intelligence Pipeline</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="input-field pl-9 h-9 text-sm bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3 font-semibold">Company</th>
                <th className="px-6 py-3 font-semibold">Industry</th>
                <th className="px-6 py-3 font-semibold">Size</th>
                <th className="px-6 py-3 font-semibold">Hiring MLEs?</th>
                <th className="px-6 py-3 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse bg-gray-50/50">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                    </tr>
                  ))}
                </>
              ) : filteredLeads.map((lead, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.industry}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.size}</td>
                  <td className="px-6 py-4">
                    {lead.hiring ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                      ${lead.score === 'Hot' ? 'bg-red-100 text-red-800 border-red-200' : 
                        lead.score === 'Warm' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                        'bg-blue-100 text-blue-800 border-blue-200'}`}
                    >
                      {lead.score === 'Hot' && <Flame size={12} className="mr-1" />}
                      {lead.score === 'Warm' && <Thermometer size={12} className="mr-1" />}
                      {lead.score === 'Cold' && <Snowflake size={12} className="mr-1" />}
                      {lead.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
