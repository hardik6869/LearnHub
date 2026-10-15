---
name: frontend-feature
description: Scaffold or extend a LearnHub frontend feature module (frontend/src/features/<name>) — API functions, React Query hooks with query keys and invalidation, zod form schemas, components, lazy-loaded pages, route registration and the feature barrel. Use when building auth, academies, courses, reviews, users or any new frontend module or page.
---

# Frontend feature module

Read `frontend/CLAUDE.md` first; this skill applies its rules to one module. Build one module per
branch (`feat/web-<name>`), in small reviewable steps, and stop for review after each step.

## 0. Before writing code

1. Read the backend side of the feature: `backend/src/routes/<name>.ts`,
   `backend/src/controllers/<name>.ts`, `backend/src/models/*.ts` — note methods, roles,
   ownership rules, required fields and validation.
2. Confirm the frontend contract exists and matches: `src/constants/apiRoutes.ts`,
   `src/types/<entity>.ts`, `src/enums/`, `src/constants/queryKeys.ts`. If not, use the
   `api-integration` skill first.
3. List the screens and what each needs (list/detail/form, filters, pagination, roles). Agree on
   the list with the user if it isn't obvious.

## 1. Folder layout

```
src/features/<name>/
├── api/<name>Api.ts            # request functions
├── hooks/use<Thing>.ts         # one hook per query/mutation (or a few closely related)
├── hooks/index.ts
├── components/<Thing>.tsx      # UI used only by this feature
├── components/index.ts
├── pages/<Thing>Page.tsx       # route components — NOT exported from any barrel
├── schemas/<thing>Schema.ts    # zod schemas + inferred form types
├── types.ts                    # feature-only types (filters, form values) — optional
└── index.ts                    # public API: api, hooks, components, schemas, types (no pages)
```

Use only the folders you need. Promote a component to `components/common/` only when a second
feature needs it.

## 2. API functions — `api/<name>Api.ts`

```ts
import { http } from "@/api";
import { API_ROUTES } from "@/constants";
import type {
  Academy,
  AcademyPayload,
  ApiResponse,
  EmptyResponse,
  Id,
  ListParams,
  MessageResponse,
  PaginatedResponse,
} from "@/types";

export const academiesApi = {
  // Lists return the whole envelope: components need `pagination` and `count`
  list: (params: ListParams) =>
    http.get<PaginatedResponse<Academy>>(API_ROUTES.academies.list, params),

  // Single resources unwrap `data`
  detail: async (id: Id) =>
    (await http.get<ApiResponse<Academy>>(API_ROUTES.academies.detail(id))).data,

  create: async (payload: AcademyPayload) =>
    (await http.post<ApiResponse<Academy>>(API_ROUTES.academies.list, payload)).data,

  update: async (id: Id, payload: Partial<AcademyPayload>) =>
    (await http.put<ApiResponse<Academy>>(API_ROUTES.academies.detail(id), payload)).data,

  remove: (id: Id) => http.delete<EmptyResponse>(API_ROUTES.academies.detail(id)),

  // Files go as FormData; the backend reads the "file" field
  uploadPhoto: (id: Id, file: File) => {
    const body = new FormData();
    body.append("file", file);
    // `message` is the new photo (Cloudinary URL or file name) — pass it to getPhotoUrl()
    return http.put<MessageResponse>(API_ROUTES.academies.photo(id), body);
  },
};
```

Courses and reviews are **created through the nested route** of their academy
(`http.post(API_ROUTES.academies.courses(academyId), payload)`); `API_ROUTES.courses.list` /
`reviews.list` are read-only lists. Nested lists (`academies.courses(id)`, `academies.reviews(id)`)
return a normal `PaginatedResponse`.

## 3. Hooks — `hooks/`

```ts
// hooks/useAcademies.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants";
import type { ListParams } from "@/types";
import { academiesApi } from "../api/academiesApi";

export function useAcademies(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.academies.list(params),
    queryFn: () => academiesApi.list(params),
    placeholderData: keepPreviousData,
  });
}
```

```ts
// hooks/useAcademy.ts
export function useAcademy(id: Id | undefined) {
  return useQuery({
    queryKey: queryKeys.academies.detail(id ?? ""),
    queryFn: () => academiesApi.detail(id ?? ""),
    enabled: Boolean(id),
  });
}
```

```ts
// hooks/useCreateAcademy.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateAcademy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academiesApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.academies.all });
      toast.success("Academy created");
    },
  });
}
```

Rules: keys only from `queryKeys` (add new keys there, never inline arrays); invalidate every
entity a mutation affects (e.g. a review changes `reviews.all` **and** the academy detail,
because `averageRating` changes); errors toast globally — add `meta: { skipErrorToast: true }`
only when the UI shows the error itself.

## 4. Schemas — `schemas/<thing>Schema.ts`

```ts
import { z } from "zod";
import { CAREERS } from "@/enums";

export const academySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "At most 50 characters"),
  description: z.string().trim().min(1, "Description is required").max(500),
  website: z.url("Enter a valid URL").or(z.literal("")),
  email: z.email("Enter a valid email").or(z.literal("")),
  careers: z.array(z.enum(CAREERS)).min(1, "Choose at least one career"),
  housing: z.boolean(),
});

export type AcademyFormValues = z.infer<typeof academySchema>;
```

Mirror the backend model's validation (check `maxlength`, `required`, `min/max`, regexes). Convert
empty optional strings to `undefined` before sending if the API rejects `""`.

## 5. Components and pages

- Pages: `useDocumentTitle`, `<Container className="space-y-6 py-8">`, `<PageHeader>`, then the
  three states — `isPending` → `LoadingState`, `isError` → `ErrorState onRetry={() => void refetch()}`,
  empty → `EmptyState` — before the content.
- Read URL state with `useParams` / `useSearchParams` (filters and page live in the URL so links
  and back/forward work).
- Forms: react-hook-form + `zodResolver` + shadcn `Field` via `Controller` (see
  `frontend/CLAUDE.md` → Forms). Disable submit while `isPending`; navigate or reset on success.
- Role/ownership-dependent UI uses the current user (auth module's `useMe`) and mirrors the
  backend rules.

## 6. Register routes

1. Add patterns/builders to `src/constants/routes.ts` (`ROUTE_PATHS` + `ROUTES`), and to
   `MAIN_NAV` if it belongs in the header.
2. In `src/app/router.tsx`, inside the layout's inner `children`, add a **lazy** route that imports
   the page by file path (see `frontend/CLAUDE.md` → Adding a route). Protected pages go under
   the auth module's guard route once it exists.

## 7. Barrel — `index.ts`

```ts
export * from "./api/academiesApi";
export * from "./components";
export * from "./hooks";
export * from "./schemas/academySchema";
export type * from "./types";
// Pages are intentionally not exported (lazy-loaded by path)
```

## 8. Finish

- `npm run check` passes (run `/check`).
- Run the app (`npm run dev:api` + `npm run dev:web`) and exercise the flow, including loading,
  empty, error and unauthorised cases, at 375 / 768 / 1280 px and 200% zoom, keyboard only, and
  against the WCAG 2.2 AA checklist in `frontend/CLAUDE.md`.
- Ask the `frontend-reviewer` agent to review the diff; fix what it finds.
- Commit with a `feat(web): …` message.
