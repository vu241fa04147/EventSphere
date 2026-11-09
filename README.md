# EventSphere

EventSphere is an event discovery and ticket-booking app built with React, Express, and TiDB/MySQL.

## Features

- Browse events and search by title, location, or description
- Filter events by category and view event details
- Register and sign in with hashed passwords and JWT
- Book tickets, view bookings, and cancel bookings
- Admin event creation and deletion

## Database setup

The backend uses TiDB's MySQL-compatible interface. Create a database, then execute [`backend/schema.sql`](backend/schema.sql) in its SQL console. The schema creates the `users`, `events`, and `bookings` tables.

Copy the backend environment template and fill in the connection values from your database provider:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, and `TIDB_DATABASE`. Choose a long, unique `JWT_SECRET`. Set a private `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters before seeding. Never commit `backend/.env`.

## Run locally (Windows PowerShell)

Install dependencies from the repository root:

```powershell
npm install
npm install --prefix backend
npm install --prefix frontend
```

After configuring the database and executing the schema, seed example events and create the admin account:

```powershell
npm run seed
```

Start the backend and frontend together:

```powershell
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). Check the backend at `http://localhost:5000/api/health`.

## Deploy the frontend with GitHub Pages

The GitHub Actions workflow in `.github/workflows/pages.yml` builds and publishes the frontend on pushes to `main`.

1. In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions**.
2. Push to `main` or run the **Deploy EventSphere to GitHub Pages** workflow manually.
3. Open `https://vu241fa04147.github.io/EventSphere/` after the workflow succeeds.

The frontend uses the existing Render API by default. To use another API, configure `VITE_API_URL` as a GitHub Actions repository variable (include the `/api` path).

## Backend deployment

The API currently points to `https://eventsphere-0rp0.onrender.com/api`. Its health check requires a live TiDB/MySQL database. Configure `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, `TIDB_DATABASE`, and `JWT_SECRET` in the backend host's private environment settings. Execute `backend/schema.sql` against that database and run `npm run seed` with private `ADMIN_EMAIL` and `ADMIN_PASSWORD` values.

`/api/health` should return `"server": "Running"` and `"database": "Connected to TiDB"` before registration, event browsing, and booking can work.

## Demo data

The seed script adds four sample events when the events table is empty. It creates the admin account specified by `ADMIN_EMAIL` and `ADMIN_PASSWORD` only if that email does not already exist. It will not overwrite an existing account's password.

Public registration creates a regular user account. Admin-only operations require the seeded admin account. The login token is stored in the browser's local storage; use HTTPS in production.
