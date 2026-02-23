import type { AuthContextProps } from 'react-oidc-context';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function http<T>(
  auth: AuthContextProps,
  url: string,
  options?: RequestInit
): Promise<T> {
  const optHeaders = options?.headers ?? {};

  if (!auth.isAuthenticated || !auth.user) {
    throw new Error('No authenticated user found. Please log in.');
  }

  const token = auth.user.access_token;

  const res = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
