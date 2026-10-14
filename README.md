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
# Run in Dev mode
npm run dev

# Run in Prod mode
npm start
```

- Version: 1.0.0
- License: MIT

## API Endpoints

Base URL: `/api/v1`

- `/academies` — list/create academies; `/academies/:id` — get/update/delete; `/academies/:id/photo` — upload photo
- `/academies/:academyId/courses` and `/academies/:academyId/reviews` — nested courses and reviews
- `/courses`, `/reviews`, `/auth`, `/users`
