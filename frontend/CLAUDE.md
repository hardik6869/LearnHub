# LearnHub Web (frontend)

React 19 + Vite 8 + strict TypeScript · Tailwind CSS v4 · shadcn/ui v4 (Radix base, Nova preset,
neutral) · react-router v8 (data router) · TanStack Query v5 · axios · react-hook-form + zod v4 ·
sonner toasts · lucide-react.

**Light theme only, WCAG 2.2 AA.** There is no theme switching and no dark mode: don't add a
theme toggle, `ThemeProvider`, `.dark` tokens or `dark:` classes in app code. The `dark:`
classes inside generated `ui/*` stay inert (the `dark` variant only matches a `.dark` class that
is never set). `next-themes` is installed only because the generated `ui/sonner.tsx` imports
it; `AppToaster` forces `theme="light"`. See "Accessibility (WCAG 2.2 AA)" below.

Goal for every screen: **simple, professional, responsive — not over-designed.** Use shadcn
components and the colour tokens (indigo brand on slate neutrals, plus `success`, `warning`,
`info`); no custom colours, gradients or heavy decoration.

## Commands (from the repo root)

- `npm run dev:web` (needs `npm run dev:api` for data) · `npm run check` · `npm run build -w frontend`
- Add a package: `npm i <pkg> -w frontend` — never `npm install` inside `frontend/`
- Add shadcn components: `/add-ui <names>` (or `npx shadcn@latest add <names>` in `frontend/`,
  then export them from `src/components/ui/index.ts`)
- New feature module: `/new-feature <name>` · Run checks and fix: `/check`

## Folder map (`src/`)

| Folder               | Holds                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`               | `App`, `Providers` (React Query, toaster, devtools), `queryClient`, `router.tsx`                                                                         |
| `api/`               | `apiClient` (axios), `http` helpers, `ApiError`, `getErrorMessage`                                                                                       |
| `config/`            | `env` (typed `import.meta.env`)                                                                                                                          |
| `constants/`         | `API_ROUTES`, `ROUTES` / `ROUTE_PATHS`, `queryKeys`, `MAIN_NAV`, app constants                                                                           |
| `enums/`             | `CAREERS`, `MINIMUM_SKILLS`, `USER_ROLES`, `ASSIGNABLE_ROLES` + labels/options                                                                           |
| `types/`             | API JSON shapes (`Academy`, `Course`, `Review`, `User`), envelopes, payloads, `ListParams`                                                               |
| `lib/`               | `cn`, `toQueryString`, `getPhotoUrl`, `formatCurrency/Date/Rating`, `TONE_CHIP_CLASSES`                                                                  |
| `hooks/`             | shared hooks: `useDebounce`, `useDocumentTitle`                                                                                                          |
| `components/ui/`     | shadcn-generated components — kebab-case, **never hand-edited**                                                                                          |
| `components/common/` | reusable app components: `Container`, `PageHeader`, `LoadingState`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `DataPagination`, form fields (`form/`) |
| `components/layout/` | `RootLayout`, `Header`, `MobileNav`, `MainNav`, `Footer`, `Logo`, `AppToaster`, `AuthActions`                                                            |
| `features/<name>/`   | one module each: `api/ hooks/ components/ pages/ schemas/ types.ts index.ts` (see `features/README.md`)                                                  |
| `pages/`             | app-level pages: `HomePage` (lazy), `NotFoundPage`, `RouteErrorPage`                                                                                     |

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

```text
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
- The current user comes from `GET /auth/me` via `useCurrentUser()` (`queryKeys.auth.me`); the
  API answers `data: null` when signed out (no 401), so the check never logs an error.
- Role checks mirror the backend: academies/courses — `publisher`/`admin`; reviews —
  `user`/`admin`; users — `admin`. Owners or admins may edit/delete. Hiding UI is a convenience;
  the API is the real guard.
- Sign-up may only offer `ASSIGNABLE_ROLES` (never `admin`).

## Forms

react-hook-form + zod (`zodResolver`). Use the field wrappers from `@/components/common`
(`TextField`, `TextareaField`, `SelectField`, `CheckboxField`) — each renders the label,
control, `required` marker and error, one line per field:

```tsx
<TextField control={form.control} name="email" label="Email" type="email" required />
<SelectField control={form.control} name="role" label="Role" options={ASSIGNABLE_ROLE_OPTIONS} />
```

For a control without a wrapper, use `FormField` with a `render` function (it supplies the
`Controller`, shadcn `Field`, label and `FieldError`); add a new wrapper once it is used twice.

- Schemas in `features/<f>/schemas/`, named `<thing>Schema`, with `type X = z.infer<typeof …>`.
  Validation mirrors the backend model (required fields, lengths, rating 1–10, enums from
  `@/enums`). zod v4: `z.email()`, `z.url()`, `z.enum(CAREERS)`.
- Disable the submit button while `mutation.isPending`; show API errors with `FieldError` or the
  toast.

## UI and styling

- Tailwind utilities only, merged with `cn()`; theme tokens (`bg-background`, `text-muted-foreground`,
  `border`, `bg-primary`…) — never hard-coded colours or inline styles. Prettier sorts classes.
- **Mobile-first**: base styles for phones, then `sm:` / `md:` / `lg:`. Page width via
  `<Container>`. Check 375 px, 768 px and 1280 px, and 200% browser zoom.
- Every page: `useDocumentTitle("…")`, `<PageHeader>`, and explicit loading
  (`LoadingState`), empty (`EmptyState`) and error (`ErrorState` with `onRetry={refetch}`) states.
- Create/edit forms open in a `FormDialog` over the current page (not a separate route);
  close it in the mutation's `onSuccess`. Destructive actions confirm with `ConfirmDialog`
  (`destructive`, `isPending`).
- Accessibility: follow the WCAG section below.
- Performance: keep components small; derive values instead of syncing state; `memo` only for
  items rendered in long lists; never create query keys or objects inline in deps without need.
- Photos: always `getPhotoUrl(academy.photo)` (Cloudinary URL or `/uploads/<file>`; `null` →
  placeholder).

## Accessibility (WCAG 2.2 AA)

Every screen must meet WCAG 2.2 level AA.

**Colour and contrast** — the tokens in `src/styles/globals.css` are measured (ratios in the
comment above `:root`); keep to them:

| Use                                 | Classes                                          | Contrast on white      |
| ----------------------------------- | ------------------------------------------------ | ---------------------- |
| Body text                           | `text-foreground`                                | 17.8:1                 |
| Secondary text (also on `bg-muted`) | `text-muted-foreground`                          | 7.6:1 (6.9:1)          |
| Brand: buttons, links, active state | `bg-primary`, `text-primary`                     | 8.1:1                  |
| Tinted surface (hero, active nav)   | `bg-accent` + `text-accent-foreground`           | 9.0:1 on accent        |
| Status text / icon chips            | `text-success` / `text-warning` / `text-info`    | 4.9 / 5.1 / 5.4:1      |
| Status chip backgrounds             | `bg-success-muted` etc. (`TONE_CHIP_CLASSES`)    | text on them ≥ 4.7:1   |
| Errors, destructive actions         | `text-destructive`, destructive `Button` variant | 8.4:1                  |
| Chart bars                          | `var(--chart-1…5)`                               | ≥ 3.2:1 (graphics)     |
| Input / control borders             | `border-input`                                   | 4.8:1 (needs ≥ 3:1)    |
| Decorative dividers only            | `border`, `Separator`                            | not a control boundary |
| Focus ring                          | built into shadcn components (`ring`)            | 8.1:1                  |

On a `bg-primary` surface the default focus ring is invisible: override it with
`focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60`.

- Text ≥ 4.5:1 (large text ≥ 3:1); UI component boundaries, focus indicators and meaningful
  icons ≥ 3:1 (1.4.3, 1.4.11). Never lower contrast with opacity on text (`text-foreground/60`,
  `opacity-50` on readable content) or put text on images without a solid overlay.
- **Don't change a colour token** without re-measuring every pair above; no hard-coded colours.
- **Never use colour alone** to convey meaning (1.4.1): errors have text (`FieldError`), status
  badges have a label, toasts have icons, links in body text are underlined.

**Keyboard and focus**

- Everything works with the keyboard alone (2.1.1); tab order follows the visual order; no
  positive `tabIndex`. Use real `<button>` / `<Link>` (`Button asChild` around `Link`).
- Focus is always visible (2.4.7) — never `outline-none` without the shadcn ring replacement — and
  never hidden behind the sticky header (2.4.11).
- Dialogs/sheets trap focus and return it on close (Radix does this; don't rebuild them).

**Structure and names**

- One `<h1>` per page (`PageHeader`), headings in order; landmarks from `RootLayout`
  (`header`, `nav`, `main`, `footer`). Every page sets a unique title (`useDocumentTitle`).
- Inputs have a visible `FieldLabel`; required fields marked in text; errors linked via
  `aria-invalid` + `FieldError` and described in words (3.3.1, 3.3.2). Use `autoComplete` on
  personal fields (name, email, current/new password) (1.3.5).
- Icon-only buttons have `aria-label`; decorative icons `aria-hidden`; images have `alt`
  (academy photo → academy name; decorative → `alt=""`).
- Loading uses `LoadingState` (`role="status"`); async results and errors are announced (toasts,
  `FieldError`).

**Layout**

- Works at 320 px width and 200% zoom without horizontal scrolling (1.4.10); text can be spaced
  (1.4.12); tap targets ≥ 24×24 px (2.5.8) — shadcn button sizes already are.
- Respect `prefers-reduced-motion` for any added animation (`motion-safe:` / `motion-reduce:`).

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
