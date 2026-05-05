// ─── AUTH API TYPES ───────────────────────────────────────────────────────────
export interface RegisterPayload {
  first_name: string;
  last_name: string;
  role: 'sme' | 'buyer';
  email: string;
  password: string;
  password_confirm: string;
}

export interface OtpPayload {
  email: string;
  code?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiError {
  detail?: string;
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
  error?: string;
  [key: string]: unknown;
}

// ─── PASSWORD STRENGTH TYPES ──────────────────────────────────────────────────
export interface StrengthResult {
  score: number;
  label: string;
  color: string;
}
