import type { Configuration, PopupRequest } from "@azure/msal-browser";

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
};
