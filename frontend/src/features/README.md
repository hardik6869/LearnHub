# Features

One folder per module (auth, academies, courses, reviews, users), added one at a time:

```
features/<feature>/
├── api/          # request functions using `http` + `API_ROUTES` (no axios elsewhere)
├── hooks/        # React Query hooks (useQuery/useMutation) with `queryKeys`
├── components/   # UI used only by this feature
├── pages/        # route components, lazy-loaded by the router
├── schemas/      # zod schemas for forms
├── types.ts      # types used only by this feature (shared ones live in src/types)
└── index.ts      # barrel: the feature's public API
```
