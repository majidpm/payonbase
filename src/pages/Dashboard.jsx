import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const { isDark } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      const { data, error } = await supabase
        .from('payment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function copyLink(slug, id) {
    const link = `${window.location.origin}/pay/${slug}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function cancelPayment(id) {
    if (!window.confirm('Are you sure you want to cancel this payment link?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('payment')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setPayments(payments.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to cancel payment link');
    } finally {
      setDeletingId(null);
    }
  }

  function viewOnBasescan(txHash) {
    if (txHash) {
      window.open(`https://basescan.org/tx/${txHash}`, '_blank');
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-gray-950 text-white' : 'bg-blue-50 text-gray-900'
      }`}>
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-blue-50'
    }`}>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pt-8 sm:pt-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
          <h1 className={`text-2xl sm:text-4xl font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            📊 Dashboard
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            + New PayLink
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className={`text-lg sm:text-2xl transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              You haven't created any payment links yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-block mt-6 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-blue-700"
            >
              Create Your First PayLink
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {payments.map((p) => (
              <div
                key={p.id}
                className={`rounded-3xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all ${
                  isDark ? 'bg-gray-900' : 'bg-white'
                }`}
              >
                <div className="flex justify-center mb-4 sm:mb-6">
                  <QRCode
                    size={120}
                    value={`${window.location.origin}/pay/${p.slug}`}
                    bgColor="#ffffff"
                    fgColor="#1e293b"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4 text-center">
                  <p className={`font-mono text-xs sm:text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    /{p.slug}
                  </p>
                  <p className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {p.amount} <span className="text-lg sm:text-xl font-normal">USDC</span>
                  </p>
                  <div className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                    p.paid
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {p.paid ? '✅ Paid' : ' Pending'}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {!p.paid ? (
                      <>
                        <button
                          onClick={() => copyLink(p.slug, p.id)}
                          className={`flex-1 py-2 sm:py-3 rounded-2xl font-medium transition text-sm sm:text-base ${
                            isDark
                              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {copiedId === p.id ? '✅ Copied!' : 'Copy Link'}
                        </button>
                        <button
                          onClick={() => cancelPayment(p.id)}
                          disabled={deletingId === p.id}
                          className={`flex-1 py-2 sm:py-3 rounded-2xl font-medium transition disabled:opacity-50 text-sm sm:text-base ${
                            isDark
                              ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400'
                              : 'bg-red-100 hover:bg-red-200 text-red-700'
                          }`}
                        >
                          {deletingId === p.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </>
                    ) : (
                      p.tx_hash && (
                        <button
                          onClick={() => viewOnBasescan(p.tx_hash)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 sm:py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                          🔗 View on Basescan
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}