import type { Career } from "@/enums";
import type { Id, IsoDateString } from "./common";
import type { Course } from "./course";

export interface Academy {
  _id: Id;
  /** Same as _id; Academy serialises its virtuals */
  id: Id;
  name: string;
  slug: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  address: string;
  careers: Career[];
  averageRating?: number;
  averageCost?: number;
  /** File name in /uploads, or a full Cloudinary URL — resolve with getPhotoUrl() */
  photo: string;
  housing: boolean;
  jobAssistance: boolean;
  jobGuarantee: boolean;
  acceptGi: boolean;
  createdAt: IsoDateString;
  user: Id;
  /** Virtual, populated by the academies list endpoint */
  courses?: Course[];
}

// The fields the API populates on a course/review's `academy`
export type AcademySummary = Pick<Academy, "_id" | "id" | "name" | "description">;

export type AcademyPayload = Pick<
  Academy,
  | "name"
  | "description"
  | "address"
  | "careers"
  | "housing"
  | "jobAssistance"
  | "jobGuarantee"
  | "acceptGi"
> &
  Partial<Pick<Academy, "website" | "phone" | "email">>;
