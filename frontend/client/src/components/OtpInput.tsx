import React, { useRef } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
}

// ─── OTP INPUT ───────────────────────────────────────────────────────────────
const OtpInput: React.FC<OtpInputProps> = ({ value, onChange }) => {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const digits = (value + '      ').slice(0, 6).split('');

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      const next = value.slice(0, i) + ' ' + value.slice(i + 1);
      onChange(next.trimEnd());
      if (i > 0) refs[i - 1].current?.focus();
    } else if (/^[0-9]$/.test(e.key)) {
      const arr = (value + '      ').slice(0, 6).split('');
      arr[i] = e.key;
      onChange(arr.join('').trimEnd());
      if (i < 5) refs[i + 1].current?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6);
    if (digitsOnly) {
      onChange(digitsOnly);
      const nextFocus = Math.min(digitsOnly.length, 5);
      refs[nextFocus].current?.focus();
    }
  }

  return (
    <div className="flex gap-3 justify-center my-6">
      {digits.map((d, i) => (
        <input
          key={i} ref={refs[i]}
          className={`w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg outline-none transition-colors ${
            d.trim() ? 'border-navy bg-navy/5' : 'focus:border-navy bg-white'
          }`}
          type="text" inputMode="numeric" maxLength={1}
          value={d.trim()} readOnly
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={() => refs[i].current?.select()}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OtpInput;
