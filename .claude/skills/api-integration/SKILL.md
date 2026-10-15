---
name: api-integration
description: Connect the LearnHub frontend to a backend endpoint end-to-end and keep the API contract in sync — API_ROUTES, types, enums and query keys in frontend/src mirroring backend/src routes, models and enums. Use when consuming a new or changed endpoint, adding/renaming a field or enum value, or when frontend and backend may have drifted.
---

# API integration (frontend ↔ backend contract)

The frontend keeps its own copy of the API contract. These files must always agree:

| Backend (source of truth)                                                       | Frontend mirror                                                             |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `backend/src/routes/*.ts` (+ mounts in `backend/src/server.ts`, base `/api/v1`) | `frontend/src/constants/apiRoutes.ts` (`API_ROUTES`, relative to `/api/v1`) |
| `backend/src/models/*.ts`, `backend/src/types/*.ts`                             | `frontend/src/types/*.ts` (JSON shapes)                                     |
| `backend/src/config/enums.ts`                                                   | `frontend/src/enums/*.ts` (identical values)                                |
| `backend/src/middleware/advancedResult.ts`, `error.ts`                          | `frontend/src/types/api.ts` (envelopes, `ListParams`)                       |

## Steps

1. **Read the backend endpoint**: route file (method, path, `protect`/`authorize` roles, nested
   router?), controller (request body fields, response shape, status codes, ownership check),
   model (fields, `select: false`, defaults, validation, virtuals/`toJSON`).
2. **Route** → add it to `API_ROUTES` under its resource. Static paths are strings
   (`list: "/academies"`), parameterised ones are functions (`detail: (id: Id) => ...`).
   Nested routes live under the parent (`academies.courses(academyId)`).
3. **Types** → update `src/types/<entity>.ts` with the JSON shape, not the Mongoose shape:
   - `ObjectId` → `Id` (string); `Date` → `IsoDateString`
   - Only `Academy` serialises virtuals, so only it has `id` and `courses`; others use `_id`
   - Populated refs are unions: `academy: Id | AcademySummary`
   - Fields with `select: false` (e.g. `password`) never appear
   - Request bodies get their own `<Entity>Payload` type (only fields the client may send — never
     `user`, `role: "admin"`, or server-computed fields like `averageCost`)
   - Export new files from `src/types/index.ts` with `export type *`
4. **Enums** → copy values exactly from `backend/src/config/enums.ts` into `src/enums/`
   (`as const`, derived union type, labels/options for selects). Never invent values the backend
   rejects.
5. **Query keys** → add to `src/constants/queryKeys.ts` (use `entityKeys` for a new entity; add
   nested keys like `byAcademy` when the endpoint is nested).
6. **Envelopes** (all in `src/types/api.ts`): lists (incl. nested lists) → `PaginatedResponse<T>`;
   single resources → `ApiResponse<T>`; deletes → `EmptyResponse`; academy photo upload →
   `MessageResponse` (`message` = new photo); login/register/reset → `AuthTokenResponse` (token
   ignored — the httpOnly cookie authenticates).
7. **Consume** it through a feature api function and hook (see the `frontend-feature` skill) —
   never from a component.
8. **Verify against the running API**: with `npm run dev:api` and `npm run dev:web` running,
   request the endpoint through the Vite dev server's proxy and compare the JSON with the type.
   Take the address from the config instead of assuming it: the dev server port is
   `server.port` in `frontend/vite.config.ts` and the API base path is `VITE_API_BASE_URL`
   (`frontend/.env.example`). Read-only `GET` requests only; never print tokens or cookies.

## When the backend changes

If you change a backend route, field or enum value, update the frontend mirror in the same change
(and vice versa if the frontend needs something new from the API — change the backend first,
following the backend conventions in the root `CLAUDE.md`).

Finish by running the `api-contract-checker` agent; it must report no drift. Then `npm run check`.
