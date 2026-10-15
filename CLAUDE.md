# LearnHub

Academy directory website. npm workspaces monorepo:

- `backend/` — REST API: Express 5 + Mongoose + strict TypeScript (`backend/src/` → `backend/dist/`)
- `frontend/` — web app: React 19 + Vite + strict TypeScript + Tailwind v4 + shadcn/ui.
  **Read `frontend/CLAUDE.md` before working in `frontend/`.**

Husky, lint-staged, commitlint and Prettier live at the root and cover both workspaces.

## Commands

Run from the repo root:

- `npm install` — installs every workspace (hoisted into the root `node_modules`). Add packages
  with `npm i <pkg> -w backend|frontend`; never run `npm install` inside a workspace folder
- `npm run dev:api` — API with watch on :4000 (tsx)
- `npm run dev:web` — web app on :5173; proxies `/api` and `/uploads` to the API, so run both
- `npm run check` — typecheck + lint every workspace, then Prettier check; must pass before committing
- `npm run build` — build both workspaces
- `npm run seed:i` / `npm run seed:d` — import / delete the data in `backend/_data/*.json`
- `npm run <script> -w backend|frontend` — run a workspace script directly

## Shared rules

- Commits follow Conventional Commits (commitlint enforces it); scopes: `api`, `web`.
  Body lines ≤ 100 characters.
- Strict TypeScript, no `any` (ESLint enforces it in both workspaces).
- Frontend `types/`, `enums/` and `constants/apiRoutes.ts` mirror the backend's models, enums and
  routes — when an API route, field or enum value changes, update both sides in the same change
  (the `api-contract-checker` agent verifies this).
- Branch from an up-to-date `main`; one feature module per branch and PR.

## Backend conventions

Paths below are relative to `backend/`.

- Controllers are wrapped in `asyncHandler` and report errors with
  `return next(new ErrorResponse(message, status))` — never send error responses directly.
- Protected routes chain `protect` then `authorize(...roles)`. Roles differ per resource:
  academies/courses use `"publisher", "admin"`, reviews use `"user", "admin"`.
- Auth: `protect` accepts a `Bearer` header or the httpOnly `token` cookie (`SameSite=Lax`).
- Update/delete controllers must check ownership:
  `resource.user.toString() !== user.id && user.role !== "admin"` → 401.
- Never let a request set `role` to `"admin"`; only `ASSIGNABLE_ROLES` in `src/config/enums.ts`
  are accepted.
- Nested routers use `express.Router({ mergeParams: true })`. List endpoints use the
  `advancedResult` middleware, which relies on the `"extended"` query parser set in `server.ts`.
- Import types only via `src/types` (`import type { ... } from "../types"`); add new type files
  to `src/types/index.ts`.

## Secrets

Environment lives in `backend/config/config.env` (gitignored). Do not read, print or commit it, and
never log tokens, passwords or decoded JWTs. New env vars go in `backend/src/types/environment.d.ts`
and the `backend/config/config.env.env` template with placeholder values only.
Frontend env vars (`VITE_*`) are public — never put secrets in them.
