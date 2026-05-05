import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiResetPassword } from '../services/authApi';
import { getStrength } from '../utils/passwordStrength';
import type { ApiError, StrengthResult } from '../types';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get('uid') ?? '';
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ new_password?: string; confirm_password?: string }>({});

  const strength: StrengthResult = getStrength(newPassword);

  // Guard: invalid link
  useEffect(() => {
    if (!uid || !token) {
      setErrorMsg('This reset link is invalid or has expired. Please request a new one.');
    }
  }, [uid, token]);

  const handleSubmit = async () => {
    setErrorMsg('');
    setFieldErrors({});

    if (!newPassword) {
      setFieldErrors({ new_password: 'Password is required.' }); return;
    }
    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirm_password: 'Passwords do not match.' }); return;
    }

    setLoading(true);
    try {
      await apiResetPassword({ uid, token, new_password: newPassword, confirm_password: confirmPassword });
      // Navigate back to login with a success query param
      navigate('/login?reset=success');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.new_password) {
        setFieldErrors({ new_password: Array.isArray(apiErr.new_password) ? apiErr.new_password[0] : String(apiErr.new_password) });
      } else if (apiErr.confirm_password) {
        setFieldErrors({ confirm_password: Array.isArray(apiErr.confirm_password) ? apiErr.confirm_password[0] : String(apiErr.confirm_password) });
      } else {
        setErrorMsg(apiErr.detail || 'Something went wrong. Please try again or request a new link.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grad flex items-center justify-center p-10 relative">
      <div className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: 400, height: 400, top: -80, left: -80 }} />
      <div className="absolute rounded-full bg-white/5 pointer-events-none" style={{ width: 300, height: 300, bottom: 0, right: -60 }} />

      <div className="flex flex-col items-center justify-center gap-1.5 absolute top-10 left-10 opacity-70">
        <div className="w-8 h-8 rounded-md bg-orange flex items-center justify-center text-sm text-white">🌤</div>
        <div className="text-[11px] font-bold text-white tracking-wider">AG Business</div>
      </div>

      <div className="bg-white rounded-2xl w-full max-w-[560px] p-11 relative z-10 shadow-[0_32px_80px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center text-xl text-white font-extrabold">AG</div>
        </div>
        <h1 className="text-[26px] font-extrabold text-center text-gray-800 mb-1.5 mt-4">Reset Password</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Enter your new password below.</p>

        {errorMsg && (
          <div className="px-4 py-3 rounded-lg text-[13px] font-medium flex gap-2.5 mb-6 bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">
            <span>⚠</span> <span>{errorMsg}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">New Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">🔒</span>
            <input
              className={`w-full py-2.5 pr-11 pl-10 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.new_password ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
              type={showNewPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setFieldErrors(fe => ({ ...fe, new_password: '' })); }}
              disabled={loading || !uid || !token}
            />
            <button className="absolute right-3 top-2.5 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600 focus:outline-none" onClick={() => setShowNewPw(s => !s)} type="button">
              {showNewPw ? '🙈' : '👁'}
            </button>
          </div>
          {fieldErrors.new_password && <p className="text-xs text-[#e24b4a] mt-1">{fieldErrors.new_password}</p>}

          {newPassword && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-gray-500 uppercase tracking-wider">Password Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${strength.score}%`, background: strength.color }} />
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 mt-4">
          <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Confirm New Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">🔑</span>
            <input
              className={`w-full py-2.5 pr-11 pl-10 rounded-lg border-[1.5px] text-sm text-gray-800 outline-none transition-all disabled:bg-gray-50 disabled:opacity-70 focus:shadow-[0_0_0_3px_rgba(26,39,68,0.08)] ${fieldErrors.confirm_password ? 'border-[#e24b4a]' : 'border-gray-200 focus:border-navy'}`}
              type={showConfirmPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(fe => ({ ...fe, confirm_password: '' })); }}
              disabled={loading || !uid || !token}
            />
            <button className="absolute right-3 top-2.5 bg-transparent border-none text-base text-gray-400 cursor-pointer p-0 flex items-center justify-center hover:text-gray-600 focus:outline-none" onClick={() => setShowConfirmPw(s => !s)} type="button">
              {showConfirmPw ? '🙈' : '👁'}
            </button>
          </div>
          {fieldErrors.confirm_password && <p className="text-xs text-[#e24b4a] mt-1">{fieldErrors.confirm_password}</p>}
        </div>

        <button
          className="w-full bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(26,39,68,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-6"
          onClick={handleSubmit}
          disabled={loading || !uid || !token}
        >
          {loading ? 'Resetting...' : 'Reset Password →'}
        </button>

        <button
          className="bg-transparent text-navy text-[13px] font-bold transition-all hover:underline mx-auto block mt-6"
          onClick={() => navigate('/login')}
        >
          ← Back to login
        </button>
      </div>

      <div className="absolute w-full bottom-0 left-0 text-center text-white/50 text-xs py-4">
        © 2024 AG Business. All rights reserved.
      </div>
    </div>
  );
};

export default ResetPasswordPage;
