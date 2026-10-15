# LearnHub Web (frontend)

React 19 + Vite 8 + strict TypeScript · Tailwind CSS v4 · shadcn/ui v4 (Radix base, Nova preset,
neutral, light/dark) · react-router v8 (data router) · TanStack Query v5 · axios ·
react-hook-form + zod v4 · sonner toasts · lucide-react.

Theme: own `ThemeProvider` / `useTheme` (`components/layout`), with the first paint set by the
inline script in `index.html` (same `theme` localStorage key). Don't use `next-themes`'
provider — it renders a `<script>` React 19 warns about; the package stays only because the
generated `ui/sonner.tsx` imports it, and `AppToaster` passes the theme to the toaster.

Goal for every screen: **simple, professional, responsive — not over-designed.** Use shadcn
components and theme tokens; no custom colours, gradients or heavy decoration.

## Commands (from the repo root)

- `npm run dev:web` (needs `npm run dev:api` for data) · `npm run check` · `npm run build -w frontend`
- Add a package: `npm i <pkg> -w frontend` — never `npm install` inside `frontend/`
- Add shadcn components: `/add-ui <names>` (or `npx shadcn@latest add <names>` in `frontend/`,
  then export them from `src/components/ui/index.ts`)
- New feature module: `/new-feature <name>` · Run checks and fix: `/check`

## Folder map (`src/`)

| Folder               | Holds                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`               | `App`, `Providers` (theme, React Query, toaster, devtools), `queryClient`, `router.tsx`                                                   |
| `api/`               | `apiClient` (axios), `http` helpers, `ApiError`, `getErrorMessage`                                                                        |
| `config/`            | `env` (typed `import.meta.env`)                                                                                                           |
| `constants/`         | `API_ROUTES`, `ROUTES` / `ROUTE_PATHS`, `queryKeys`, `MAIN_NAV`, app constants                                                            |
| `enums/`             | `CAREERS`, `MINIMUM_SKILLS`, `USER_ROLES`, `ASSIGNABLE_ROLES` + labels/options                                                            |
| `types/`             | API JSON shapes (`Academy`, `Course`, `Review`, `User`), envelopes, payloads, `ListParams`                                                |
| `lib/`               | `cn`, `toQueryString`, `getPhotoUrl`, `formatCurrency/Date/Rating`                                                                        |
| `hooks/`             | shared hooks: `useDebounce`, `useMediaQuery`, `useDocumentTitle`                                                                          |
| `components/ui/`     | shadcn-generated components — kebab-case, **never hand-edited**                                                                           |
| `components/common/` | reusable app components: `Container`, `PageHeader`, `LoadingState`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `DataPagination`         |
| `components/layout/` | `RootLayout`, `Header`, `MobileNav`, `MainNav`, `Footer`, `Logo`, `ThemeToggle`, `ThemeProvider`, `useTheme`, `AppToaster`, `AuthActions` |
| `features/<name>/`   | one module each: `api/ hooks/ components/ pages/ schemas/ types.ts index.ts` (see `features/README.md`)                                   |
| `pages/`             | app-level pages: `HomePage` (lazy), `NotFoundPage`, `RouteErrorPage`                                                                      |

## Naming

| What                                                       | File                    | Identifier         |
| ---------------------------------------------------------- | ----------------------- | ------------------ |
| Components, pages, layouts, providers                      | `PascalCase.tsx`        | `PascalCase`       |
| Hooks                                                      | `useThing.ts`           | `useThing`         |
| Other modules (api, constants, lib, types, enums, schemas) | `camelCase.ts`          | `camelCase`        |
| Constants / enum-like objects                              | —                       | `UPPER_SNAKE_CASE` |
| Types / interfaces                                         | —                       | `PascalCase`       |
| Folders                                                    | lowercase               | —                  |
| shadcn `components/ui/*`                                   | kebab-case as generated | as generated       |

One component per file, **named exports only** (no default exports). Rename files with `git mv`
(Windows is case-insensitive).

## Imports and barrels

- Import across folders through the barrel: `@/components/ui`, `@/components/common`,
  `@/constants`, `@/types`, `@/enums`, `@/lib`, `@/hooks`, `@/api`, `@/features/<name>`.
- Inside a folder, import siblings by relative path (`./EmptyState`) — never your own barrel
  (circular imports).
- Type-only barrels use `export type *`; import types with `import type`.
- **Lazy-loaded pages are never exported from a barrel** (`pages/index.ts`, feature `index.ts`).
  The router imports them by file path; a barrel export would pull them into the main bundle.
- `queryClient` lives in `app/` (not `config/`) because it imports `@/api`, which imports `@/config`.

## Data flow (never call axios or `http` from a component)

```
component → feature hook (useQuery/useMutation) → feature api fn → http.* with API_ROUTES
```

- **API functions** (`features/<f>/api/<f>Api.ts`): typed with `@/types`, URLs only from
  `API_ROUTES`. Detail endpoints unwrap `ApiResponse<T>` and return `T`; list endpoints return the
  whole `PaginatedResponse<T>` (components need `pagination`).
- **Query hooks**: keys only from `queryKeys` (`queryKeys.academies.list(params)`); lists use
  `placeholderData: keepPreviousData` so pagination doesn't flash.
- **Mutation hooks**: invalidate the entity's keys on success
  (`queryClient.invalidateQueries({ queryKey: queryKeys.academies.all })`) and show a success
  toast. Errors toast automatically (global `MutationCache`); pass
  `meta: { skipErrorToast: true }` when the form shows the error inline.
- Errors are always `ApiError` (`status`, `message` from the API, `isUnauthorized`,
  `isClientError`); show messages with `getErrorMessage(error)`. 4xx queries are not retried.
- List filters are plain objects in `ListParams`; `toQueryString` turns
  `{ averageCost: { lte: 10000 }, careers: { in: [...] } }` into the API's bracket syntax.

## Auth

- The API sets an **httpOnly `token` cookie**; axios sends it (`withCredentials`). Never read,
  store or log the JWT — not in localStorage, state or logs. Login/register responses include
  `token`: ignore it.
- The current user comes from `GET /auth/me` (`queryKeys.auth.me`); a 401 means signed out.
- Role checks mirror the backend: academies/courses — `publisher`/`admin`; reviews —
  `user`/`admin`; users — `admin`. Owners or admins may edit/delete. Hiding UI is a convenience;
  the API is the real guard.
- Sign-up may only offer `ASSIGNABLE_ROLES` (never `admin`).

## Forms

react-hook-form + zod (`zodResolver`) + shadcn **`Field`** components (shadcn v4 has no `form`
component):

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

- Schemas in `features/<f>/schemas/`, named `<thing>Schema`, with `type X = z.infer<typeof …>`.
  Validation mirrors the backend model (required fields, lengths, rating 1–10, enums from
  `@/enums`). zod v4: `z.email()`, `z.url()`, `z.enum(CAREERS)`.
- Disable the submit button while `mutation.isPending`; show API errors with `FieldError` or the
  toast.

## UI and styling

- Tailwind utilities only, merged with `cn()`; theme tokens (`bg-background`, `text-muted-foreground`,
  `border`, `bg-primary`…) — never hard-coded colours or inline styles. Prettier sorts classes.
- **Mobile-first**: base styles for phones, then `sm:` / `md:` / `lg:`. Page width via
  `<Container>`. Check 375 px, 768 px, 1280 px and dark mode.
- Every page: `useDocumentTitle("…")`, `<PageHeader>`, and explicit loading
  (`LoadingState`), empty (`EmptyState`) and error (`ErrorState` with `onRetry={refetch}`) states.
- Destructive actions confirm with `ConfirmDialog` (`destructive`, `isPending`).
- Accessibility: real `<button>`/`<Link>`, labels on inputs, `aria-label` on icon-only buttons,
  `aria-hidden` on decorative icons.
- Performance: keep components small; derive values instead of syncing state; `memo` only for
  items rendered in long lists; never create query keys or objects inline in deps without need.
- Photos: always `getPhotoUrl(academy.photo)` (Cloudinary URL or `/uploads/<file>`; `null` →
  placeholder).

## shadcn notes

- `components/ui/*` stay exactly as generated (ESLint relaxes two rules there) so
  `shadcn add --overwrite` remains safe. Customise by wrapping in `components/common/`.
- Components import `cn` from the `cn` package (shadcn's clsx + tailwind-merge replacement);
  app code imports `cn` from `@/lib`.

## Adding a route

In `app/router.tsx`, inside the layout's inner `children`:

```tsx
{
  path: ROUTE_PATHS.academies,
  lazy: async () => ({
    Component: (await import("@/features/academies/pages/AcademiesPage")).AcademiesPage,
  }),
},
```

Add the path to `ROUTE_PATHS`/`ROUTES` in `constants/routes.ts` first, and to `MAIN_NAV` if it
belongs in the header.
