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
- Branch from an up-to-date `main`. Related work can share one branch and PR; make one commit per
  working step (each passing `npm run check`).

## Backend conventions

Paths below are relative to `backend/`.

- Controllers are wrapped in `asyncHandler` and report errors with
  `return next(new ErrorResponse(message, status))` — never send error responses directly.
- Protected routes chain `protect` then `authorize(...roles)`. Roles differ per resource:
  academies/courses use `"publisher", "admin"`, reviews use `"user", "admin"`.
- Auth: `protect` accepts a `Bearer` header or the httpOnly `token` cookie (`SameSite=Lax`).
- Update/delete controllers must check ownership:
  `resource.user.toString() !== user.id && user.role !== "admin"` → 401.
- Roles: the schema accepts every `USER_ROLES` value (admins exist, assigned in the database),
  but a request may only set `ASSIGNABLE_ROLES` — check with `isAssignableRole(role)` →
  400 `INVALID_ROLE_MESSAGE` (register, admin create/update user). Never let a request set admin.
- **Whitelist request bodies**: create/update only with
  `pick(req.body, ACADEMY_FIELDS | COURSE_FIELDS | REVIEW_FIELDS)` (`src/utils/pick.ts`,
  `src/config/enums.ts`); `user`/`academy` come from the signed-in user and the route, never the
  body. Never pass `req.body` straight to `create`/`findByIdAndUpdate`.
- Nested routers use `express.Router({ mergeParams: true })`. List endpoints use the
  `advancedResult` middleware, which relies on the `"extended"` query parser set in `server.ts`.
  It never lets clients select or filter `select: false` fields (`HIDDEN_FIELDS`).
- `server.ts` sanitises a copy of `req.query` and pins it on the request (Express 5's
  `req.query` is a re-parsing getter, so in-place sanitising does nothing) — keep that middleware
  before anything that reads `req.query`.
- Forgot password answers the same for known and unknown emails (no account enumeration).
- Import types only via `src/types` (`import type { ... } from "../types"`); add new type files
  to `src/types/index.ts`.

## Secrets

Environment lives in `backend/config/config.env` (gitignored). Do not read, print or commit it, and
never log tokens, passwords or decoded JWTs. New env vars go in `backend/src/types/environment.d.ts`
and the `backend/config/config.env.env` template with placeholder values only.
Frontend env vars (`VITE_*`) are public — never put secrets in them.
