https://github.com/user-attachments/assets/b653ddc2-82e7-4966-aaad-1ad045ba57b9

## Project Details ##

**Development / Setup Steps (detailed)**

- Clone repo and install dependencies for both packages.

- Start server (local SQLite example):
```
cd server
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

- Start client (point frontend to backend):
```
cd client
cp .env.example .env
npm install
npm run dev
```

**Prerequisites**:
- Node.js (v18+ recommended)
- npm (or pnpm/yarn)
- SQLite (the project uses SQLite in development by default via Prisma)

**Contents**: This README documents the complete folder structure for the client and server, key files, important libraries and configuration, environment variables, database schema overview, and the primary API routes.

**Client (Frontend)**

- **Project root**: `client/`

- **Key files & purpose**
- `app/` : Next.js App Router pages (`layout.tsx`, `page.tsx`) and application-level styles in `globals.css`.
- `components/` : Reusable UI and feature components (job/task tables, add-job form).
- `components/ui/` : Small design system primitives (buttons, inputs, dialogs).
- `hooks/` : React hooks for fetching jobs and user data (`useJobs.ts`, `useUser.ts`) — they use React Query.
- `lib/api.ts` : Axios wrapper configured with the backend base URL (`NEXT_PUBLIC_BACKEND_URL`).
- `providers/query-provider.tsx` : React Query client provider for caching and background fetching.
- `types/common.ts` : Shared TypeScript types/interfaces used across the client.

- **Important libraries & tools**
- `next` / `react` / `react-dom` : Framework and UI runtime.
- `typescript` : Type checking.
- `tailwindcss` + `@tailwindcss/postcss` : Styling pipeline (Tailwind/PostCSS).
- `@tanstack/react-query` : Data fetching and caching.
- `axios` : HTTP client.
- `sonner` : Toasts/notifications.
- `lucide-react` : Icons.
- `next-themes` : Theme management.
- `class-variance-authority`, `clsx`, `tailwind-merge` : Styling utilities.

- **Client env variables**
- `.env.example` contains:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```
- Use `NEXT_PUBLIC_BACKEND_URL` to point the frontend at the running backend.

**Server (Backend)**

- **Project root**: `server/`

- **Key files & purpose**
- `src/server.js` & `src/app.js` : Express app bootstrap and middleware wiring.
- `src/config/env.js` : Loads `.env` values (PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRE, FRONTEND_URL).
- `src/config/prisma.js` : Initializes Prisma client (output under `prisma/generated/prisma`).
- `src/controllers/*` : Controllers implementing route handlers (login/logout, job creation/fetch, CPU info, user summary).
- `src/routes/*` : Express routers mounted by `src/app.js`.
- `src/worker/*` : Background worker logic to execute tasks (uses `piscina`/workers or `better-queue` where configured).

- **Important libraries & tools**
- `express` : HTTP server framework.
- `prisma` + `@prisma/client` : ORM and generated client.
- `dotenv` : Loads `.env` values.
- `jsonwebtoken` : JWT handling for authentication.
- `cookie-parser` : Cookie handling.
- `cors` : Cross-origin support.
- `piscina` / `better-queue` : Worker/pool libraries for task execution.

- **Server env variables** (from `server/.env.example`)
- `PORT` : HTTP server port (default example `3001`).
- `DATABASE_URL` : Prisma datasource (defaults to `file:./dev.db` in example — SQLite file).
- `FRONTEND_URL` : Frontend origin for CORS/redirects.
- `JWT_SECRET` : Secret used to sign JWTs.
- `JWT_EXPIRE` : JWT expiration (ex: `1d`).

**Database (Prisma) — schema overview**

- Location: `server/prisma/schema.prisma` (the generator writes a client to `server/src/generated/prisma`).
- Datasource: `sqlite` by default using `DATABASE_URL`.

- Models (summary):
- `User`
	- `id: Int @id @default(autoincrement())`
	- `name: String @unique`
	- `currentCpu: Int @default(1)` — user-selected CPU parallelism
	- `createdAt`, `updatedAt`
	- relation: `jobs: Job[]`

- `Job`
	- `id`, `name`, `createdAt`, `updatedAt`
	- `currentCpu: Int @default(1)`
	- relation: `tasks: Task[]`
	- optional relation to `User` via `userId`

- `Task`
	- `id`, `jobId` (FK), `time` (execution time in seconds), `status` (string, default `pending`), `name`, `createdAt`, `updatedAt`

- Relations overview: `User` 1-to-many `Job`; `Job` 1-to-many `Task`.

**Key API routes (server)**

- All routes are mounted under `/api` (see `src/routes/index.js`). Some notable endpoints:
- `POST /api/auth/login` : Body `{ name }` — creates or finds user and sets a cookie JWT (`token`). Returns `{ user }`.
- `POST /api/auth/logout` : Clears the auth cookie.
- `GET /api/user` : Returns the current user with jobs and tasks (requires auth via cookie JWT).
- `GET /api/job` : Fetch jobs for the authenticated user.
- `POST /api/job` : Create a job. Body shape example:
	```json
	{
		"name": "My Job",
		"currentCpu": 2,
		"tasks": [{ "name": "task1", "time": 5 }, { "name": "task2", "time": 3 }]
	}
	```
	Response: created job with tasks; job execution is scheduled / started by the server worker.
- `GET /api/cpu` : Returns available CPU count.
- `POST /api/cpu` : Body `{ count }` — update user's `currentCpu` preference.

Notes:
- Authentication is cookie-based JWT. The server sets a `token` cookie on login; middleware decodes the JWT to populate `req.user` for protected routes.

**Where to look next (developer pointers)**
- Frontend data fetching: `client/hooks/useJobs.ts`, `client/hooks/useUser.ts` and `client/lib/api.ts`.
- Backend job lifecycle & execution: `server/src/controllers/job.js` and `server/src/worker/job.js`.
- Prisma models and migrations: `server/prisma/schema.prisma` and `server/prisma/migrations/`.


