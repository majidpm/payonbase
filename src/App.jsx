import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

import Landing from './pages/Landing';
import Create from './pages/Create';
import Pay from './pages/Pay';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/Auth';
import Settings from './pages/Settings';

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
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={user ? <Create /> : <Landing />} />
        <Route path="/pay/:slug" element={<Pay />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/settings" element={user ? <Settings /> : <Landing />} />
      </Routes>
    </BrowserRouter>
  );
}