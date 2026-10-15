# LearnHub API

> Backend API for LearnHub application, which is an academy directory website.

## Usage

Rename "config/config.env.env" to "config/config.env" and update the value/settings to your own.

## Install Dependencies

```text
npm install
```

## Run App

```text
# Run in Dev mode (TypeScript via tsx, with watch)
npm run dev

# Build to dist/ and run in Prod mode
npm run build
npm start
```

## Type Checking & Lint

The source is strict TypeScript in `src/`, with no `any` (enforced by ESLint).

```text
npm run typecheck
npm run lint
```

## Seed Database

```text
# Import data from _data/
npm run seed:i

# Destroy all data
npm run seed:d
```

- Version: 1.0.0
- License: MIT

## API Endpoints

Base URL: `/api/v1`

- `/academies` — list/create academies; `/academies/:id` — get/update/delete; `/academies/:id/photo` — upload photo
- `/academies/:academyId/courses` and `/academies/:academyId/reviews` — nested courses and reviews
- `/courses`, `/reviews`, `/auth`, `/users`
