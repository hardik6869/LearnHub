# LearnHub API

Express 5 + Mongoose + strict TypeScript. Source in `src/`, compiled to `dist/`.

## Commands

- `npm run dev` — run with watch (tsx)
- `npm run check` — typecheck + lint + format check; must pass before committing
- `npm run seed:i` / `npm run seed:d` — import / delete the data in `_data/*.json`

## Conventions

- Controllers are wrapped in `asyncHandler` and report errors with
  `return next(new ErrorResponse(message, status))` — never send error responses directly.
- Protected routes chain `protect` then `authorize(...roles)`. Roles differ per resource:
  academies/courses use `"publisher", "admin"`, reviews use `"user", "admin"`.
- Update/delete controllers must check ownership:
  `resource.user.toString() !== user.id && user.role !== "admin"` → 401.
- Never let a request set `role` to `"admin"`; only `ASSIGNABLE_ROLES` in `src/config/enums.ts`
  are accepted.
- Nested routers use `express.Router({ mergeParams: true })`. List endpoints use the
  `advancedResult` middleware, which relies on the `"extended"` query parser set in `server.ts`.
- Import types only via `src/types` (`import type { ... } from "../types"`); add new type files
  to `src/types/index.ts`. No `any` — ESLint enforces it.
- Commits follow Conventional Commits (commitlint enforces it).

## Secrets

Environment lives in `config/config.env` (gitignored). Do not read, print or commit it, and never
log tokens, passwords or decoded JWTs. New env vars go in `src/types/environment.d.ts` and the
`config/config.env.env` template with placeholder values only.
