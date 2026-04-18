import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, Zap, Beaker, Target, Mail, LogOut, User, Globe, Sun, Moon } from 'lucide-react';
import AdvisorChat from './AdvisorChat';
import { useProfile } from '../context/ProfileContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { profile } = useProfile();
  const { t, lang, switchLang, languages } = useLang();
  const { dark, toggle } = useTheme();

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
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="w-60 flex flex-col" style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-primary)' }}>
        <Link to="/" className="p-5 flex items-center gap-2 font-black tracking-tight hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-primary)' }}>
          <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-black" style={{ background: 'var(--btn-bg)', color: 'var(--btn-text)' }}>P</div>
          P95.AI
        </Link>
        
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}>
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid var(--border-primary)' }}>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              background: location.pathname === '/profile' ? 'var(--bg-tertiary)' : 'transparent',
              color: location.pathname === '/profile' ? 'var(--text-primary)' : 'var(--text-tertiary)'
            }}>
            <User size={18} />
            {t('nav.profile')}
          </Link>
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = "/login"; }}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sm font-medium transition-colors"
            style={{ color: 'var(--text-tertiary)' }}>
            <LogOut size={18} />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        <header className="h-14 flex items-center px-6 justify-between z-10 sticky top-0" style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--border-primary)' }}>
          <h1 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {navItems.find(i => i.path === location.pathname)?.name || (location.pathname === '/profile' ? t('nav.profile') : 'Platform')}
          </h1>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              title={dark ? 'Switch to Light' : 'Switch to Dark'}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: 'var(--bg-tertiary)' }}>
              {languages.map(l => (
                <button key={l} onClick={() => switchLang(l)}
                  className="px-2 py-1 rounded text-[11px] font-bold transition-colors"
                  style={{
                    background: lang === l ? 'var(--btn-bg)' : 'transparent',
                    color: lang === l ? 'var(--btn-text)' : 'var(--text-tertiary)'
                  }}>
                  {langLabels[l]}
                </button>
              ))}
            </div>

            <div className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ color: 'var(--text-tertiary)' }}>203 {t('common.leads')}</div>
            <div className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'var(--badge-cold-bg)', color: '#22c55e', border: '1px solid #166534' }}>{t('common.online')}</div>

            {/* Profile Avatar */}
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={14} style={{ color: 'var(--text-tertiary)' }} />
                )}
              </div>
              {profile.name && <span className="text-xs font-semibold hidden lg:block" style={{ color: 'var(--text-secondary)' }}>{profile.name}</span>}
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
