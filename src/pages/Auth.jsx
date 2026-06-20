import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    console.log('Starting auth...', isLogin ? 'login' : 'signup');

    try {
      if (isLogin) {
        console.log('Attempting login with:', email);
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        console.log('Login response:', { data, error });
        if (error) throw error;
        console.log('Login successful, navigating to /');
        navigate('/');
      } else {
        console.log('Attempting signup with:', email);
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        console.log('Signup response:', { data, error });
        if (error) throw error;
        alert('Check your email for confirmation link!');
        // بعد از ثبت نام، به لاگین برمیگردیم
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">PayonBase24</h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Sign in to continue' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl text-lg transition-all"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-600 hover:underline"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}