import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export default function SidebarLayout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paylinkExpanded, setPaylinkExpanded] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileData) {
      setProfile(profileData);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-950 text-white' : 'bg-blue-50 text-gray-900'
      }`}>
        Loading...
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-blue-50'
    }`}>
      {/* سایدبار سمت چپ */}
      <aside className={`w-72 fixed h-full border-r flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
      }`}>
        {/* لوگو */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-blue-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
              isDark ? 'bg-blue-500' : 'bg-blue-600'
            }`}>
              P
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PayOnBase24
              </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                USDC • Base Network
              </p>
            </div>
          </div>
        </div>

        {/* منوی اصلی */}
        <nav className="flex-1 p-4 space-y-2">
          {/* PayLink با Submenu */}
          <div>
            <button
              onClick={() => setPaylinkExpanded(!paylinkExpanded)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                isActive('/') || isActive('/dashboard')
                  ? isDark
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div className="text-left">
                  <p className="font-semibold">PayLink</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Create & manage links
                  </p>
                </div>
              </div>
              <span className={`text-xs transition-transform duration-300 ${paylinkExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Submenu Items */}
            {paylinkExpanded && (
              <div className={`ml-6 mt-2 space-y-1 pl-4 border-l-2 ${
                isDark ? 'border-gray-700' : 'border-blue-200'
              }`}>
                <button
                  onClick={() => navigate('/')}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                    location.pathname === '/'
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-gray-900'
                  }`}
                >
                  + Create New Link
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
                    location.pathname === '/dashboard'
                      ? isDark
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : isDark
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-gray-900'
                  }`}
                >
                  📊 Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Donation */}
          <button
            onClick={() => navigate('/donation')}
            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
              isActive('/donation')
                ? isDark
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
                : isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl">💝</span>
            <div>
              <p className="font-semibold">Donation</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Receive donations
              </p>
            </div>
          </button>

          {/* TravelFund */}
          <button
            onClick={() => navigate('/travel')}
            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
              isActive('/travel')
                ? isDark
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
                : isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl">✈️</span>
            <div>
              <p className="font-semibold">TravelFund</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Split expenses
              </p>
            </div>
          </button>
        </nav>

        {/* بخش پایین سایدبار */}
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-gray-800' : 'border-blue-100'}`}>
          {/* تنظیمات */}
          <button
            onClick={() => navigate('/settings')}
            className={`w-full text-left px-4 py-3 rounded-2xl transition-colors duration-300 flex items-center gap-3 ${
              isActive('/settings')
                ? isDark
                  ? 'bg-gray-800 text-white'
                  : 'bg-blue-50 text-gray-900'
                : isDark
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl">⚙️</span>
            <span className="font-semibold">Settings</span>
          </button>

          {/* تغییر تم */}
          <button
            onClick={toggleTheme}
            className={`w-full text-left px-4 py-3 rounded-2xl transition-colors duration-300 flex items-center gap-3 ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'
            }`}
          >
            <span className="text-2xl">{isDark ? '☀️' : '🌙'}</span>
            <span className="font-semibold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* پروفایل کاربر */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                isDark ? 'bg-blue-500' : 'bg-blue-600'
              }`}>
                {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {profile?.display_name || user?.email?.split('@')[0]}
                </p>
                <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.email}
                </p>
              </div>
            </div>
            {profile?.username && (
              <button
                onClick={() => navigate(`/u/${profile.username}`)}
                className={`w-full text-xs py-2 rounded-xl transition-colors duration-300 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                View Public Profile →
              </button>
            )}
            <button
              onClick={handleLogout}
              className={`w-full mt-2 text-xs py-2 rounded-xl transition-colors duration-300 ${
                isDark
                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                  : 'bg-red-50 hover:bg-red-100 text-red-600'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 ml-72">
        {children}
      </main>
    </div>
  );
}