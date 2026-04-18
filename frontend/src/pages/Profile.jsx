import { useState, useRef } from 'react';
import { Camera, Save, CheckCircle2, User } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useLang } from '../context/LangContext';

export default function Profile() {
  const { profile, updateProfile } = useProfile();
  const { t } = useLang();
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h2>
        <p className="text-gray-500 text-sm mt-1">{t('profile.subtitle')}</p>
      </div>

      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
            {form.avatar ? (
              <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-gray-300" />
            )}
          </div>
          <button onClick={() => fileRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-black transition-colors">
            <Camera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{form.name || 'Your Name'}</div>
          <div className="text-xs text-gray-500">{form.role || 'Your Role'} at {form.company || 'P95.AI'}</div>
          <button onClick={() => fileRef.current?.click()} className="text-xs text-blue-600 font-semibold mt-1 hover:text-blue-800">{t('profile.uploadPhoto')}</button>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t('profile.name')}</label>
            <input type="text" className="input-field bg-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t('profile.role')}</label>
            <input type="text" className="input-field bg-white" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="SDR / Growth Lead" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t('profile.company')}</label>
            <input type="text" className="input-field bg-white" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="P95.AI" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t('profile.email')}</label>
            <input type="email" className="input-field bg-white" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t('profile.age')}</label>
            <input type="number" className="input-field bg-white" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="25" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t('profile.bio')}</label>
          <textarea className="input-field bg-white min-h-[80px] resize-none" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell us about yourself..." />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={16} /> {t('profile.save')}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-semibold flex items-center gap-1 animate-in fade-in duration-300">
            <CheckCircle2 size={16} /> {t('profile.saved')}
          </span>
        )}
      </div>
    </div>
  );
}
