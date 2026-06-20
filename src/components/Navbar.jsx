import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  if (loading || !user) return null;

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-blue-100'
    }`}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          {/* ===== لوگو دایره با P ===== */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors duration-300 ${
            isDark ? 'bg-blue-500' : 'bg-blue-600'
          }`}>
            P
          </div>
          <div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              PayonBase24
            </h1>
            <p className={`text-xs -mt-1 transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              USDC • Base Network
            </p>
          </div>
        </div>

        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors duration-300 ${
                isDark 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-blue-50'
              }`}
            >
              <div className="text-right">
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </p>
                <p className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {user.email}
                </p>
              </div>
              {/* ===== آواتار دایره با آدمک ===== */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-base transition-colors duration-300 ${
                isDark ? 'bg-blue-500' : 'bg-blue-600'
              }`}>
                👤
              </div>
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-3xl shadow-2xl border py-2 z-50 transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-blue-100'
              }`}>
                <div className={`px-4 py-3 border-b transition-colors duration-300 ${
                  isDark ? 'border-gray-700' : 'border-blue-50'
                }`}>
                  <p className={`font-medium transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user.email}
                  </p>
                </div>

                <a 
                  href="/dashboard" 
                  className={`block px-4 py-3 transition-colors duration-300 flex items-center gap-3 ${
                    isDark 
                      ? 'hover:bg-gray-800 text-gray-200' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <span>📊</span> Dashboard
                </a>

                <a 
                  href="/settings" 
                  className={`block px-4 py-3 transition-colors duration-300 flex items-center gap-3 ${
                    isDark 
                      ? 'hover:bg-gray-800 text-gray-200' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <span>⚙️</span> Settings
                </a>

                <button
                  onClick={() => {
                    toggleTheme();
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors duration-300 flex items-center gap-3 ${
                    isDark 
                      ? 'hover:bg-gray-800 text-gray-200' 
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <span>{isDark ? '☀️' : '🌙'}</span> 
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-3 transition-colors duration-300 flex items-center gap-3 ${
                    isDark 
                      ? 'hover:bg-red-950/30 text-red-400' 
                      : 'hover:bg-red-50 text-red-600'
                  }`}
                >
                  <span>⬅️</span> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}