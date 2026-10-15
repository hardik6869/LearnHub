import type { HydratedDocument, Model, Types } from "mongoose";
import type { MINIMUM_SKILLS } from "../config/enums";
import type { RefIds } from "./common";

// One of the values in MINIMUM_SKILLS
export type MinimumSkill = (typeof MINIMUM_SKILLS)[number];

export interface ICourse {
  title: string;
  description: string;
  weeks: string;
  tuition: number;
  minimumSkill: MinimumSkill;
  scholarhipsAvailable: boolean;
  createdAt: Date;
  academy: Types.ObjectId;
  user: Types.ObjectId;
}

export interface CourseModel extends Model<ICourse> {
  getAverageCost(academyId: Types.ObjectId): Promise<void>;
}

export type CourseDocument = HydratedDocument<ICourse>;

// Output of the getAverageCost aggregation
export interface AverageCostResult {
  _id: Types.ObjectId;
  averageCost: number;
}

// Request body for add/update; `academy` and `user` are set by the controller
export type CourseBody = Partial<Omit<ICourse, "academy" | "user">> & RefIds;
