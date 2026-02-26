# Registration of an application in Keycloak

This document shall explain how to setup keycloak for an application that uses the auth flow desribed in the sequence diagram in `./auth_concept.md`. Entra ID (former Azure Active Directory) is used as an optional identity provider. The setup is explained here, as well.

## What you need

You need a Microsoft/Azure account that is either registered in the [MS Developer programm](https://developer.microsoft.com/en-us/microsoft-365/dev-program) or associated with a corporation that subscribes Azure services (in that case, the following steps will probably be done by your IT departement).

## Azure Setup

### Register the application

- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [App-Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
- Click on "New Registration"
    - Under Account-types select "only accounts in organizational structure" (german: "Nur Konten in diesem Organisationsverzeichnis")
    - Under Redirect URI select as platform "Web" and add a redirect URI for your Keycloak realm, e.g. `http://localhost:8090/realms/<your-realm>/broker/microsoft/endpoint`
- Click "Register"
- Give your application a meaningful name
- You will then be presented with your application IDs. You need the Client-ID (german: "Anwendungs-ID (Client)"), Tenant-ID (german: "Verzeichnis-ID (Mandant)")
- Next, create a secret under "Certificates & Secrets">"+ New secret Client Key". As soon as you created this key, __it will only be displayed once__. Write it down somewhere safe.

## Keycloak Setup

All of this is already configured in the `keycloak/realm-export.json`. The following instructions are more to give an overview of what would have to be done in case one creates another application. These instruction expect no prior configurations to have taken place, at all.

### Register the applications

- Create a new Keycloak realm under "Manage Realm" and give it a name, e.g. "Carrier-Hub". The name of the realm will decide the URI of the `iss` claim and where the OIDC issuer will get its configuration information from (e.g. `http://localhost:8090/realms/Carrier-Hub/.well-known/openid-configuration`)
- Make sure you are navigating in the newly created realm and not in the default `master` realm
- Navigate to "Clients" and create a new client. You will need a frontend- and a backend-client that need to be configured differently
    - Frontend:
        - Create a client "Carrier-Hub_Frontend" (this will be the `clientId`)
        - Choose `OpenId Connect` as `Client type`
        - Under `Authentication flow` check only `Standard Flow` and `OAuth 2.0 Device Authorization Grant`
        - Choose `S256` as `PKCE Method`
        - Set the `root URL`, `Home URL`, `Valid redirect URIs`* and `Valid post logout redirect URIs`. For example:
            - `http://localhost:5173/login`, `http://localhost:5173/dashboard/overview`, `http://localhost:5173/dashboard/overview` and `http://localhost:5173/login`, respectively
        - Add `Web origin` for CORS URIs, e.g. `*` to pass all CORS requests
    - Backend:
        - Create a client "Carrier-Hub_Backend" (this will be the `clientId`)
        - Choose `OpenId Connect` as `Client type`
        - Toggle ON `Client authentication`
        - Under `Authentication flow` check only `Service account roles`
        - Choose `S256` as `PKCE Method`
        - Set the `root URL`, `Home URL` and `Admin URL`, e.g. all to `http://localhost:8080`

### Create a client scope for the API

- Navigate to "Client scopes" and create a new client scope
- Name it e.g. `Carrier-Hub_Backend_API` and choose `OpenID Connect`n as `Protocol` and save it
- Under "Mapper" create a mapper for the `aud`-claim (it is good practice to validate this claim on the backend):
    - Choose `Mapper type` as `Audience` and give the mapper a name, e.g. `Carrier-Hub_Backend_API_Audience`
    - As `Included Client Audience` select `Carrier-Hub_Backend`, i.e. the `clientId` of the registered backend
    - Toggle ON `Add to access token` and `Add to token introspection`


### Add EntraId as identity provider

- Navigate to "Identity providers", add a provider and choose "Microsoft"
- Add the `Redirect URI` as `http://localhost:8090/realms/<Your-realm>/broker/microsoft/endpoint`
- Choose an arbitrary `Display name` and `Alias`
- Now enter the informations of the Keycloak client as registered in Azure above:
    - `Client ID`, `Client Secret` and `Tenant ID`

### Create and assign roles

- Navigate to your registered backend client, go to the "Roles" tab and "Create role"
- Choose a name for your role(s). 
- You can also define default roles that new users will at first login. For this, navigate to "Realm roles">"default-roles-test">"Assign role" and select the role you want as default (there might be a more elaborate way to do this, but it works)
- You can assign further roles via the "Users" tab. Select a user and got to "Role mapping">"Assign role">"Client role"

__Footnote__:

\* In OIDC/OAuth2 the redirect URI specified in the authorizing party does not actually redirect. Instead, it is matched against the redirect URI that is specified by the client in the authorization request (e.g. the frontend). If none of the specified URIs match the ones that the frontend wants to redirect to, the request fails. This prevents malicious behavior.
