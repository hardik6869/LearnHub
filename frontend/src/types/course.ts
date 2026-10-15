import type { MinimumSkill } from "@/enums";
import type { AcademySummary } from "./academy";
import type { Id, IsoDateString } from "./common";

export interface Course {
  _id: Id;
  title: string;
  description: string;
  weeks: string;
  tuition: number;
  minimumSkill: MinimumSkill;
  /** Spelling matches the backend field */
  scholarhipsAvailable: boolean;
  createdAt: IsoDateString;
  /** An id, or the populated academy on list/detail endpoints */
  academy: Id | AcademySummary;
  user: Id;
}

export type CoursePayload = Pick<
  Course,
  "title" | "description" | "weeks" | "tuition" | "minimumSkill" | "scholarhipsAvailable"
>;
