# carrier-hub

__This branch is not fully tested. Conceptually, it currently works when starting via docker compose, but starting the backend locally via the dev-profile runs into iss-claim issues with keycloak.__

Click-dummy for the Carrier Hub tool. The project consists of a React frontend (`/frontend`) and a Kotlin/SpringBoot backend (`/service`).  

## Launch

Create a `.env` file from the `.env.example`. See `./docs/keycloak.md` for informations about the IDs and secret that need to be set.

Launch the application with docker compose:

```bash
docker compose up
```

## Setup for development

### Frontend

Built with React and MUI.

Start with:
```bash
cd frontend
npm install
npm run dev
```

### Backend

Built with Kotlin and SpringBoot. Database migrations are handled via Flyway. Database is H2 for `dev`-config and Postgres on `prod`.

Run the service by opening the project in IntelliJ and starting it via the according run-configuration (`.run` directory in this repository).
The `dev` profile uses an in-memory H2 database. The `prod` profile is really only intended for the docker container. The run-configurations hold all the relevant environment variables for a local startup. You still need to start a keycloak container (keycloak/keycloak:26.5.3) add the necessary env-variables (again, see `.env.example`) and then import a the `keycloak/realm-export.json`.

Alternatively to running via Intellij, you can copy all the env-variables from the `run.xml` files into your shell and run `./gradlew bootRun`.
