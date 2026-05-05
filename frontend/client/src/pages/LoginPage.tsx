import React, { useState, useEffect } from 'react';
import { apiLogin, apiForgotPassword, apiGoogleAuth } from '../services/authApi';
import { useSearchParams } from 'react-router-dom';
import { getStrength } from '../utils/passwordStrength';
import { useGoogleLogin } from '@react-oauth/google';
import type { ApiError, StrengthResult } from '../types';
import GoogleIcon from '../components/GoogleIcon';

interface LoginPageProps {
  onRegister: () => void;
  onLoginSuccess: () => void;
  onHome: () => void;
}

type ViewState = 'login' | 'forgot' | 'check_email' | 'reset';

const LoginPage: React.FC<LoginPageProps> = ({ onRegister, onLoginSuccess, onHome }) => {
  const [view, setView] = useState<ViewState>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setErrorMsg('');
      try {
        // Send the Google access_token to our backend for verification
        const tokens = await apiGoogleAuth(tokenResponse.access_token);
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        setSuccessMsg(tokens.created ? 'Welcome to AG Business! Redirecting...' : 'Signed in with Google! Redirecting...');
        setTimeout(() => onLoginSuccess(), 1200);
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        setErrorMsg(apiErr.detail || 'Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setErrorMsg('Google sign-in was cancelled or failed.');
    },
    flow: 'implicit',
  });
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const strength: StrengthResult = getStrength(newPassword);
  const [searchParams] = useSearchParams();

  // Restore remembered email on mount; detect ?reset=success redirect
  useEffect(() => {
    const saved = localStorage.getItem('remembered_email');
    if (saved) { setEmail(saved); setRememberMe(true); }
    if (searchParams.get('reset') === 'success') {
      setSuccessMsg('Password updated successfully. Please sign in.');
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter your email and password');
      return;
    }
    
    setLoading(true);
    try {
      const tokens = await apiLogin({ email, password });
      // Persist JWT tokens for use in future authenticated requests
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => {
        onLoginSuccess();
      }, 1200);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMsg(apiErr.detail || apiErr.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    setForgotError('');
    if (!email) {
      setForgotError('Please enter your email address.');
      return;
    }
    setForgotLoading(true);
    try {
      await apiForgotPassword(email);
      setView('check_email');
    } catch (err: unknown) {
      const apiErr = err as { detail?: string };
      setForgotError(apiErr.detail || 'Something went wrong. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      return;
    }
    // Mock success -> go back to login with success message
    setView('login');
    setSuccessMsg('Password updated. Please sign in.');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      {/* Nav bar — matches RegisterPage */}
      <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-10 h-16 bg-navy/95 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center font-extrabold text-[15px] text-white">🌍</div>
          <div>
            <div className="text-white font-bold text-[15px]">Afrika Global Business Club</div>
            <div className="text-white/50 text-[11px]">Powered by Trade Afrika Group</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-transparent text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-white/10" onClick={onHome}>← Back</button>
        </div>
      </nav>

      <div className="min-h-[calc(100vh-64px)] bg-grad flex items-center justify-center p-10 relative mt-16">
        {/* Gradient background blobs */}
        <div className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: 400, height: 400, top: -80, left: -80 }} />
        <div className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: 300, height: 300, bottom: 0, right: -60 }} />

        {/* RENDER LOGIN VIEW */}
        {view === 'login' && (
          <div className="bg-white rounded-2xl w-full max-w-[560px] p-11 relative z-10 shadow-card">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center text-xl text-white">🌍</div>
              <div className="text-xl font-extrabold text-gray-800 tracking-[-0.01em]">AG BUSINESS</div>
            </div>
            <h1 className="text-[26px] font-extrabold text-center text-gray-800 mb-1.5">Welcome Back</h1>
            <p className="text-sm text-gray-400 text-center mb-8">Sign in to continue growing your business</p>

            {successMsg && (
              <div className="px-4 py-3 rounded-lg text-[13px] font-medium flex gap-2.5 mb-6 bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
                <span>✓</span> <span>{successMsg}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">✉</span>
                <input 
                  className="w-full py-2.5 pr-3.5 pl-10 rounded-lg border-[1.5px] border-gray-200 text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:border-navy focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)]"
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">🔒</span>
                <input 
                  className="w-full py-2.5 pr-11 pl-10 rounded-lg border-[1.5px] border-gray-200 text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:border-navy focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)]"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  disabled={loading}
                />
                <button className="absolute right-3 top-3 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600 focus:outline-none" onClick={() => setShowPw(s => !s)} type="button" tabIndex={-1}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {errorMsg && <p className="text-xs text-[#e24b4a] mt-1">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between mb-5 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="w-4 h-4 shrink-0 mt-0.5 accent-orange cursor-pointer" type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} disabled={loading} />
                <span className="text-[13px] text-gray-600">Remember me</span>
              </label>
              <button type="button" className="bg-transparent text-navy text-[13px] font-bold cursor-pointer hover:underline p-0 border-none" onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}>
                Forgot password?
              </button>
            </div>

            <button className="w-full bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(26,39,68,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" onClick={handleLogin} disabled={loading}>
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full mx-auto animate-spin-fast" /> : 'Sign In'}
            </button>

            <div className="flex items-center text-center my-6 text-gray-400 text-xs font-semibold after:content-[''] after:flex-1 after:border-b after:border-gray-200 after:ml-3 before:content-[''] before:flex-1 before:border-b before:border-gray-200 before:mr-3">
              OR
            </div>

            <button
              className="w-full flex items-center justify-center gap-2.5 bg-white border-[1.5px] border-gray-200 text-gray-800 p-3 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-50 hover:border-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => googleLogin()}
              disabled={loading || googleLoading}
            >
              <div className="w-5 h-5"><GoogleIcon /></div>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="text-center mt-8 text-sm text-gray-600">
              Don't have an account? <span className="text-navy font-bold cursor-pointer hover:underline" onClick={onRegister}>Sign up</span>
            </div>
          </div>
        )}

        {/* RENDER FORGOT PASSWORD VIEW */}
        {view === 'forgot' && (
          <div className="bg-white rounded-2xl w-full max-w-[560px] p-11 relative z-10 shadow-card">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center text-xl text-white">🌍</div>
              <div className="text-xl font-extrabold text-gray-800 tracking-[-0.01em]">AG BUSINESS</div>
            </div>
            <h1 className="text-[26px] font-extrabold text-center text-gray-800 mb-1.5">Forgot Password?</h1>
            <p className="text-sm text-gray-400 text-center mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="mb-4 mt-6">
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">✉</span>
                <input 
                  className="w-full py-2.5 pr-3.5 pl-10 rounded-lg border-[1.5px] border-gray-200 text-sm text-gray-800 outline-none transition-all focus:border-navy focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)]"
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {forgotError && <p className="text-xs text-[#e24b4a] mt-2">{forgotError}</p>}

            <button className="w-full bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(26,39,68,0.3)] disabled:opacity-70 disabled:cursor-not-allowed mt-4" onClick={handleForgotSubmit} disabled={forgotLoading}>
              {forgotLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full mx-auto animate-spin-fast" /> : 'Send Reset Link'}
            </button>

            <div className="text-center mt-8 text-sm text-gray-600">
              <span className="text-navy font-bold cursor-pointer hover:underline" onClick={() => setView('login')}>← Back to login</span>
            </div>
          </div>
        )}

        {/* RENDER CHECK EMAIL VIEW */}
        {view === 'check_email' && (
          <div className="bg-white rounded-2xl w-full max-w-[560px] p-11 relative z-10 shadow-card text-center">
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 rounded-full bg-[#fff5f2] flex items-center justify-center relative text-orange text-[32px]">
                <span>✉</span>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-orange text-white flex items-center justify-center text-sm font-bold border-4 border-white">✓</div>
              </div>
            </div>
            <h1 className="text-[26px] font-extrabold text-center text-gray-800 mb-1.5 mt-4">Check your email</h1>
            <p className="text-sm text-gray-400 text-center mx-auto mt-2 mb-6">
              If an account exists for that email, we've sent instructions to reset your password. Please check your inbox.
            </p>

            <button className="w-full flex items-center justify-center gap-2 bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-px mt-2" onClick={() => setView('reset')}>
              <span>✉</span> Open email app
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 bg-white border-[1.5px] border-gray-200 text-gray-800 p-3 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-50 hover:border-gray-400 mt-3" style={{ marginTop: 12 }}>
              <span>↻</span> Resend email
            </button>

            <div className="text-center mt-8 text-sm text-gray-600">
              <span className="text-navy font-bold cursor-pointer hover:underline" onClick={() => setView('login')}>← Back to login</span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mt-8">
              Didn't receive the email? Check your spam folder or wait a few minutes.
            </p>
          </div>
        )}

        {/* RENDER RESET PASSWORD VIEW */}
        {view === 'reset' && (
          <div className="bg-white rounded-2xl w-full max-w-[560px] p-11 relative z-10 shadow-card">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-orange text-white">🌍</div>
              <div className="text-xl font-extrabold text-gray-800 tracking-[-0.01em]">AG BUSINESS</div>
            </div>
            <h1 className="text-[26px] font-extrabold text-center text-gray-800 mb-1.5">Reset Password</h1>
            <p className="text-sm text-gray-400 text-center mb-8">Enter your new password below.</p>

            <div className="mb-4 mt-4">
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">New Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">🔒</span>
                <input 
                  className="w-full py-2.5 pr-11 pl-10 rounded-lg border-[1.5px] border-gray-200 text-sm text-gray-800 outline-none transition-all focus:border-navy focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)]"
                  type={showNewPw ? 'text' : 'password'}
                  placeholder="••••••••" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="absolute right-3 top-3 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600" onClick={() => setShowNewPw(s => !s)} type="button">
                  {showNewPw ? '🙈' : '👁'}
                </button>
              </div>
              
              {newPassword && (
                <div className="mt-2">
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength.score}%`, background: strength.color }} />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-semibold mt-1">
                    <span style={{ color: strength.color }}>{strength.label}</span>
                    <span className="text-gray-400">{strength.score}% Secure</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4 mt-4">
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">↻</span>
                <input 
                  className="w-full py-2.5 pr-11 pl-10 rounded-lg border-[1.5px] border-gray-200 text-sm text-gray-800 outline-none transition-all focus:border-navy focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)]"
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="absolute right-3 top-3 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600" onClick={() => setShowConfirmPw(s => !s)} type="button">
                  {showConfirmPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button className="w-full bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(26,39,68,0.3)] mt-6" onClick={handleResetSubmit}>
              Reset Password →
            </button>

            <div className="text-center mt-8 text-sm text-gray-600">
              <span className="text-navy font-bold cursor-pointer hover:underline" onClick={() => setView('login')}>← Back to login</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginPage;
