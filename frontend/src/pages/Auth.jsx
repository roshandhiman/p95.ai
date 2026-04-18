import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setSession }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // In a real app we'd call the backend API here.
    // For this hackathon demo, we will simulate a successful login/signup
    // after 500ms and store a dummy JWT token.
    setTimeout(() => {
      const mockToken = "mock_jwt_token_" + Date.now();
      localStorage.setItem('token', mockToken);
      setSession(mockToken);
      navigate('/');
    }, 500);
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
