import type { AcademySummary } from "./academy";
import type { Id, IsoDateString } from "./common";

export interface Review {
  _id: Id;
  title: string;
  text: string;
  /** 1–10 */
  rating: number;
  createdAt: IsoDateString;
  /** An id, or the populated academy on list/detail endpoints */
  academy: Id | AcademySummary;
  user: Id;
}

export type ReviewPayload = Pick<Review, "title" | "text" | "rating">;
