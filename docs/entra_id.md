# Registration of an application in MS EntraID

## Sources

- [Secure Java Spring Boot apps using Microsoft Entra ID - Azure | Microsoft Learn](https://learn.microsoft.com/en-us/azure/developer/java/identity/enable-spring-boot-webapp-authentication-entra-id?tabs=aca)
- ...uvm

## What you need

You need a Microsoft/Azure account that is either registered in the [MS Developer programm](https://developer.microsoft.com/en-us/microsoft-365/dev-program) or associated with a corporation that subscribes Azure services (in that case, the following steps will probably be done by your IT departement).

## Azure setup

### Register the application

This step-by-step is for someone who has permissions to register a new application in the Azure AD. You will need to register two different applications in your Azure AD (Active Directory/ EntraID): The frontend and backend need to be registered separately in order to allow for token exchange and validation. The process of doing so is the same, so just follow the guide below twice.

- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [App-Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
- Click on "New Registration"
    - Under Account-types select "only accounts in organizational structure" (german: "Nur Konten in diesem Organisationsverzeichnis")
    - Under Redirect URI select as platform "Single-Page Application" and add a redirect URI, e.g. `http://localhost:8080/login/oauth2/code/` (port 8080 for backend, for frontend you could use 5173 and `/dashboard/overview` as path)
- Click "Register"
- Give your application a meaningful name
- You will then be presented with your application IDs. You need the Client-ID (german: "Anwendungs-ID (Client)"), Tenant-ID (german: "Verzeichnis-ID (Mandant)")
- Next, add a secret under "Add certificate or secret" (german: "Ein Zertifikat oder Geheimnis hinzufügen")>"New secret key" and enter an expire time, as well as a meaningful name. You are now presented with the client-secret. __This is the only time you will be able to see this secret. Write it down somewhere safe, e.g. a password manager!__

### Expose the API

In order for the frontend to see the application in Azure, you need to expose the backend API.

- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [App-Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) and select your backend application
- In the left tab click on "Expose API" (german: "Eine API verfügbar machen")
- Click "Add Scope" (german: "Bereich hinzufügen")
    - Give the scope a name, e.g. "user_scope"
    - Below that, choose "Admins and Users" and fill out the other fields with names and descriptions
    - For "status" select "Active"

### Create and assign roles

The backend security is role- and scope-based. We defined the scope in the previous step (which is needed, but we formally will not use it in Spring Security). Now we also need to define roles which the user in the application will have and assign them to the respective user.

__Create roles__
- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [App-Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) and select your backend application
- In the left tab click on "App-roles" (german: "App-Rollen") and select "Create App-role"
- Choose a name, a matching string (e.g. "ADMIN" or "USER") and in the picker choose "User/Groups"
- Do not forget to check the box for "Activate this App-role"

__Assign the roles__
- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [Enterprise-Applications (german: "Unternehmensanwendungen")](https://portal.azure.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview) and select your backend application
- In the left tab click on "Manage">"User and Groups" (german: "Verwalten">"Nutzer und Gruppen") and then use "Add user/group" to add a user and assign one of the roles you previously defined (you can only assign a single role to a person, so you are adviced to design your privileges hirarchially)