# Integration of GraphAPI requests and webhooks

This document shall give a quick overview on how to use Microsoft's GraphAPI in the context of this application. The application mainly uses the GraphAPI to sync a Sharepoint List, which makes the use of a webhook the better approach in order to avoid regular polling.

## Sources

- [Receive change notifications through webhooks](https://learn.microsoft.com/en-us/graph/change-notifications-delivery-webhooks?tabs=http)
- [reauthorizationRequired notifications
](https://learn.microsoft.com/en-us/graph/change-notifications-lifecycle-events?tabs=java#reauthorizationrequired-notifications)

## Comsume a webhook

The GraphAPI webhook of course requires that the application's API is publicly available. The GraphAPI webhook sends a `validationToken` as a parameter in a `GET` request to the `notificationUrl` as a means of validating that a consuming service exists. Within a short timeframe this endpoint needs to echo back this `validationToken` as `text/plain` (10 seconds). This tells the GraphAPI that a consumer is a valid subscriber. Otherwise the subscription creation fails. The proper data comes in the form of a `POST` request to a predefined endpoint. The actual data is in the request body. When registering the endpoint for the GraphAPI you get (or set) a parameter `clientState` that serves as the secret. It is up to the client to verify this secret in order to verify that the data is actually a proper source.
The problem with webhooks can be that data consumption in a proper timeframe needs to be garanteed, otherwise the GraphAPI will start to remove the subscription. So depedending on the processing load, it might make sense to send a `202 Accepted` in any way and perform data processing concurrently. The GraphAPI also sents to a `lifecycleNotificationUrl` which notifies about `reauthorizationRequired` events.

## Expose the API

In order for backend API to be usable for GraphAPI follow the below steps.

- Open the [Azure Portal](https://portal.azure.com/#home) and navigate to [App-Registration](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) and select your backend application
- In the left tab click on "Expose API" (german: "Eine API verfügbar machen")
- Click "Add Scope" (german: "Bereich hinzufügen")
    - Give the scope a name, e.g. "user_scope"
    - Below that, choose "Admins and Users" and fill out the other fields with names and descriptions
    - For "status" select "Active"
- Next, navigate to "API-permissions" in order to give the backend permission to use the GraphAPI for fetching more user informations and the sharepoint lists
- Click on "Add permissions", under "Microsoft APIs" select "Microsoft Graph". Select "delegate permission"
- Search for "Sites" and check the permissions `Sites.Read.All` and `Sites.ReadWrite.All` and add them
- Do the same again but instead of "delegate permission" choose "application permission"
- Finally, select "Grant administrator consent for “Default Directory”" (german: Administratorzustimmung für "Default Directory" erteilen) and make sure all the permission get a green check in the column "status"