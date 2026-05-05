import type { StrengthResult } from '../types';

export function getStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 20, label: 'WEAK', color: '#e24b4a' };
  if (score === 2) return { score: 40, label: 'FAIR', color: '#ef9f27' };
  if (score === 3) return { score: 65, label: 'GOOD', color: '#63a322' };
  if (score === 4) return { score: 85, label: 'STRONG', color: '#1d9e75' };
  return { score: 100, label: 'STRONG PASSWORD', color: '#0f9b82' };
}
