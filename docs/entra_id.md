# Registration of an application in MS EntraID

## Sources

- [Secure Java Spring Boot apps using Microsoft Entra ID - Azure | Microsoft Learn](https://learn.microsoft.com/en-us/azure/developer/java/identity/enable-spring-boot-webapp-authentication-entra-id?tabs=aca)

## Overview

You will need to register two different applications in your Azure AD (Active Directory/ EntraID): The frontend and backend need to be registered separately in order to allow for token exchange and validation. The process of doing so is the same, so just follow the guide below twice.

## What you need

You need a Microsoft/Azure account that is either registered in the [MS Developer programm](https://developer.microsoft.com/en-us/microsoft-365/dev-program) or associated with a corporation that subscribes Azure services (in that case, the following steps will probably be done by your IT departement).

## How to register the application

This step-by-step is for someone who has permissions to register a new application in the Azure AD.

- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [App-Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
- Click on "New Registration"
    - Under Account-types select "only accounts in organizational structure" (german: "Nur Konten in diesem Organisationsverzeichnis")
    - Under Redirect URI select as platform "Web" and add a redirect URI, e.g. `http://localhost:8080/login/oauth2/code/` (port 8080 for backend, for frontend you could use 3000)
- Click "Register"
- Give your application a meaningful name
- You will then be presented with your applications IDs. You need the Client-ID (german: "Anwendungs-ID (Client)"), Tenant-ID (german: "Verzeichnis-ID (Mandant)"), as well as the client-secret. __This is the only time you will be able to see this secret. Write it down somewhere safe, e.g. a password manager!__