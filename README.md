# EventSphere – Event Management and Booking System

A beginner-friendly MERN project (MongoDB, Express, React, Node.js).

## Requirements
- Node.js (LTS)
- MongoDB Community Server running locally
- MongoDB Compass (optional, for viewing database documents)

> MongoDB Compass is only a database viewer. It does not run the MongoDB database server.
> The backend uses `mongodb://127.0.0.1:27017/eventsphere`.

## Run on Windows (PowerShell)

1. Extract this ZIP.
2. Open the extracted `EventSphere` folder in VS Code.
3. Open a terminal in the project root (the folder containing this README).
4. Install dependencies:

   ```powershell
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

5. Create the backend environment file:

   ```powershell
   Copy-Item backend/.env.example backend/.env
   ```

6. Make sure MongoDB Community Server is installed and running. If installed as a Windows service, check:

   ```powershell
   Get-Service MongoDB
   ```

   If stopped, run PowerShell as Administrator and use:

   ```powershell
   Start-Service MongoDB
   ```

7. Start frontend and backend together from the project root:

   ```powershell
   npm run dev
   ```

8. Open the Vite URL printed in the terminal (usually `http://localhost:5173`).

## Backend health check
Open `http://localhost:5000/api/health`.
- `server: "Running"` means Express is running.
- `database: "Connected"` means MongoDB is connected.

The server starts even if MongoDB is offline, so the health route can explain the issue instead of the browser showing a connection failure.

## Seed demo events and admin
With MongoDB running, open a second terminal at the project root and run:

```powershell
npm run seed
```

This creates demo events and an admin account:
- Email: `admin@eventsphere.com`
- Password: `Admin@123`

Change the demo password before using this project beyond a classroom demo.

## Features
- Home page and event catalogue
- Search and category filtering
- Register and login with hashed passwords and JWT
- Book event tickets
- View and cancel your bookings
- Admin event creation and deletion
- MongoDB collections: `users`, `events`, `bookings`

## Notes
- Public registration creates a normal user account.
- Admin-only actions require the seeded admin account.
- The app uses localStorage for the demo login session.
- This is a learning project, not a production-ready ticketing platform.
