# carrier-hub

Click-dummy for the Carrier Hub tool. The project consists of a React frontend (`/frontend`) and a Kotlin/SpringBoot backend (`/service`).  

## Launch

Create a `.env` file with the following content:

```bash
POSTGRES_DB=ddb
DB_USER=pg
DB_PASSWORD=pw
SPRING_PROFILES_ACTIVE=prod

POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASSWORD}
```

Launch the application with docker compose:

```bash
docker compose up
```

## Setup for development

### Frontend

Built with React and MUI.

```bash
cd frontend
npm install
npm run dev
```

### Backend

Built with Kotlin and SpringBoot. Database migrations are handled via Flyway. Database is H2 for dev-config and Postgres in production.

Run the service by opening the project in IntelliJ and starting it via the Run configuration.
The `dev` profile uses an H2 database. The `prod` profile is intended for PostgreSQL but is not functional yet. The choice of profile can be controlled via the `SPRING_PROFILES_ACTIVE` envinroment variable.
