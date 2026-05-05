import type { RegisterPayload, OtpPayload, AuthTokens } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export async function apiRegister(data: RegisterPayload): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result as AuthTokens;
}

export async function apiLogin(data: Pick<RegisterPayload, 'email' | 'password'>): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result as AuthTokens;
}

export async function apiVerifyOtp(data: OtpPayload): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE}/auth/verify-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result as AuthTokens;
}

export async function apiResendOtp(data: Pick<OtpPayload, 'email'>): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/resend-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
}

export async function apiForgotPassword(email: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/forgot-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const result = await res.json();
  if (!res.ok) throw result;
}

export async function apiResetPassword(data: {
  uid: string;
  token: string;
  new_password: string;
  confirm_password: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
}

export async function apiGoogleAuth(accessToken: string): Promise<AuthTokens & { created?: boolean }> {
  const res = await fetch(`${API_BASE}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken }),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result as AuthTokens & { created?: boolean };
}

export async function apiLogout(refreshToken: string): Promise<void> {
  // Best-effort: blacklist the refresh token on the server side.
  // We intentionally swallow errors so the caller can always clear local state.
  await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  }).catch(() => {/* network error – clear tokens locally anyway */});
}

export async function apiRefreshToken(refreshToken: string): Promise<{ access: string; refresh?: string }> {
  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result as { access: string; refresh?: string };
}
