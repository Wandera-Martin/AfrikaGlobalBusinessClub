import { apiRefreshToken } from '../services/authApi';

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

/**
 * Safely decodes a JWT token to check if it represents a time that has expired 
 * or is about to expire within the next `bufferSeconds` seconds.
 */
const isTokenExpired = (token: string, bufferSeconds = 10): boolean => {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    
    // Replace characters that are URL-safe base64
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return true;

    const expirationMs = payload.exp * 1000;
    const nowMs = Date.now();
    
    // Return true if the current time is past the expiration minus the buffer
    return nowMs >= (expirationMs - (bufferSeconds * 1000));
  } catch (err) {
    return true; // If we can't parse the token, assume it's invalid/expired
  }
};

/**
 * Attempts to automatically refresh an expired token utilizing the queuing system.
 * Returns the new access token.
 */
const getValidAccessToken = async (): Promise<string> => {
  let token = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');

  // If no refresh token exists, we can't refresh
  if (!refresh) {
    return token || '';
  }

  // If the access token is valid and not expiring in the next 10 seconds, return it
  if (token && !isTokenExpired(token)) {
    return token;
  }

  // Token is expired. Do we need to wait in line?
  if (isRefreshing) {
    try {
      const newToken = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      return newToken;
    } catch (err) {
      throw err;
    }
  }

  // We are the first request to hit an expired token
  isRefreshing = true;
  try {
    const tokens = await apiRefreshToken(refresh);
    
    // Save the new tokens
    localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
    
    // Unblock all other queued requests
    processQueue(null, tokens.access);
    
    return tokens.access;
  } catch (err) {
    processQueue(err as Error, null);
    // If the refresh token is also expired or invalid, log the user out entirely
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    throw err;
  } finally {
    isRefreshing = false;
  }
};

/**
 * A wrapper around the native `fetch` API that acts as an interceptor.
 * It automatically injects the access token and gracefully handles 401 Unauthorized
 * errors. It also proactively refreshes tokens BEFORE making the request if they are expired.
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // First, ensure our token is fresh BEFORE making the request!
  let token: string;
  try {
    token = await getValidAccessToken();
  } catch (err) {
    // If token refresh fails utterly, the getValidAccessToken redirects to /login.
    // We throw to stop the execution of this specific request.
    throw new Error('Authentication failed');
  }

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Ensure we send JSON by default if body is present (unless it's FormData)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  options.headers = headers;

  // Make the initial request with a guaranteed valid token
  let response = await fetch(url, options);

  // In the extremely rare event that the backend STILL returns 401 Unauthorized
  // (e.g., token was manually revoked on the server exactly during the request cycle),
  // we handle it cleanly by logging the user out here.
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  // If the backend actively denies access due to an object-level permission check
  // (e.g., trying to delete a post you don't own), dispatch a custom event
  // so the React tree can show a graceful error toast without crashing.
  if (response.status === 403) {
    window.dispatchEvent(new CustomEvent('auth-forbidden', {
      detail: { message: "You don't have permission to perform this action." }
    }));
  }

  return response;
};
