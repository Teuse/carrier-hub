# Authorization and Authentication concept

This document shall conceptually explain the flow of authentication and authorization in this application, i.e. an application secured via MS EntraID with a single frontend and backend service, respectively. The setup is that both, the frontend and backend are registered in EntraID with their respective ID and secret. Also, the user's account needs to be given a role in the application in EntraID. 

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend
    participant Backend as Backend API
    participant EntraID as Azure AD/<br>MS Entra ID

    Note over User,EntraID: Initial Page Load & Authentication
    User->>Frontend: Visits application
    Frontend->>Frontend: Check for existing valid token
    alt No valid token found
        Frontend->>User: Show login button / redirect to login
        User->>Frontend: Clicks login
        Frontend->>EntraID: Redirect to authorization endpoint<br/>(with client_id, redirect_uri, scope, code_challenge)
        EntraID->>User: Display MS login page
        User->>EntraID: Enter credentials & authenticate
        EntraID->>EntraID: Validate credentials
        EntraID->>Frontend: Redirect back with authorization code<br/>(to redirect_uri)
        Frontend->>EntraID: Exchange code for tokens<br/>(POST /token with code, code_verifier)
        EntraID->>Frontend: Return tokens<br/>(access_token, id_token, refresh_token)
        Frontend->>Frontend: Store tokens (in memory)
        Frontend->>User: Show authenticated UI
    end

    Note over User,EntraID: Action that requires API calls
    User->>Frontend: E.g. access page that needs data
    Frontend->>Frontend: Get valid access token<br/>(acquireTokenSilent)
    alt Token expired
        Frontend->>EntraID: Request new token with refresh_token
        EntraID->>Frontend: Return new access_token
    end
    Frontend->>Backend: API request with<br/>Authorization: Bearer {access_token}
    Backend->>Backend: Extract JWT from header
    Backend->>EntraID: Validate token signature<br/>(fetch JWKS public keys - cached)
    EntraID-->>Backend: Public keys for validation
    Backend->>Backend: Validate token:<br/>- Signature<br/>- Issuer<br/>- Audience<br/>- Expiration<br/>- Claims/Roles
    alt Token valid
        Backend->>Backend: Check authorization<br/>(hasRole("ADMIN"), etc.)
        alt Authorized
            Backend->>Backend: Process request
            Backend->>Frontend: Return data (200 OK)
            Frontend->>User: Display result
        else Not authorized
            Backend->>Frontend: Return 403 Forbidden
            Frontend->>User: Show error message
        end
    else Token invalid/expired
        Backend->>Frontend: Return 401 Unauthorized
        Frontend->>Frontend: Clear invalid token
        Frontend->>User: Redirect to login
    end

    Note over User,EntraID: Token Refresh (Background)
    Frontend->>Frontend: Token about to expire
    Frontend->>EntraID: Silently request new token<br/>(using refresh_token)
    EntraID->>Frontend: Return new access_token
    Frontend->>Frontend: Update stored token

    Note over User,EntraID: Logout
    User->>Frontend: Clicks logout
    Frontend->>Frontend: Clear tokens from memory
    Frontend->>EntraID: Optional: Redirect to logout endpoint
    EntraID->>EntraID: End Entra ID session
    EntraID->>Frontend: Redirect back to app
    Frontend->>User: Show logged out state
```