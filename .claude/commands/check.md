---
description: Run typecheck, lint and format checks for the whole monorepo and fix failures
argument-hint: "[backend|frontend]"
allowed-tools: Bash(npm run check:*), Bash(npm run typecheck:*), Bash(npm run lint:*), Bash(npm run format:*), Bash(npx prettier:*), Read, Edit, Grep, Glob
---

Run the project checks and fix what fails. Scope: $ARGUMENTS (empty = whole repo).

1. Run `npm run check` from the repo root (or `npm run check -w backend|frontend` for one
   workspace, then `npm run format:check`).
2. For each failure, fix the root cause in the source:
   - Type errors and lint errors: fix the code. Never add `any`, `// @ts-ignore`,
     `eslint-disable` or loosen `eslint.config.*` / `tsconfig*.json` to make a check pass — if a
     rule seems wrong, stop and explain instead.
   - Prettier: run `npx prettier --write <files>` on the reported files only.
   - Never edit generated `frontend/src/components/ui/*` files to satisfy lint.
3. Re-run until it passes, then report: what failed, what you changed (file:line), and the final
   result. If something cannot be fixed safely, say so and leave it.
