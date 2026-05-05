import React, { useState } from 'react';
import { apiRegister } from '../services/authApi';
import { getStrength } from '../utils/passwordStrength';
import type { RegisterPayload, ApiError, StrengthResult } from '../types';
import GoogleIcon from '../components/GoogleIcon';
import VerificationModal from '../components/VerificationModal';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface RegisterPageProps {
  onBack: () => void;
  onVerifySuccess: () => void;
}

type FieldErrors = Partial<Record<keyof RegisterPayload | 'passwordConfirm' | 'terms', string>>;
type ModalState = null | 'verify' | 'success';

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onVerifySuccess }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [showPw, setShowPw] = useState<boolean>(false);
  const [showPwConfirm, setShowPwConfirm] = useState<boolean>(false);
  const [role, setRole] = useState<'sme' | 'buyer'>('sme');
  const [terms, setTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [modal, setModal] = useState<ModalState>(null);

  const strength: StrengthResult = getStrength(password);

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!firstName.trim()) errs.first_name = 'First Name is required';
    if (!lastName.trim()) errs.last_name = 'Last Name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(password)) errs.password = 'Password must contain at least one uppercase letter';
    else if (!/\d/.test(password)) errs.password = 'Password must contain at least one number';
    else if (!/[^A-Za-z0-9]/.test(password)) errs.password = 'Password must contain at least one special character';
    if (!passwordConfirm) errs.passwordConfirm = 'Please confirm your password';
    else if (password !== passwordConfirm) errs.passwordConfirm = 'Passwords do not match';
    if (!terms) errs.terms = 'You must agree to the terms';
    return errs;
  }

  async function handleSubmit() {
    setApiError('');
    const errs = validate();
    console.log('[Register] validate() result:', errs);
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await apiRegister({
        first_name: firstName,
        last_name: lastName,
        role,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      setModal('verify');
    } catch (err) {
      const apiErr = err as ApiError;
      const msg = apiErr.email?.[0] || apiErr.password?.[0] || apiErr.detail || apiErr.non_field_errors?.[0] || 'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-10 h-16 bg-navy/95 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-grad flex items-center justify-center font-extrabold text-[15px] text-white">AG</div>
          <div>
            <div className="text-white font-bold text-[15px]">Afrika Global Business Club</div>
            <div className="text-white/50 text-[11px]">Powered by Trade Afrika Group</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-transparent text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-white/10" onClick={onBack}>← Back</button>
        </div>
      </nav>

      <div className="min-h-[calc(100vh-64px)] bg-grad flex items-center justify-center p-10 relative mt-16">
        <div className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: 400, height: 400, top: -80, left: -80 }} />
        <div className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: 300, height: 300, bottom: 0, right: -60 }} />

        <div className="bg-white rounded-2xl w-full max-w-[560px] p-11 relative z-10 shadow-card">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center text-xl text-white">✦</div>
            <div className="text-xl font-extrabold text-gray-800 tracking-[-0.01em]">AG BUSINESS</div>
          </div>
          <h1 className="text-[26px] font-extrabold text-center text-gray-800 mb-1.5">Create your account</h1>
          <p className="text-sm text-gray-400 text-center mb-8">Join the global business ecosystem</p>

          {apiError && (
            <div className="px-4 py-3 rounded-lg text-[13px] font-medium flex gap-2.5 mb-6 bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">
              <span>⚠</span> <span>{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">First Name <span className="text-[#e24b4a]">*</span></label>
              <input
                type="text" placeholder="John" disabled={loading}
                value={firstName} onChange={e => { setFirstName(e.target.value); setFieldErrors(f => ({ ...f, first_name: '' })); }}
                className={`w-full py-2.5 px-3.5 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.first_name ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
              />
              {fieldErrors.first_name && <div className="text-xs text-[#e24b4a] mt-1">{fieldErrors.first_name}</div>}
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Last Name <span className="text-[#e24b4a]">*</span></label>
              <input
                type="text" placeholder="Doe" disabled={loading}
                value={lastName} onChange={e => { setLastName(e.target.value); setFieldErrors(f => ({ ...f, last_name: '' })); }}
                className={`w-full py-2.5 px-3.5 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.last_name ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
              />
              {fieldErrors.last_name && <div className="text-xs text-[#e24b4a] mt-1">{fieldErrors.last_name}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Email Address <span className="text-[#e24b4a]">*</span></label>
            <input
              type="email" placeholder="name@company.com"
              value={email} onChange={e => { setEmail(e.target.value); setFieldErrors(f => ({ ...f, email: '' })); }}
              className={`w-full py-2.5 px-3.5 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.email ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
              disabled={loading}
            />
            {fieldErrors.email && <div className="text-xs text-[#e24b4a] mt-1">{fieldErrors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Password <span className="text-[#e24b4a]">*</span></label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••••"
                value={password} onChange={e => { setPassword(e.target.value); setFieldErrors(f => ({ ...f, password: '' })); }}
                className={`w-full py-2.5 pr-11 pl-3.5 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.password ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
                disabled={loading}
              />
              <button className="absolute right-3 top-2.5 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600 focus:outline-none" onClick={() => setShowPw(s => !s)} type="button" tabIndex={-1}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrors.password && <div className="text-xs text-[#e24b4a] mt-1">{fieldErrors.password}</div>}
            {password && (
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

          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type={showPwConfirm ? 'text' : 'password'}
                placeholder="••••••••••"
                value={passwordConfirm} onChange={e => { setPasswordConfirm(e.target.value); setFieldErrors(f => ({ ...f, passwordConfirm: '' })); }}
                className={`w-full py-2.5 pr-11 pl-3.5 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.passwordConfirm ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
                disabled={loading}
              />
              <button className="absolute right-3 top-2.5 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600 focus:outline-none" onClick={() => setShowPwConfirm(s => !s)} type="button" tabIndex={-1}>
                {showPwConfirm ? '🙈' : '👁'}
              </button>
            </div>
            {fieldErrors.passwordConfirm && <div className="text-xs text-[#e24b4a] mt-1">{fieldErrors.passwordConfirm}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Account Type</label>
            <div className="flex flex-col gap-3 mb-6">
              <button type="button" className={`relative flex items-center gap-3 p-4 rounded-xl border-[1.5px] transition-all bg-white text-gray-800 text-left cursor-pointer hover:border-orange hover:bg-[#fff5f1] ${role === 'sme' ? 'border-orange bg-[#fff5f1] border-2 shadow-sm' : 'border-gray-200'}`} onClick={() => setRole('sme')} disabled={loading}>
                <div className="text-[22px] shrink-0">🏢</div>
                <div>
                  <div className="text-sm font-bold text-gray-800">SME</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">I want to sell/export</div>
                </div>
                {role === 'sme' && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center text-[11px]">✓</div>}
              </button>
              <button type="button" className={`relative flex items-center gap-3 p-4 rounded-xl border-[1.5px] transition-all bg-white text-gray-800 text-left cursor-pointer hover:border-orange hover:bg-[#fff5f1] ${role === 'buyer' ? 'border-orange bg-[#fff5f1] border-2 shadow-sm' : 'border-gray-200'}`} onClick={() => setRole('buyer')} disabled={loading}>
                <div className="text-[22px] shrink-0">🛒</div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Buyer</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">I want to source products</div>
                </div>
                {role === 'buyer' && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange text-white flex items-center justify-center text-[11px]">✓</div>}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
            <input className="w-4 h-4 mt-0.5 accent-orange flex-shrink-0 cursor-pointer" type="checkbox" checked={terms} onChange={e => { setTerms(e.target.checked); setFieldErrors(f => ({ ...f, terms: '' })); }} disabled={loading} />
            <span className={`text-[13px] leading-relaxed ${fieldErrors.terms ? 'text-[#e24b4a]' : 'text-gray-600'}`}>
              I agree to the <a href="#" className="text-navy hover:underline">Terms of Service</a> and <a href="#" className="text-navy hover:underline">Privacy Policy</a>.
            </span>
          </label>

          <button className="w-full bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(26,39,68,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" onClick={handleSubmit} disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full mx-auto animate-spin-fast" /> : 'Create Account'}
          </button>

          <div className="flex items-center text-center my-6 text-gray-400 text-xs font-semibold after:content-[''] after:flex-1 after:border-b after:border-gray-200 after:ml-3 before:content-[''] before:flex-1 before:border-b before:border-gray-200 before:mr-3">
            OR
          </div>
          <button className="w-full flex items-center justify-center gap-2.5 bg-white border-[1.5px] border-gray-200 text-gray-800 p-3 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-50 hover:border-gray-400 disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
            <div className="w-5 h-5"><GoogleIcon /></div>
            Continue with Google
          </button>

          <div className="text-center mt-8 text-sm text-gray-600">
            Already have an account? <span className="text-navy font-bold cursor-pointer hover:underline" onClick={onBack}>Sign in</span>
          </div>
        </div>
      </div>

      {modal === 'verify' && (
        <VerificationModal
          email={email}
          onClose={() => setModal(null)}
          onSuccess={() => setModal('success')}
        />
      )}

      {modal === 'success' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-5">
          <div className="bg-white rounded-2xl p-11 w-full max-w-[460px] relative text-center shadow-card">
            <div className="w-[72px] h-[72px] rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-5 text-[32px] border border-[#bbf7d0]">✅</div>
            <h2 className="text-[26px] font-extrabold text-gray-800 mb-2">Account Verified!</h2>
            <p className="text-[15px] text-gray-600 mb-6">Your email has been verified. Welcome back to AGBC.</p>
            <button className="w-full bg-orange text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-orange-light hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(232,82,26,0.3)]" onClick={() => onVerifySuccess()}>
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
