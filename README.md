# carrier-hub

Click-dummy for the Carrier Hub tool. The project consists of a React frontend (`/frontend`) and a Kotlin/SpringBoot backend (`/service`).  

## Launch

Create a `.env` file with the following content:

```bash
SPRING_PROFILES_ACTIVE=prod
POSTGRES_DB=ddb
DB_USER=pg
DB_PASSWORD=pw
SECURITY_USER_NAME=user
SECURITY_USER_PASSWORD=pw
VITE_SECURITY_USER_NAME=${SECURITY_USER_NAME}
VITE_SECURITY_USER_PASSWORD=${SECURITY_USER_PASSWORD}
POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASSWORD}
VITE_API_BASE_URL=http://localhost:8080

AZURE_BACKEND_CLIENT_ID=<your-Azure-AD-backend-client-ID>
AZURE_TENANT_ID=<your-Azure-AD-Tenant-ID>
CARRIER_HUB_CLIENT_SECRET=<your-Azure-AD-client-secret>
```

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

### Database

Only needed for `prod`-config of the backend. Start with

```bash
docker run --name ddb -e POSTGRES_PASSWORD=pw -e POSTGRES_USER=pg -e POSTGRES_DB=ddb -d -p 5432:5432 postgres:18
```

### Backend

Built with Kotlin and SpringBoot. Database migrations are handled via Flyway. Database is H2 for `dev`-config and Postgres on `prod`.

Run the service by opening the project in IntelliJ and starting it via the according run-configuration (`.run` directory in this repository).
The `dev` profile uses an in-memory H2 database. The `prod` profile is intended for PostgreSQL. The choice of profile is controlled via the `SPRING_PROFILES_ACTIVE` environment variable. The run-configurations hold all the relevant environment variables, except for `CARRIER_HUB_CLIENT_SECRET`. You are adviced to set this in locally in your shell/OS. Currently, the other two MS-EntraID related env-variables are basically a placeholder and useless without the `CARRIER_HUB_CLIENT_SECRET`. You will need to register your instance of this application in your Azure active directory (MS-EntraID) and copy the relevant IDs and secret.

Alternatively, you can copy all the env-variables from the `run.xml` files into your shell and run `./gradlew bootRun`.

__CAREFUL__: If started with `SPRING_PROFILES_ACTIVE=prod` locally, hypothetical tests at build-time are executed on the local "prod"-database. You can skip the testing task with the `-x test` argument.
