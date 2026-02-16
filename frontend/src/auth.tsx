import type { Configuration, PopupRequest } from "@azure/msal-browser";
import { msalInstance } from './main';

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
  const accounts = msalInstance.getAllAccounts();
  
  if (accounts.length === 0) {
    return null;
  }

  return accounts[0];
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