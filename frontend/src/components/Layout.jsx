import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, Zap, Beaker, Target, Mail, LogOut } from 'lucide-react';
import AdvisorChat from './AdvisorChat';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: 'Clay Table', path: '/app', icon: <LayoutDashboard size={18} /> },
    { name: 'Scoring Engine', path: '/scoring', icon: <Shield size={18} /> },
    { name: 'Top 50 Outreach', path: '/outreach', icon: <Zap size={18} /> },
    { name: 'A/B Testing', path: '/ab-testing', icon: <Beaker size={18} /> },
    { name: 'ICP Framework', path: '/icp', icon: <Target size={18} /> },
    { name: 'Campaign Send', path: '/sender', icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <Link to="/" className="p-5 flex items-center gap-2 font-black text-gray-900 border-b border-gray-100 tracking-tight hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center text-sm font-black">P</div>
          P95.AI
        </Link>
        
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between z-10 sticky top-0">
          <h1 className="text-sm font-bold text-gray-900">
            {navItems.find(i => i.path === location.pathname)?.name || 'Platform'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-mono text-gray-400">203 leads · 6 platforms</div>
            <div className="font-mono text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">Online</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 z-0">
          {children}
        </main>
        
        <AdvisorChat />
      </div>
    </div>
  );
}
