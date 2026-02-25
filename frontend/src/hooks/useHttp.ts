import { useAuth } from 'react-oidc-context';

export type HttpFn = <T>(url: string, options?: RequestInit) => Promise<T>;

export function useHttp(): HttpFn {
  const { user } = useAuth();

  return async function<T>(url: string, options?: RequestInit): Promise<T> {
    const token = user?.access_token ?? null;
    if (!token) throw new Error('No authenticated user found. Please log in.');

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  };
}