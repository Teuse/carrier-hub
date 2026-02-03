const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const USER = import.meta.env.VITE_SECURITY_USER_NAME || 'api';
const PASS = import.meta.env.VITE_SECURITY_USER_PASSWORD || 'secret';

const authHeader = `Basic ${btoa(`${USER}:${PASS}`)}`;

export async function http<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const optHeaders = options?.headers ?? {};
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      ...(optHeaders),
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