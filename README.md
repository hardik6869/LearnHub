# LearnHub

> LearnHub is an academy directory website.

## Structure

This is an npm workspaces monorepo:

- `backend/` — the LearnHub API (Express 5 + Mongoose + TypeScript)
- `frontend/` — the LearnHub web app (React + Vite + TypeScript + Tailwind CSS + shadcn/ui)

Git hooks, commit linting and Prettier are configured at the root and apply to every workspace.

## Usage

Rename "backend/config/config.env.env" to "backend/config/config.env" and update the value/settings
to your own.

## Install Dependencies

Run once at the repository root; it installs every workspace.

```text
npm install
```

## Run App

```text
# Run the API in Dev mode (TypeScript via tsx, with watch)
npm run dev:api

# Run the web app on http://localhost:5173 (proxies /api to the API, so start both)
npm run dev:web

# Build both workspaces, then run the API / preview the web app in Prod mode
npm run build
npm run start:api
npm run preview:web
```

## Type Checking, Lint & Format

The source is strict TypeScript, with no `any` (enforced by ESLint).

```text
# Typecheck + lint every workspace, then check formatting
npm run check

npm run typecheck
npm run lint
npm run format
```

## Seed Database

```text
# Import data from backend/_data/
npm run seed:i

# Destroy all data
npm run seed:d
```

- Version: 1.0.0
- License: MIT

## API Endpoints

Base URL: `/api/v1`

- `/academies` — list/create academies; `/academies/:id` — get/update/delete; `/academies/:id/photo` — upload photo
- `/academies/:academyId/courses` and `/academies/:academyId/reviews` — nested courses and reviews
- `/courses`, `/reviews`, `/auth`, `/users`
