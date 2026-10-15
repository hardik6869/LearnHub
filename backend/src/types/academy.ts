import type { HydratedDocument, Model, Types } from "mongoose";
import type { CAREERS } from "../config/enums";

// One of the values in CAREERS
export type Career = (typeof CAREERS)[number];

export interface IAcademy {
  name: string;
  slug?: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  address: string;
  careers: Career[];
  averageRating?: number;
  averageCost?: number;
  photo: string;
  housing: boolean;
  jobAssistance: boolean;
  jobGuarantee: boolean;
  acceptGi: boolean;
  createdAt: Date;
  user: Types.ObjectId;
}

export type AcademyModel = Model<IAcademy>;
export type AcademyDocument = HydratedDocument<IAcademy>;

// Request body for create/update; `user` is set from the logged in user
export type AcademyBody = Partial<Omit<IAcademy, "user">> & { user?: string };
