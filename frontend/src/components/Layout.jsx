import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Zap, Mail, LogOut } from 'lucide-react';
import AdvisorChat from './AdvisorChat';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: 'Intelligence', path: '/app', icon: <LayoutDashboard size={18} /> },
    { name: 'AI Outreach', path: '/outreach', icon: <Zap size={18} /> },
    { name: 'Mail Sender', path: '/sender', icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-2 font-bold text-gray-900 border-b border-gray-100">
          <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center">
            P
          </div>
          P95.AI Engine
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

        <div className="p-4 border-t border-gray-100">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between z-10 sticky top-0">
          <h1 className="text-lg font-bold text-gray-900">
            {navItems.find(i => i.path === location.pathname)?.name || 'Platform'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="badge border border-green-200 bg-green-50 text-green-700 font-mono text-xs px-2 py-1 rounded">
              System Online
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 z-0">
          <div className="max-w-5xl mx-auto h-full">
            {children}
          </div>
        </main>
        
        {/* Persistent AI Advisor Panel overlay */}
        <AdvisorChat />
      </div>
    </div>
  );
}
