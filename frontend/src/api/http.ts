import { msalInstance } from '../main';
import { loginRequest } from '../authConfig';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function http<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const optHeaders = options?.headers ?? {};
  
  // Get accounts from msalInstance (not from hook)
  const accounts = msalInstance.getAllAccounts();
  
  if (accounts.length === 0) {
    throw new Error('No authenticated user found. Please log in.');
  }
  
  // Get access token
  const authResponse = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: accounts[0],
  });
  
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authResponse.accessToken}`,
      ...optHeaders,
    },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}