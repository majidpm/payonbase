import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg ${
            isDark ? 'bg-blue-500' : 'bg-blue-600'
          }`}>
            P
          </div>
          <div className="hidden sm:block">
            <h1 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              PayOnBase24
            </h1>
            <p className={`text-xs -mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              USDC • Base
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
              }`}
            >
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-base ${
                isDark ? 'bg-blue-500' : 'bg-blue-600'
              }`}>
                👤
              </div>
            </button>

            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 rounded-3xl shadow-2xl border py-2 z-50 ${
                isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-100'
              }`}>
                <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-blue-50'}`}>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                    isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <span>📊</span> Dashboard
                </button>
                <button
                  onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                    isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <span>⚙️</span> Settings
                </button>
                <button
                  onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                    isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  <span>{isDark ? '☀️' : '🌙'}</span>
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 ${
                    isDark ? 'hover:bg-red-950/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                  }`}
                >
                  <span>️</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-blue-100 bg-white'}`}>
          <div className="px-4 py-4 space-y-3">
            <div className={`pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.user_metadata?.display_name || user.email?.split('@')[0]}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {user.email}
              </p>
            </div>
            <button
              onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
                isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-blue-50 text-gray-700'
              }`}
            >
              <span></span> Dashboard
            </button>
            <button
              onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
                isDark ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-blue-50 text-gray-700'
              }`}
            >
              <span>⚙️</span> Settings
            </button>
            <button
              onClick={handleLogout}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${
                isDark ? 'hover:bg-red-950/30 text-red-400' : 'hover:bg-red-50 text-red-600'
              }`}
            >
              <span>⬅️</span> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}