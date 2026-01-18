# carrier-hub

Click-dummy for the Carrier Hub tool. The project consists of a React frontend (`/sumitDDP`) and a Kotlin/SpringBoot backend (`/ddb-service`).  
The names `ddp` and `sumit` are legacy and can be ignored.

## Frontend

Built with React and MUI.

```bash
cd sumitDDP
npm install
npm run dev
```

## Backend

Built with Kotlin and SpringBoot. Database migrations are handled via Flyway. Database is H2 for dev-config and Postgres in production.

Run the service by opening the project in IntelliJ and starting it via the Run configuration.
The `dev` profile uses an H2 database. The prod profile is intended for PostgreSQL but is not functional yet.

Docker and docker-compose files can be ignored for now. The setup is not functional yet.
