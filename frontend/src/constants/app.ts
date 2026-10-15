import { env } from "@/config";

export const APP_NAME = env.appName;

export const APP_DESCRIPTION = "Find and compare academies, courses and reviews.";

// Grid-friendly page size (divides into 1, 2, 3 and 4 columns); the API default is 25
export const DEFAULT_PAGE_SIZE = 12;

// How long fetched data counts as fresh before React Query refetches it
export const STALE_TIME_MS = 60_000;

export const SEARCH_DEBOUNCE_MS = 300;
