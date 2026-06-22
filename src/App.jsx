import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Landing from './pages/Landing';
import Create from './pages/Create';
import Pay from './pages/Pay';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/Auth';
import Settings from './pages/Settings';
import PublicProfile from './pages/PublicProfile';
import Donation from './pages/Donation';
import TravelFund from './pages/TravelFund';
import SidebarLayout from './components/SidebarLayout';
import PublicFund from './pages/PublicFund';


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* صفحات عمومی */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/pay/:slug" element={<Pay />} />
        <Route path="/trip/:slug" element={<PublicFund />} />

        {/* صفحات خصوصی با سایدبار */}
        <Route path="/" element={
          user ? <SidebarLayout><Create /></SidebarLayout> : <Landing />
        } />
        <Route path="/dashboard" element={
          user ? <SidebarLayout><Dashboard /></SidebarLayout> : <Landing />
        } />
        <Route path="/donation" element={
          user ? <SidebarLayout><Donation /></SidebarLayout> : <Landing />
        } />
        <Route path="/travel" element={
          user ? <SidebarLayout><TravelFund /></SidebarLayout> : <Landing />
        } />
        <Route path="/settings" element={
          user ? <SidebarLayout><Settings /></SidebarLayout> : <Landing />
        } />
      </Routes>
    </BrowserRouter>
  );
}