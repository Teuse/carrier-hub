import { useEffect, type ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// This will be set by the ApiProvider
let getAuthToken: (() => string | null) | null = null;

export function setAuthTokenGetter(getter: () => string | null) {
  getAuthToken = getter;
}

export async function http<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  if (!getAuthToken) {
    throw new Error('Auth not initialized. Wrap your app in ApiProvider.');
  }

  const token = getAuthToken();
  if (!token) {
    throw new Error('No authenticated user found. Please log in.');
  }

  const optHeaders = options?.headers ?? {};

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

type ApiProviderProps = {
  children: ReactNode;
};

// Provider component to inject auth
export function ApiProvider({ children }: ApiProviderProps) {
  const auth = useAuth();

  // Set up the token getter once when provider mounts
  useEffect(() => {
    setAuthTokenGetter(() => auth.user?.access_token ?? null);
  }, [auth.user?.access_token]);

  return children;
}