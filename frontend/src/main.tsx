import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication, EventType } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import App from './App';
import { msalConfig } from './authConfig'

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
await msalInstance.initialize();

// Handle redirect after login
await msalInstance.handleRedirectPromise();

// Set active account
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as any;
    msalInstance.setActiveAccount(payload.account);
  }
});

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);