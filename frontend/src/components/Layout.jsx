import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, Zap, Beaker, Target, Mail, LogOut, User, Globe } from 'lucide-react';
import AdvisorChat from './AdvisorChat';
import { useProfile } from '../context/ProfileContext';
import { useLang } from '../context/LangContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { profile } = useProfile();
  const { t, lang, switchLang, languages } = useLang();

  const langLabels = { en: 'EN', hi: 'हिं', es: 'ES', fr: 'FR' };

  const navItems = [
    { name: t('nav.clayTable'), path: '/app', icon: <LayoutDashboard size={18} /> },
    { name: t('nav.scoringEngine'), path: '/scoring', icon: <Shield size={18} /> },
    { name: t('nav.outreach'), path: '/outreach', icon: <Zap size={18} /> },
    { name: t('nav.abTesting'), path: '/ab-testing', icon: <Beaker size={18} /> },
    { name: t('nav.icp'), path: '/icp', icon: <Target size={18} /> },
    { name: t('nav.sender'), path: '/sender', icon: <Mail size={18} /> },
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
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Profile Link + Logout */}
        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <Link to="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/profile' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <User size={18} />
            {t('nav.profile')}
          </Link>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = "/login"; }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            <LogOut size={18} />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between z-10 sticky top-0">
          <h1 className="text-sm font-bold text-gray-900">
            {navItems.find(i => i.path === location.pathname)?.name || (location.pathname === '/profile' ? t('nav.profile') : 'Platform')}
          </h1>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200 p-0.5">
              {languages.map(l => (
                <button key={l} onClick={() => switchLang(l)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${lang === l ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                  {langLabels[l]}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono text-gray-400">203 {t('common.leads')} · 6 {t('common.platforms')}</div>
            <div className="font-mono text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">{t('common.online')}</div>

            {/* Profile Avatar */}
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={14} className="text-gray-400" />
                )}
              </div>
              {profile.name && <span className="text-xs font-semibold text-gray-700 hidden lg:block">{profile.name}</span>}
            </Link>
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
