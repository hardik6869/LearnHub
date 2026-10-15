---
name: ui-components
description: Build or change LearnHub frontend UI — choosing and adding shadcn/ui components, composing reusable components in components/common, layouts, responsive and accessible markup, and the "simple, professional" design guardrails. Use for any page layout, component, card, list, form layout, dialog or styling work in frontend/.
---

# UI components (shadcn/ui + Tailwind v4)

## Choose the right layer

1. **`@/components/ui`** — shadcn primitives (Button, Card, Input, Field, Select, Dialog, Sheet,
   DropdownMenu, Badge, Skeleton, Avatar, Separator, Textarea, AlertDialog, Sonner). Use them
   directly; never hand-edit the files.
2. **`@/components/common`** — app-wide building blocks already available: `Container`,
   `PageHeader`, `LoadingState`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `DataPagination`.
   Check here before creating anything.
3. **`features/<name>/components`** — UI specific to one feature (e.g. `AcademyCard`).
   Move it to `common/` only when a second feature needs it.

## Adding shadcn components

- Check `frontend/src/components/ui/` first. To add: `/add-ui <names>` (runs
  `npx shadcn@latest add <names>` in `frontend/` and updates `components/ui/index.ts`).
- Browse what exists at https://ui.shadcn.com/docs/components (this project uses shadcn v4,
  Radix base, Nova preset; forms use `Field`, there is no `form` component).
- Run `npm run check` afterwards; generated files are formatted by Prettier on commit.

## Writing a component

```tsx
import type { Academy } from "@/types";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatCurrency, getPhotoUrl } from "@/lib";

interface AcademyCardProps {
  academy: Academy;
}

export function AcademyCard({ academy }: AcademyCardProps) {
  const photoUrl = getPhotoUrl(academy.photo);
  return (
    <Card className="overflow-hidden">
      {/* image or placeholder, fixed aspect ratio so the grid doesn't jump */}
      <CardHeader>
        <CardTitle className="line-clamp-1">{academy.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {academy.careers.map((career) => (
          <Badge key={career} variant="secondary">
            {career}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
```

- `PascalCase.tsx`, one component, named export, explicit `<Name>Props` interface.
- Props in, events out (`onSelect`, `onDelete`); no data fetching inside presentational
  components — pages/containers call the feature hooks and pass data down.
- Accept `className` and merge with `cn()` when the parent may need to adjust layout.
- Keep it small: split when a component grows past ~150 lines or does two jobs.
- `memo` only for items rendered in long lists with stable props.

## Design guardrails ("simple, professional, not over-designed")

- **Light theme only** (no dark mode, no `dark:` classes in app code). Colour tokens only:
  `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border`,
  `border-input`, `bg-primary`, `text-destructive`. They are measured for WCAG 2.2 AA contrast
  (see `frontend/CLAUDE.md` → Accessibility). No hex colours, gradients, custom shadows, inline
  styles, or opacity on readable text.
- Typography: page titles via `PageHeader`; `text-sm text-muted-foreground` for secondary text;
  `line-clamp-*` for long titles/descriptions.
- Spacing rhythm: `gap-2/3/4/6`, sections `py-8`–`py-12`, page body
  `<Container className="space-y-6 py-8">`.
- Lists: responsive grid `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`; images `aspect-video` with
  `object-cover`.
- Icons: lucide-react, `size-4`/`size-5`, `aria-hidden` when decorative.
- Every data view has loading (`LoadingState`), empty (`EmptyState`) and error (`ErrorState`)
  states.

## Responsive checklist (mobile-first)

- Base classes target phones; add `sm:`/`md:`/`lg:` for larger screens.
- No horizontal scroll at 375 px; tap targets ≥ 40 px; stacked buttons `w-full` on phones.
- Header navigation collapses into `MobileNav` below `md`.
- Tables become cards or stack on small screens.

## Accessibility checklist (WCAG 2.2 AA — full rules in `frontend/CLAUDE.md`)

- Contrast: text ≥ 4.5:1, controls/focus/meaningful icons ≥ 3:1 — achieved by using the tokens
  as-is; never lighten text with opacity or place text on images without a solid overlay.
- Colour is never the only signal: errors have text, badges have labels, body links underlined.
- Keyboard: everything reachable and operable, logical tab order, focus always visible and not
  hidden by the sticky header.
- Real `<button>` / `<Link>` (use `Button asChild` around `Link` for link-styled buttons).
- Every input has a visible `FieldLabel`; required fields marked in text; errors via `FieldError`
  with `aria-invalid`; `autoComplete` on personal fields.
- Icon-only buttons have `aria-label`; decorative icons `aria-hidden`; images have `alt`.
- One `<h1>` per page, headings in order; unique page title via `useDocumentTitle`.
- Dialogs have a title (and `sr-only` description if hidden); Radix handles focus trapping.
- Status regions: `LoadingState` already uses `role="status"`.
- Works at 320 px and 200% zoom without horizontal scroll; respect `prefers-reduced-motion`.
