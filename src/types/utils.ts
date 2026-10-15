import type { RefIds } from "./common";

// sendEmail
export interface EmailOptions {
  to: string;
  subject: string;
  message: string;
}

// Seed documents as stored in _data/*.json (ids and refs are plain strings)
export type Seed<T> = Omit<T, "user" | "academy" | "createdAt"> &
  RefIds & { _id: string };
