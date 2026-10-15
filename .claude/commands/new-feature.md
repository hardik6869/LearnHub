---
description: Plan and scaffold a frontend feature module (frontend/src/features/<name>)
argument-hint: <feature-name> [what it should do]
---

Build the frontend feature module: $ARGUMENTS

1. Use the `frontend-feature` skill and follow `frontend/CLAUDE.md`.
2. If the feature name is missing, ask for it. Work on a branch `feat/web-<name>` created from an
   up-to-date `main` (or the current feature branch if the user says so).
3. Start by reading the matching backend routes, controllers and models, and check the frontend
   contract (`API_ROUTES`, `types/`, `enums/`, `queryKeys`) — fix gaps with the
   `api-integration` skill first.
4. Present a short plan: screens, routes, hooks, components, schemas and files to create. Wait
   for approval before writing code.
5. Implement in small steps (api + hooks → components → pages + routes → forms). After each step
   run `npm run check`, then stop and summarise what changed.
6. When the module is complete, run the `frontend-reviewer` agent and fix its "Must fix" items.
