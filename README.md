# GigConnect (Frontend)

A lightweight React frontend for a freelance marketplace prototype. This project provides user flows for clients and freelancers, an admin dashboard, gigs management, messaging (real-time via sockets), and a simple payments flow (mocked in development).

## Tech Stack

- Frontend: React.js, Bootstrap, HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB 

## Table of contents

- Project overview
- Features
- Roles and flows (Freelancer, Client, Admin)
- How to run (development)
- Environment & mock API behavior
- Key files and where to look
- Troubleshooting / common notes
- Next steps / contributors

## Project overview

GigConnect is a single-page React application built with functional components and React Hooks. The frontend talks to an API via `src/services/api.js` and uses a small socket client (`src/services/socket.js`) for messaging. In development this repo uses a mock API implementation so you can run and explore the UI without a backend server.

## Features

- User registration & login (freelancer and client)
- Freelancer profiles (bio, skills, hourly rate, rating)
- Create, list and manage gigs (create, delete, view my gigs)
- Search / Find freelancers with filters (skills, location, price, rating)
- Real-time messaging (conversations and chat UI) using sockets
- Admin dashboard: stats, user and gig management
- Mocked payments flow for testing payments in development

## Roles and flows

Freelancer and Client flows are similar, with freelancer profiles containing additional fields.

Freelancer registration (recommended fields):
- Name
- Email
- Password
- confirm Password
- Location
- After registering, complete your freelancer profile: bio, skills (comma separated), hourlyRate, location, and availability.

Client registration (recommended fields):
- Name
- Email
- Password
- confirm Password
- Location
- Clients can post gigs and message freelancers.

Admin login (development/mock):
- Email: `admin@gigconnect.com`
- Password: `admin123`

Note: In development, the mock API will return an admin user when the credentials above are used. Otherwise, the mock API infers role from the provided email (emails containing the string "freelancer" will be treated as freelancer accounts). See `src/services/api.js` for the exact mock behavior.

## How to run (development)

Prerequisites:
- Node.js (v14+ recommended)
- npm (or yarn)

1. Install dependencies

	npm install

2. Start the dev server

	npm start

By default, when `REACT_APP_API_URL` is not set, the project runs in development mode and `src/services/api.js` will use built-in mock responses. If you want the app to point to a real backend, set the environment variable `REACT_APP_API_URL` to your API base URL before starting the dev server.

On Windows PowerShell you can set it for the current session like this:

	$env:REACT_APP_API_URL = "http://localhost:5000/api"
	npm start

Or create a `.env` file in the project root with:

	REACT_APP_API_URL=http://localhost:5000/api

Then run `npm start`.

## Environment & mock API behavior

- The frontend uses `src/services/api.js`. When `process.env.NODE_ENV === 'development'` or `REACT_APP_API_URL` is not set, the file contains `mockResponses` that handle authentication, searching freelancers, messages, gigs, admin endpoints and payments. This makes the app usable without a backend.
- Example mock admin credentials: `admin@gigconnect.com` / `admin123` — use these to access the Admin dashboard in development.
- Search filters supported by the mock API: `skills` (comma separated), `location`, `minPrice`, `maxPrice`, `minRating`.

## Key files and where to look

- `src/services/api.js` — axios instance + mockResponses (development). Good starting point to see available endpoints and mock data shapes.
- `src/services/socket.js` — socket client used by the messaging UI.
- `src/components/freelancer/` — Search & Profile components.
- `src/components/gig/` — CreateGig, GigCard, MyGigs.
- `src/components/messaging/` — Messages UI and socket event handlers.
- `src/components/admin/` — AdminDashboard, UserManagement, SystemSettings.
- `src/styles/App.css` — global styles (search icon visibility and layout fixes were applied here).

## Notes about UI / behavior

- Search icon visibility: the search icon in the Find Freelancers page was adjusted via CSS for consistent sizing.
- Messaging: uses sockets and keeps references stable to avoid stale closures (see `Messages.js` implementation).
- Admin logout behavior: if you want logout to redirect to the Home page, confirm and I can implement that for you (it was requested but not yet changed in the codebase).

## Troubleshooting

- If you see unexpected lint or runtime errors after local edits: try restarting the dev server (`Ctrl+C` then `npm start`).
- If the app fails to reach an API and you expect a real backend, ensure `REACT_APP_API_URL` is set and reachable.
- Git push rejected because remote contains commits not in local: run `git fetch` then `git pull --rebase` (or `git merge`) to sync before pushing. If you want, I can provide exact safe commands for your situation.

## Next steps / suggestions

- (Optional) I can scan the repo for unused files and prepare a safe deletion list (I will not delete anything without your confirmation).
- (Optional) Implement admin logout redirect to HomePage now if you'd like me to patch it.
- Add a CONTRIBUTING.md and a few unit tests for key components (messaging, search) if you want higher confidence when making changes.

---

If you want any part of this README expanded (API reference, screenshots, or development scripts), tell me which section and I'll add it.

## Author

Yerra Shankar
📍 Visakhapatnam, Andhra Pradesh
📧 yerrashankar9392@gmail.com
