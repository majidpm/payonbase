import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';

export default function Settings() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }
    setUser(user);
    setDisplayName(user.user_metadata?.display_name || '');
  }

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: displayName.trim() }
      });

      if (error) throw error;

      setUser(data.user);
      setMessage('✅ Profile updated successfully!');
      setMessageType('success');
      
      // به‌روزرسانی state
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err) {
      console.error('Update error:', err);
      setMessage('❌ Failed to update profile: ' + err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-blue-50'
    }`}>
      <Navbar />

      <div className="max-w-2xl mx-auto pt-16 pb-20 px-4">
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ⚙️ Settings
          </h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Manage your account preferences
          </p>
        </div>

        <div className={`rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-blue-100'
        }`}>
          <form onSubmit={updateProfile} className="space-y-6">
            {/* Email (غیرقابل تغییر) */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className={`w-full px-5 py-4 rounded-2xl border transition-colors duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-gray-400' 
                  : 'bg-gray-100 border-gray-200 text-gray-500'
              }`}>
                {user?.email}
              </div>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Email cannot be changed
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className={`w-full px-5 py-4 border rounded-2xl focus:outline-none text-lg transition-colors duration-300 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                    : 'bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-600'
                }`}
              />
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                This name will be displayed in the header
              </p>
            </div>

            {/* پیام */}
            {message && (
              <div className={`p-4 rounded-2xl text-center transition-colors duration-300 ${
                messageType === 'success'
                  ? isDark ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'
                  : isDark ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* دکمه‌ها */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !displayName.trim()}
                className={`flex-1 font-semibold py-4 rounded-2xl text-lg transition-all duration-300 ${
                  isDark
                    ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
                }`}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className={`px-6 py-4 rounded-2xl text-lg font-medium transition-colors duration-300 ${
                  isDark 
                    ? 'border border-gray-700 hover:bg-gray-800 text-gray-300' 
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* بخش امنیتی */}
          <div className={`mt-8 pt-8 border-t transition-colors duration-300 ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🔒 Security
            </h2>

            <div className={`p-4 rounded-2xl transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Change Password
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Update your account password
                  </p>
                </div>
                <button
                  onClick={() => {
                    // هدایت به صفحه تغییر رمز Supabase
                    supabase.auth.resetPasswordForEmail(user?.email || '', {
                      redirectTo: `${window.location.origin}/auth`,
                    });
                    setMessage('✅ Password reset email sent! Check your inbox.');
                    setMessageType('success');
                    setTimeout(() => setMessage(''), 5000);
                  }}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors duration-300 ${
                    isDark
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
                >
                  Reset Password
                </button>
              </div>
            </div>

            <div className={`mt-3 p-4 rounded-2xl transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Session Management
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Sign out from all devices
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to sign out from all devices?')) {
                      await supabase.auth.signOut();
                      navigate('/');
                    }
                  }}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors duration-300 ${
                    isDark
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Sign Out All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}