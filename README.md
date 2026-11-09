# EventSphere

EventSphere is an event discovery and ticket-booking app built with React, Express, and MongoDB Atlas.

## Features

- Browse events and search by title, location, or description
- Filter events by category and view event details
- Register and sign in with hashed passwords and JWT
- Book tickets, view bookings, and cancel bookings
- Admin event creation and deletion

## Configure MongoDB Atlas

The backend uses MongoDB collections (`users`, `events`, and `bookings`). MongoDB creates these collections when the application first writes documents; no SQL schema or `schema.sql` is needed.

1. In MongoDB Atlas, create a database user and allow the Render service to connect in **Network Access**. For better security, add the Render service's outbound IP ranges instead of allowing every IP.
2. In your Atlas cluster, click **Connect → Drivers** and copy the Node.js connection string.
3. Replace its username and password with the database user's credentials, URL-encoding special characters in those values. Set the database name in the URI path to `eventsphere`.
4. Save the URI as `MONGO_URI` in the Render backend service's private environment variables. Do not commit the URI or share it publicly.
5. Also set `JWT_SECRET` to a long, unique random value.

The API health check at `/api/health` reports `"database": "Connected to MongoDB Atlas"` when the connection works.

## Run locally (Windows PowerShell)

Install dependencies from the repository root:

```powershell
npm install
npm install --prefix backend
npm install --prefix frontend
```

Copy the environment template and fill in `MONGO_URI` and `JWT_SECRET`:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters in `backend/.env`, then seed sample events and create the admin account:

```powershell
npm run seed
```

The seeder adds four sample events when the events collection is empty. It creates the admin account only if that email does not already exist and never changes an existing account's password.

Start the backend and frontend together:

```powershell
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). Check the backend at `http://localhost:5000/api/health`.

## Deploy the frontend with GitHub Pages

The GitHub Actions workflow in `.github/workflows/pages.yml` builds and publishes the frontend on pushes to `main`.

The repository must have GitHub Pages enabled with **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The frontend is published at `https://vu241fa04147.github.io/EventSphere/` and uses `https://eventsphere-0rp0.onrender.com/api` by default. To use another API, configure `VITE_API_URL` as a GitHub Actions repository variable, including the `/api` path.

## Backend deployment

The Render web service should use the `backend` directory as its root, `npm install` as its build command, and `npm start` as its start command. Set `MONGO_URI` and `JWT_SECRET` in Render's private environment settings. Render automatically deploys code pushed to the linked branch when auto-deploy is enabled.

To create sample events and an admin user in production, run `npm run seed` from the backend service shell after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` privately in the service environment. Remove those seed-only variables afterward if they are no longer needed.

Public registration creates a regular user account. Admin-only operations require the seeded admin account. The login token is stored in browser local storage; use HTTPS in production.
