import type { AuthContextProps } from 'react-oidc-context';
import { useAuth } from 'react-oidc-context';

export const oidcConfig = {
  authority: `http://localhost:${import.meta.env.VITE_KC_HTTP_PORT}/realms/Carrier-Hub`,
  client_id: import.meta.env.VITE_KC_FRONTEND_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  // ...
};

export const handleSignin = (auth: AuthContextProps) => {
  auth.signinRedirect();
};

export const handleSignOut = (auth: AuthContextProps) => {
  auth.signoutRedirect();
};

function parseJwt(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

type Role = 'USER' | 'ADMIN';

export function isAdmin(): boolean {
  const auth = useAuth();
  
  if (!auth.isAuthenticated || !auth.user) {
    return false;
  }

  const claims = parseJwt(auth.user.access_token);
  const clientId = import.meta.env.VITE_KC_BACKEND_CLIENT_ID;
  
  const resourceAccess = claims.resource_access as Record<string, { roles?: Role[] }> | undefined;
  const roles = resourceAccess?.[clientId]?.roles ?? [];

  return roles.includes('ADMIN');
}