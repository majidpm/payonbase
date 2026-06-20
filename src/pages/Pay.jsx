import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { supabase } from '../lib/supabase';
import QRCode from 'react-qr-code';
import Navbar from '../components/Navbar';
import { useTheme } from '../contexts/ThemeContext';

export default function Pay() {
  const { isDark } = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [user, setUser] = useState(null);
  const [signatureValid, setSignatureValid] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [needsSign, setNeedsSign] = useState(false);
  const [payerAddress, setPayerAddress] = useState(null);

  const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

  const isWalletInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  useEffect(() => {
    loadPayment();
    loadUser();
    
    const interval = setInterval(checkPaymentStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (account && payerAddress) {
      // آپدیت وضعیت payer هر بار که account یا payerAddress تغییر میکنه
    }
  }, [account, payerAddress]);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function loadPayment() {
    try {
      const { data, error } = await supabase
        .from('payment')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPayment(data);
      
      if (data.paid && data.payer_address) {
        setPayerAddress(data.payer_address);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function checkSignatureValidity(address) {
    try {
      const { data, error } = await supabase
        .from('wallet_signatures')
        .select('*')
        .eq('wallet_address', address)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Check signature error:', error);
        return false;
      }

      if (data && data.length > 0) {
        setSignatureValid(true);
        setNeedsSign(false);
        setStatus('✅ Wallet verified');
        return true;
      } else {
        setSignatureValid(false);
        setNeedsSign(true);
        setStatus('⚠️ Please sign to verify your wallet');
        return false;
      }
    } catch (err) {
      console.error('Signature check error:', err);
      setSignatureValid(false);
      setNeedsSign(true);
      return false;
    }
  }

  async function signMessage() {
    if (!account) {
      setStatus('❌ Please connect wallet first');
      return;
    }

    if (!isWalletInstalled()) {
      setStatus('❌ Please install MetaMask!');
      return;
    }

    setSignatureLoading(true);
    setStatus('⏳ Please sign the message in your wallet...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const message = `PayonBase24 - Wallet Verification\nDomain: ${window.location.origin}\nAddress: ${account}\nTimestamp: ${Date.now()}\nExpires: 1 hour`;
      
      const signature = await signer.signMessage(message);

      const { error } = await supabase
        .from('wallet_signatures')
        .insert({
          wallet_address: account,
          signature: signature,
          message: message,
          user_id: user?.id || null,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        });

      if (error) {
        console.error('Save signature error:', error);
        throw error;
      }

      setSignatureValid(true);
      setNeedsSign(false);
      setStatus('✅ Wallet verified successfully!');
      
      setTimeout(() => {
        setSignatureValid(false);
        setNeedsSign(true);
        setStatus('⏳ Signature expired. Please sign again.');
      }, 60 * 60 * 1000);

    } catch (err) {
      console.error('Sign error:', err);
      if (err.code === 'ACTION_REJECTED') {
        setStatus('❌ Signing rejected by user');
      } else {
        setStatus('❌ Failed to sign message: ' + err.message);
      }
      setSignatureValid(false);
      setNeedsSign(true);
    } finally {
      setSignatureLoading(false);
    }
  }

  async function checkPaymentStatus() {
    if (!payment || payment.paid) return;
    
    try {
      const { data, error } = await supabase
        .from('payment')
        .select('paid, tx_hash, payer_address, is_active')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      
      if (data.paid && !payment.paid) {
        setPayment(prev => ({ 
          ...prev, 
          paid: true, 
          tx_hash: data.tx_hash, 
          payer_address: data.payer_address,
          is_active: false 
        }));
        setPayerAddress(data.payer_address);
        setStatus('✅ Payment Successful!');
      }
    } catch (err) {
      console.error('Status check error:', err);
    }
  }

  async function connectWallet() {
    try {
      if (!isWalletInstalled()) {
        setStatus('❌ Please install a Web3 wallet');
        return;
      }

      setWalletConnecting(true);
      setStatus('⏳ Connecting wallet...');
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        setStatus('⏳ Checking wallet verification...');
        
        const isValid = await checkSignatureValidity(address);
        
        if (isValid) {
          setStatus('✅ Wallet verified! Ready to pay.');
        } else {
          setStatus('⚠️ Please sign to verify your wallet');
        }
      } else {
        setStatus('❌ No accounts found');
      }
    } catch (err) {
      console.error('Connect error:', err);
      setStatus('❌ Failed to connect wallet');
    } finally {
      setWalletConnecting(false);
    }
  }

  async function pay() {
    if (payment.is_active === false) {
      setStatus('❌ This payment link is no longer active');
      return;
    }

    if (payment.paid) {
      setStatus('❌ This payment has already been completed');
      return;
    }

    if (payment.expires_at && new Date() > new Date(payment.expires_at)) {
      setStatus('❌ This payment link has expired');
      return;
    }

    if (!account) {
      setStatus('❌ Please connect your wallet first');
      return;
    }

    if (!signatureValid) {
      setStatus('⚠️ Please sign to verify your wallet first');
      return;
    }

    if (!isWalletInstalled()) {
      setStatus('❌ Please install MetaMask!');
      return;
    }

    try {
      const BASE_CHAIN_ID = '0x2105';
      const currentChain = await window.ethereum.request({ method: 'eth_chainId' });

      if (currentChain !== BASE_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_CHAIN_ID }]
        });
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(USDC_ADDRESS, [
        'function transfer(address to, uint amount) returns (bool)'
      ], signer);

      setStatus('⏳ Opening MetaMask...');

      const tx = await contract.transfer(
        payment.recipient,
        ethers.parseUnits(payment.amount.toString(), 6)
      );

      setStatus('⏳ Waiting for confirmation...');
      const receipt = await tx.wait();

      await supabase
        .from('payment')
        .update({ 
          paid: true, 
          tx_hash: receipt.hash,
          payer_address: account,
          is_active: false
        })
        .eq('slug', slug);

      setStatus('✅ Payment Successful!');
      setPayment(prev => ({ 
        ...prev, 
        paid: true, 
        tx_hash: receipt.hash, 
        payer_address: account,
        is_active: false 
      }));
      setPayerAddress(account);

    } catch (err) {
      console.error('Pay error:', err);
      
      if (err.code === 'ACTION_REJECTED') {
        setStatus('❌ Transaction rejected by user');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setStatus('❌ Insufficient USDC balance');
      } else {
        setStatus('❌ Payment Failed');
      }
    }
  }

  function copyTxHash() {
    if (payment?.tx_hash) {
      navigator.clipboard.writeText(payment.tx_hash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  }

  function viewOnBasescan() {
    if (payment?.tx_hash) {
      window.open(`https://basescan.org/tx/${payment.tx_hash}`, '_blank');
    }
  }

  function goToCreate() {
    navigate('/');
  }

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center text-2xl transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-blue-50 text-gray-900'
    }`}>
      Loading...
    </div>
  );
  
  if (!payment) return (
    <div className={`min-h-screen flex items-center justify-center text-red-500 text-2xl transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-blue-50'
    }`}>
      Payment link not found
    </div>
  );

  const paymentLink = `${window.location.origin}/pay/${payment.slug}`;

  // بررسی اینکه کاربر جاری پرداخت‌کننده هست یا نه
  const isPayer = account && payerAddress && account.toLowerCase() === payerAddress.toLowerCase();

  // ============================================
  // اگر لینک پرداخت شده
  // ============================================
  if (payment.paid) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-950' : 'bg-blue-50'
      }`}>
        <Navbar />

        <div className="flex items-center justify-center p-4 pt-10">
          <div className={`max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-blue-100'
          }`}>
            <div className={`p-6 text-center transition-colors duration-300 ${
              isDark 
                ? 'bg-blue-600' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            } text-white`}>
              <h1 className="text-3xl font-bold">Payment Request</h1>
              <p className="mt-1 opacity-90">USDC on Base Network</p>
            </div>

            <div className="p-6">
              {isPayer ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Transaction Successful!
                    </h2>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Your payment was completed successfully
                    </p>
                  </div>

                  <div className={`p-4 rounded-2xl transition-colors duration-300 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Transaction Hash
                    </p>
                    <p className={`font-mono text-xs break-all transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {payment.tx_hash}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={copyTxHash}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-colors duration-300 ${
                        isDark 
                          ? 'border border-gray-700 hover:bg-gray-800 text-gray-300' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {copiedTx ? '✅ Copied!' : 'Copy Tx Hash'}
                    </button>
                    
                    <button
                      onClick={viewOnBasescan}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl text-sm font-medium transition-colors"
                    >
                      View on Basescan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-7xl mb-4">✅</div>
                  <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Payment Completed
                  </h2>
                  <p className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    This payment has already been processed.
                  </p>
                </div>
              )}

              <button
                onClick={goToCreate}
                className={`w-full mt-4 border py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-800 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                + Create New PayLink
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // اگر لینک منقضی شده
  // ============================================
  if (payment.expires_at && new Date() > new Date(payment.expires_at)) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-950' : 'bg-blue-50'
      }`}>
        <Navbar />

        <div className="flex items-center justify-center p-4 pt-10">
          <div className={`max-w-md w-full mx-4 rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-blue-100'
          }`}>
            <div className={`p-10 text-center transition-colors duration-300 ${
              isDark 
                ? 'bg-blue-600' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            } text-white`}>
              <h1 className="text-3xl font-bold">Payment Request</h1>
              <p className="mt-2 opacity-90">USDC on Base Network</p>
            </div>
            
            <div className="p-8 text-center">
              <div className="text-7xl mb-6">⏰</div>
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Payment Link Expired
              </h2>
              <p className={`transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                This payment link is no longer valid.
              </p>
              
              <button
                onClick={goToCreate}
                className={`w-full mt-6 border py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-800 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                + Create New PayLink
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // صفحه اصلی پرداخت (برای لینک‌های فعال)
  // ============================================
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-950' : 'bg-blue-50'
    }`}>
      <Navbar />

      <div className="flex items-center justify-center p-4 pt-10">
        <div className={`max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-blue-100'
        }`}>
          <div className={`p-6 text-center transition-colors duration-300 ${
            isDark 
              ? 'bg-blue-600' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700'
          } text-white`}>
            <h1 className="text-3xl font-bold">Payment Request</h1>
            <p className="mt-1 opacity-90">USDC on Base Network</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center">
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-white' : 'bg-white'}`}>
                <QRCode
                  value={paymentLink}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                />
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Scan with your phone to pay
              </p>
            </div>

            <div className="text-center">
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Amount to Pay
              </p>
              <p className={`text-5xl font-bold mt-1 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {payment.amount} <span className="text-2xl">USDC</span>
              </p>
            </div>

            <div className={`p-4 rounded-2xl transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`text-xs mb-1 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Recipient Address (Hidden for privacy)
              </p>
              <p className={`font-mono text-xs break-all transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-900'
              }`}>
                {payment.recipient.substring(0, 6)}...{payment.recipient.substring(payment.recipient.length - 4)}
              </p>
              {user && (
                <p className={`font-mono text-xs break-all mt-1 pt-1 border-t ${
                  isDark ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'
                }`}>
                  Full: {payment.recipient}
                </p>
              )}
            </div>

            {!account ? (
              !isWalletInstalled() ? (
                <div className="space-y-3">
                  <div className={`p-3 rounded-2xl border text-center ${
                    isDark 
                      ? 'bg-yellow-950/30 border-yellow-800' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                      ⚠️ No Web3 Wallet Detected
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      A wallet is required to make payments
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 py-2 rounded-2xl text-sm font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-1 ${
                        isDark 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      🦊 MetaMask
                    </a>
                    
                    <a
                      href="https://rabby.io/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 py-2 rounded-2xl text-sm font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-1 ${
                        isDark 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      🐰 Rabby
                    </a>

                    <a
                      href="https://trustwallet.com/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 py-2 rounded-2xl text-sm font-semibold text-center transition-colors duration-300 flex items-center justify-center gap-1 ${
                        isDark 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      🔵 Trust
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={walletConnecting}
                  className={`w-full py-3 rounded-2xl text-lg font-semibold transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800' 
                      : 'bg-gray-900 hover:bg-black text-white disabled:bg-gray-400'
                  }`}
                >
                  {walletConnecting ? '⏳ Connecting...' : 'Connect Wallet'}
                </button>
              )
            ) : signatureLoading ? (
              <button
                disabled
                className={`w-full py-3 rounded-2xl text-lg font-semibold ${
                  isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-500'
                }`}
              >
                ⏳ Signing...
              </button>
            ) : !signatureValid ? (
              <button
                onClick={signMessage}
                className={`w-full py-3 rounded-2xl text-lg font-semibold transition-colors duration-300 ${
                  isDark
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                ✍️ Sign to Verify Wallet
              </button>
            ) : (
              <button
                onClick={pay}
                className={`w-full py-3 rounded-2xl text-lg font-semibold transition-colors duration-300 ${
                  isDark
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Pay Now
              </button>
            )}

            {status && (
              <p className={`text-center font-medium text-base mt-2 transition-colors duration-300 ${
                status.includes('❌') || status.includes('Failed') || status.includes('rejected')
                  ? 'text-red-500' 
                  : status.includes('✅') || status.includes('Successful')
                    ? 'text-green-500'
                    : isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {status}
              </p>
            )}

            <button
              onClick={goToCreate}
              className={`w-full border py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                isDark 
                  ? 'border-gray-700 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              + Create New PayLink
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}