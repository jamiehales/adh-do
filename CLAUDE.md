# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collaborative task management web app for two specific users (Jamie and Ellie) with ADHD. Users can create tasks for each other, request status updates, volunteer updates proactively, and receive completion notifications.

## Development Commands

### Frontend (`frontend/`)
```bash
yarn dev      # Dev server on port 5173 (proxies /api to localhost:5000)
yarn build    # Type-check + Vite build to dist/
yarn preview  # Preview production build
```

### Backend (`backend/AdhDo.Api/`)
```bash
dotnet run    # Run API on port 5000
dotnet build  # Build project
```

### Docker
```bash
docker build -t adh-do .  # Multi-stage build (frontend → backend → runtime)
```

No test or lint commands are currently configured.

## Architecture

**Full-stack:** React/TypeScript frontend + .NET 9 ASP.NET Core backend + SQLite.

**In development:** Frontend (Vite, port 5173) proxies `/api` requests to the backend (port 5000) via `vite.config.ts`. In production, the frontend build is copied to `backend/AdhDo.Api/wwwroot/` and served directly by the .NET app.

**Database:** SQLite at `backend/AdhDo.Api/adh-do.db`. Schema auto-creates on startup via EF Core — no migrations. Models are in `backend/AdhDo.Api/Models/`, DB context in `backend/AdhDo.Api/Data/AppDbContext.cs`.

**State & Updates:** No WebSocket. Frontend polls the backend every 8 seconds for notifications (completions, update request responses).

**Users:** Hardcoded to "Jamie" and "Ellie" — validated in `backend/AdhDo.Api/Controllers/TodosController.cs`.

## Key Concepts

**Two data models:**
- `Todo` — a task with owner, requester, importance level, and optional completion/dismissal state
- `UpdateRequest` — a request for a status update on a todo, with optional response. Also used for volunteered (unsolicited) updates: these are created with `Response` pre-filled and `RequestedByUserId` set to the todo's `RequestedById`.

**Importance levels** control sort order in `GET /api/todos/{userId}`.

**Notification flow:** Completion notifications (`/api/todos/completions-for/{userId}`) and update response notifications (`/api/update-requests/responses-for/{userId}`) are shown as modals and must be explicitly dismissed.

**Update flow:**
- Requested update: other user taps `?` on a todo → owner sees a `?` badge → responds via modal → requester sees `...` badge with the response
- Volunteered update: owner taps `💬` on their own task → submits message → stored as a pre-responded `UpdateRequest` → requester sees same `...` badge
- The "Ask for an update" list shows the most recent update message per todo (from `GET /api/update-requests/updates-for-todos/{userId}`) beneath the task title with fuzzy relative time

## Frontend Structure

- `src/api/` — all API fetch calls
- `src/pages/` — `UserPickerPage` (entry), `DashboardPage` (main app)
- `src/components/` — modal and list components (`VolunteerUpdateModal` for proactive updates, `RespondToUpdateModal` for responding to requests, `AskForUpdateList` for the update request modal)
- `src/types.ts` — shared TypeScript types
- `src/theme.ts` — MUI dark theme (purple/pink palette)

## Deployment

GitHub Actions (`.github/workflows/docker-publish.yml`) builds and pushes the Docker image to GHCR on every push to `main`.
