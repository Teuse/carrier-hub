# Is it possible to have multiple different auth flows in parallel?

Example: EntraID and Keycloak

## Thoughts

I think yes, but you will need to decided somewhere on which to use, because this changes the token handling. So this could be done based on user decision at the login mask (frontend). The backend could then decide based on the API-endpoint that was targeted (e.g. `/api/auth/entra_id` vs. `/api/auth/keycloak`). Both are based on JWT, as far as I know. In Spring you would need some logic that differentiates the tokens from one another. For example, the username-field in the tokens have different namings in EntraID vs Keycloak. This either needs to be run through the whole backend application, or there needs to be some sort of custom unification class that translates to common namings. These differences could also be used as a decision base vs. the endpoint-based approach mentoined before.
In a more elaborate application, which might use an API Gateway that handles the auth already, I have no idea how it would work then.