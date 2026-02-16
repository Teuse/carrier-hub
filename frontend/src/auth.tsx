import { msalInstance } from './main';
import { loginRequest } from './authConfig';

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0;
}

// Get current user information
export function getUser() {
  const accounts = msalInstance.getAllAccounts();
  
  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];
  
  // Return user object in similar format to your old dummy user
  return {
    email: account.username, // Usually the email/UPN
    name: account.name || account.username, // Display name
    id: account.localAccountId, // Unique user ID
    tenantId: account.tenantId,
    // If you need avatar, you can use Microsoft Graph API or a default
    avatar: 'https://i.pravatar.cc/40', // Or fetch from Graph API
  };
}

// Get current user account object (full MSAL account info)
export function getCurrentUser() {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
}

// Login with redirect
export async function login(): Promise<void> {
  try {
    await msalInstance.loginRedirect(loginRequest);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Logout with redirect
export async function logout(): Promise<void> {
  try {
    await msalInstance.logoutRedirect();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

// Get access token for API calls
export async function getAccessToken(): Promise<string> {
  const accounts = msalInstance.getAllAccounts();
  
  if (accounts.length === 0) {
    throw new Error("No active account! Please sign in.");
  }

  const request = {
    ...loginRequest,
    account: accounts[0],
  };

  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    console.warn("Silent token acquisition failed, acquiring token using redirect");
    await msalInstance.acquireTokenRedirect(request);
    throw new Error("Redirecting to acquire token");
  }
}




// this was copy and pasted as is from Claude. NEEDS REWORK AND CLEANUP!!!!!!!!!!!!!!