import { type ReactNode, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { setAuthTokenGetter } from '../api/http';

type ApiProviderProps = {
  children: ReactNode;
};

export function ApiProvider({ children }: ApiProviderProps) {
  const auth = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => auth.user?.access_token ?? null);
  }, [auth.user?.access_token]);

  return children;
}