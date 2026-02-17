import type { Configuration, PopupRequest } from "@azure/msal-browser";
import { msalInstance } from './main';
import { useMsal } from "@azure/msal-react";

// Validate environment variables
const requiredVars = {
  VITE_AZURE_TENANT_ID: import.meta.env.VITE_AZURE_TENANT_ID,
  VITE_AZURE_FRONTEND_CLIENT_ID: import.meta.env.VITE_AZURE_FRONTEND_CLIENT_ID,
  VITE_AZURE_BACKEND_CLIENT_ID: import.meta.env.VITE_AZURE_BACKEND_CLIENT_ID,
  VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI
};

const missing = Object.entries(requiredVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_FRONTEND_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest: PopupRequest = {
  scopes: [`api://${import.meta.env.VITE_AZURE_BACKEND_CLIENT_ID}/access_as_user`],
}

export function getUser() {
  return msalInstance.getAllAccounts()[0];
}

export async function login(): Promise<void> {
  try {
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await msalInstance.logoutRedirect();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

export async function isAdmin(): Promise<boolean> {
  // need to decode the token manually to get the role, because it is not in the id token object
  function parseJwt(token: string): Record<string, unknown> {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  }

  type Role = "USER" | "ADMIN";
  
  const account = getUser();

  const response = await msalInstance.acquireTokenSilent({
    scopes: [`api://${import.meta.env.VITE_AZURE_BACKEND_CLIENT_ID}/.default`],
    account: account,
  });
    
  const claims = parseJwt(response.accessToken);
  const roles = (claims.roles as Role[]) ?? [];

  return roles.includes("ADMIN");
}