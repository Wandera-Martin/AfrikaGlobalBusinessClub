import React, { useState, useEffect } from 'react';
import { apiVerifyOtp, apiResendOtp } from '../services/authApi';
import type { ApiError } from '../types';
import OtpInput from './OtpInput';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface VerificationModalProps {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── VERIFICATION MODAL ──────────────────────────────────────────────────────
const VerificationModal: React.FC<VerificationModalProps> = ({ email, onClose, onSuccess }) => {
  const [otp, setOtp] = useState<string>('');
  const [secs, setSecs] = useState<number>(180); // 3 minutes
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (secs > 0) {
      const timer = setInterval(() => setSecs((s) => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [secs]);

  async function handleVerify() {
    if (otp.length < 6) return setError('Please enter the 6-digit code.');
    setLoading(true);
    try {
      const res = await apiVerifyOtp({ email, code: otp });
      localStorage.setItem('access_token', res.access);
      localStorage.setItem('refresh_token', res.refresh);
      onSuccess();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error || 'Invalid code. Please try again.');
      setOtp(''); // Clear input boxes
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError('');
    try {
      await apiResendOtp({ email });
      setSecs(180); // Reset to 3 minutes
      setError('New code sent!');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error || 'Failed to resend code.');
    }
  }

  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  const timeStr = `${mins}:${remSecs.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-5">
      <div className="bg-white rounded-2xl p-11 w-full max-w-[460px] relative text-center shadow-card">
        <button 
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm flex items-center justify-center hover:bg-gray-200 transition-colors" 
          onClick={onClose} 
          disabled={loading}>
          ✕
        </button>
        <div className="w-[72px] h-[72px] rounded-full bg-[#fff3ee] flex items-center justify-center mx-auto mb-5 text-[32px] border border-gray-200">
          ✉
        </div>
        <h2 className="text-[26px] font-extrabold text-gray-800 mb-2">Check your email</h2>
        <p className="text-[15px] text-gray-600 mb-6">
          We sent a 6-digit verification code to<br/>
          <strong className="font-bold text-gray-800">{email}</strong>
        </p>
        
        {error && (
          <div className="bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca] px-4 py-3 rounded-lg text-[13px] font-medium flex gap-2.5 mb-5 items-center justify-center text-left">
            <span>⚠</span> <span>{error}</span>
          </div>
        )}

        <OtpInput value={otp} onChange={setOtp} />

        <button 
          className="w-full bg-navy text-white p-3.5 rounded-lg text-[15px] font-bold transition-all hover:bg-navy-light hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(26,39,68,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none" 
          onClick={handleVerify} 
          disabled={loading || otp.length < 6}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="mt-6 text-[14px] text-gray-600">
          {secs > 0 ? (
            <span>Code expires in <strong className="text-[#e24b4a] ml-1">{timeStr}</strong></span>
          ) : (
            <span>Code expired. <button className="bg-transparent border-none text-navy font-bold cursor-pointer hover:underline p-0 ml-1" onClick={handleResend}>Resend email</button></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
