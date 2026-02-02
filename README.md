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
VITE_API_URL=http://localhost:8080
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

Start with

```bash
docker run --name ddb -e POSTGRES_PASSWORD=pw -e POSTGRES_USER=pg -e POSTGRES_DB=ddb -d -p 5432:5432 postgres:18
```

### Backend

Built with Kotlin and SpringBoot. Database migrations are handled via Flyway. Database is H2 for dev-config and Postgres in production.

Run the service by opening the project in IntelliJ and starting it via the Run configuration.
The `dev` profile uses an in-memory H2 database. The `prod` profile is intended for PostgreSQL. The choice of profile can be controlled via the `SPRING_PROFILES_ACTIVE` environment variable.

Set your environment variables as 
- `DB_USER=pg`
- `DB_PASSWORD=pw`
- `SECURITY_USER_USER=api`
- `SECURITY_USER_PASSWORD=secret`
(e.g. in the IDE). Then start with:
```bash
./gradlew bootRun
```
__CAREFUL__: If started with `SPRING_PROFILES_ACTIVE=prod` locally, hypothetical tests at build-time are executed on the local "prod"-database. You can skip the testing task with the `-x test` argument.