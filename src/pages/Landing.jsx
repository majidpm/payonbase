import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setIsDark(savedDark);
    if (savedDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-blue-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-blue-100'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-colors duration-300 ${
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

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/auth')}
              className={`px-6 py-2 rounded-2xl font-medium transition-colors duration-300 ${
                isDark 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/auth')}
              className={`px-6 py-2 rounded-2xl font-semibold transition-colors duration-300 ${
                isDark
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center">
         
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Send USDC
            <span className="text-blue-600 dark:text-blue-400"> Instantly</span>
          </h1>
          
          <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-10 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create secure payment links on Base Network. 
            No signup required for payers. Just click, connect wallet, and pay.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Create Payment Link →
            </button>
            <a
              href="#features"
              className={`px-8 py-4 rounded-2xl text-lg font-medium transition-colors duration-300 ${
                isDark
                  ? 'border border-gray-700 hover:bg-gray-800 text-gray-300'
                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
              }`}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Why <span className="text-blue-600 dark:text-blue-400">PayonBase24</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className={`p-8 rounded-3xl border transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gray-900 border-gray-800 hover:border-blue-500' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}>
            <div className="text-5xl mb-4">⚡</div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Instant Creation
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Create payment links in seconds. No waiting, no delays.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gray-900 border-gray-800 hover:border-blue-500' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}>
            <div className="text-5xl mb-4">🔒</div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Secure & Trustless
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Built on Base Network. No middlemen. You control your funds.
            </p>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-gray-900 border-gray-800 hover:border-blue-500' 
              : 'bg-white border-blue-100 hover:border-blue-300'
          }`}>
            <div className="text-5xl mb-4">🎯</div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              No Signup for Payers
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Payers don't need an account. Just connect wallet and pay.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          How It <span className="text-blue-600 dark:text-blue-400">Works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
              isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              1
            </div>
            <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Create Link
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Enter wallet address and amount. Generate a unique payment link.
            </p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
              isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              2
            </div>
            <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Share Link
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Copy and share the payment link with anyone, anywhere.
            </p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
              isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              3
            </div>
            <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Get Paid
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Payer connects wallet and sends USDC. You receive instantly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className={`rounded-3xl p-12 text-center border transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-blue-100'
        }`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Start?
          </h2>
          <p className={`text-lg mb-8 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create your first payment link in less than a minute.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className={`px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Get Started Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 ${
        isDark ? 'border-gray-800' : 'border-blue-100'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
            © 2024 PayonBase24. Built on Base Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}