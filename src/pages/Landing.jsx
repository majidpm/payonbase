import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Animated counter
function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Animated section wrapper
function AnimatedSection({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`transform transition-all duration-700 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    { icon: '💳', title: 'PayLink', description: 'Create instant payment links on Base Network. Share and receive USDC in seconds.', color: 'from-blue-500 to-cyan-500', stats: '10k+ Links' },
    { icon: '💝', title: 'Donation Page', description: 'Your personal donation page at /u/yourname. Receive tips from your community 24/7.', color: 'from-pink-500 to-rose-500', stats: '$50k+ Raised' },
    { icon: '✈️', title: 'Travel Fund', description: 'Crowdfund your trips with friends. Track progress and collect contributions easily.', color: 'from-purple-500 to-violet-500', stats: '500+ Trips' },
    { icon: '🧮', title: 'Split Expenses', description: 'Fair expense splitting for group travels. Auto-calculate who owes what.', color: 'from-emerald-500 to-green-500', stats: '5k+ Splits' }
  ];

  const stats = [
    { value: 100, label: 'Zero Platform Fees', icon: '💰', suffix: '%' },
    { value: 5, label: 'Second Transactions', icon: '⚡', suffix: 's' },
    { value: 24, label: 'Hours Available', icon: '🌍', suffix: '/7' },
    { value: 100, label: 'Percent Secure', icon: '🔒', suffix: '%' }
  ];

  const testimonials = [
    { name: 'Sarah M.', role: 'Content Creator', text: 'PayOnBase24 revolutionized how I receive tips from my audience. Super fast and zero fees!', avatar: '👩‍🎨' },
    { name: 'Alex K.', role: 'Travel Blogger', text: 'The Travel Fund feature is amazing! Raised $3000 for my Bali trip in just 2 weeks.', avatar: '🧑‍✈️' },
    { name: 'Mike R.', role: 'Freelancer', text: 'Best payment solution for crypto. My clients love how easy it is to pay me.', avatar: '👨‍💻' }
  ];

  const howItWorks = [
    { step: '01', title: 'Create Account', description: 'Sign up in seconds with email or Google. No complicated verification.', icon: '👤', color: 'from-blue-500 to-blue-600' },
    { step: '02', title: 'Choose Feature', description: 'Select PayLink, Donation, Travel Fund, or Split Expenses.', icon: '🎯', color: 'from-purple-500 to-purple-600' },
    { step: '03', title: 'Connect Wallet', description: 'Link your MetaMask or any Web3 wallet on Base Network.', icon: '🦊', color: 'from-pink-500 to-pink-600' },
    { step: '04', title: 'Start Receiving', description: 'Share your link and receive USDC payments instantly.', icon: '💵', color: 'from-emerald-500 to-emerald-600' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Animated gradient background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'}, transparent 40%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? (isDark ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10' : 'bg-white/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${isDark ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
              P
            </div>
            <div>
              <h1 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                PayOnBase24
              </h1>
              <p className={`text-[10px] sm:text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                USDC • Base Network
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => navigate('/auth')}
              className={`hidden sm:block px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/20'}`} />
          <div className={`absolute -bottom-40 -left-40 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/20'}`} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <AnimatedSection>
              <div className={`inline-block px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-8 ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                🚀 The Future of Crypto Payments is Here
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-8 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Send, Receive & Split
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  {' '}Crypto Payments
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <p className={`text-base sm:text-xl md:text-2xl max-w-4xl mx-auto mb-6 sm:mb-12 leading-relaxed px-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                All-in-one platform for USDC payments on Base Network. 
                Create payment links, receive donations, fund trips, and split expenses — <span className="font-semibold text-blue-600">all in one place</span>.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={600}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center px-4">
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-base sm:text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2 sm:gap-3"
                >
                  Start Free Now
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-base sm:text-xl font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-900 shadow-xl border border-gray-200'}`}
                >
                  Explore Features
                </button>
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection delay={800}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto mt-12 sm:mt-20 px-2">
                {stats.map((stat, idx) => (
                  <div key={idx} className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-900/80 border border-gray-800' : 'bg-white/80 shadow-lg border border-gray-100'}`}>
                    <div className="text-2xl sm:text-4xl mb-2">{stat.icon}</div>
                    <div className={`text-2xl sm:text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className={`py-16 sm:py-20 md:py-32 px-4 sm:px-6 ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-20">
              <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Everything You Need
              </h2>
              <p className={`text-lg sm:text-xl md:text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Four powerful tools in one platform
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            {features.map((feature, idx) => (
              <AnimatedSection key={idx} delay={idx * 150}>
                <div
                  className={`group p-5 sm:p-10 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800 hover:border-transparent' : 'bg-white border-gray-200 hover:border-transparent shadow-xl'}`}
                  onClick={() => navigate('/auth')}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-5xl mb-4 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-xl sm:text-3xl font-bold mb-2 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm sm:text-lg mb-4 sm:mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className={`inline-flex items-center gap-2 font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent text-sm sm:text-base`}>
                        Get Started →
                      </div>
                      <div className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                        {feature.stats}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-20">
              <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How It Works
              </h2>
              <p className={`text-lg sm:text-xl md:text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Get started in 4 simple steps
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {howItWorks.map((item, idx) => (
              <AnimatedSection key={idx} delay={idx * 150}>
                <div className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl text-center transition-all duration-500 hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-xl border border-gray-100'}`}>
                  <div className={`text-3xl sm:text-6xl mb-3 sm:mb-6 font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.step}
                  </div>
                  <div className={`w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-5xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-sm sm:text-2xl font-bold mb-1 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-16 sm:py-20 md:py-32 px-4 sm:px-6 ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12 sm:mb-20">
              <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Loved by Thousands
              </h2>
              <p className={`text-lg sm:text-xl md:text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                See what our users say
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <AnimatedSection key={idx} delay={idx * 150}>
                <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl transition-all duration-500 hover:scale-105 ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-xl border border-gray-100'}`}>
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{testimonial.avatar}</div>
                  <p className={`text-sm sm:text-lg mb-4 sm:mb-6 italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className={`relative p-6 sm:p-16 rounded-2xl sm:rounded-3xl overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" />
              </div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-12 max-w-3xl mx-auto px-2">
                  Join thousands of users already using PayOnBase24 for seamless crypto payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center px-2">
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-white text-blue-600 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-base sm:text-xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-base sm:text-xl font-bold transition-all duration-300 hover:scale-105 hover:bg-white/20"
                  >
                    View Demo
                  </button>
                </div>
                <p className="text-white/70 mt-4 sm:mt-8 text-xs sm:text-sm px-2">
                  No credit card required • Free forever • Setup in 2 minutes
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 sm:py-12 md:py-16 px-4 sm:px-6 border-t ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mb-8 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl bg-gradient-to-br ${isDark ? 'from-blue-500 to-purple-600' : 'from-blue-600 to-blue-700'}`}>
                  P
                </div>
                <h3 className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  PayOnBase24
                </h3>
              </div>
              <p className={`text-xs sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                The future of crypto payments on Base Network.
              </p>
            </div>
            <div>
              <h4 className={`font-bold mb-3 sm:mb-6 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Product</h4>
              <ul className={`space-y-1.5 sm:space-y-3 text-xs sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">PayLink</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Donations</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Travel Fund</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Split Expenses</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-3 sm:mb-6 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Company</h4>
              <ul className={`space-y-1.5 sm:space-y-3 text-xs sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">About</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Blog</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Careers</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-3 sm:mb-6 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
              <ul className={`space-y-1.5 sm:space-y-3 text-xs sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Privacy</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Terms</li>
                <li className="cursor-pointer hover:text-blue-600 transition-colors">Security</li>
              </ul>
            </div>
          </div>
          <div className={`pt-6 sm:pt-8 border-t text-center ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-600'}`}>
            <p className="text-xs sm:text-base">© 2024 PayOnBase24. Built on Base Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}