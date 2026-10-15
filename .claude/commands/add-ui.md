---
description: Add shadcn/ui components to the frontend and export them from the ui barrel
argument-hint: <component> [component...]
allowed-tools: Bash(npx shadcn@latest add:*), Read, Edit, Glob
---

Add these shadcn/ui components to the frontend: $ARGUMENTS

1. If no component names were given, ask which ones. Check `frontend/src/components/ui/` first and
   skip any that already exist.
2. From the `frontend/` folder run `npx shadcn@latest add <names> < /dev/null` (non-interactive;
   never pass `--overwrite` unless the user asked to replace existing components).
3. Do not hand-edit the generated files (see `frontend/CLAUDE.md` → shadcn notes).
4. Add `export * from "./<file>";` for each new file to `frontend/src/components/ui/index.ts`,
   keeping the list alphabetical.
5. If shadcn added npm dependencies, confirm they landed in `frontend/package.json` and the root
   `package-lock.json` (not a nested lockfile).
6. Run `npx prettier --write frontend/src/components/ui` from the repo root, then
   `npm run check -w frontend`, and report what was added and any new dependencies.
