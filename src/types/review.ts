import type { HydratedDocument, Model, Types } from "mongoose";
import type { RefIds } from "./common";

export interface IReview {
  title: string;
  text: string;
  rating: number;
  createdAt: Date;
  academy: Types.ObjectId;
  user: Types.ObjectId;
}

export interface ReviewModel extends Model<IReview> {
  getAverageRating(academyId: Types.ObjectId): Promise<void>;
}

export type ReviewDocument = HydratedDocument<IReview>;

// Output of the getAverageRating aggregation
export interface AverageRatingResult {
  _id: Types.ObjectId;
  averageRating: number;
}

// Request body for add/update; `academy` and `user` are set by the controller
export type ReviewBody = Partial<Omit<IReview, "academy" | "user">> & RefIds;
