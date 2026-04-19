import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Auth({ setSession }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { full_name: email.split('@')[0] }
          }
        });
        if (error) throw error;
        
        if (data?.session) {
          setSuccess('Account created! Logging you in...');
        } else {
          setSuccess('Account created! Sign in to continue.');
          setIsLogin(true);
          return;
        }
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem('token', session.access_token);
        setSession(session.access_token);
        navigate('/app');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemoMode = () => {
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('token', 'demo-token');
    setSession('demo-token');
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="card max-w-sm w-full p-8 shadow-2xl border-gray-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md">
            P
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? 'Enter your credentials to access the engine' : 'Initialize your workspace'}
          </p>
        </div>

        {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">{error}</div>}
        {success && <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg animate-in fade-in slide-in-from-top-1">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-6 py-2.5 shadow-md">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          {isLogin && (
            <button 
              type="button" 
              onClick={handleDemoMode}
              className="w-full mt-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
            >
              Try Demo Mode
            </button>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already initialized? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-900 font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
