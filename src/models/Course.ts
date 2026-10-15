import mongoose, { type Types } from "mongoose";
import { MINIMUM_SKILLS } from "../config/enums";
import type { AverageCostResult, CourseModel, ICourse } from "../types";

const CourseSchema = new mongoose.Schema<ICourse, CourseModel>({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tution cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: MINIMUM_SKILLS,
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  academy: {
    type: mongoose.Schema.ObjectId,
    ref: "Academy",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Static method to get avg of course tutions
CourseSchema.static(
  "getAverageCost",
  async function (this: CourseModel, academyId: Types.ObjectId) {
    const obj = await this.aggregate<AverageCostResult>([
      {
        $match: { academy: academyId },
      },
      {
        $group: {
          _id: "$academy",
          averageCost: { $avg: "$tuition" },
        },
      },
    ]);
    try {
      const stats = obj[0];
      // No courses left (after a delete): clear the average instead of keeping a stale one
      await this.db
        .model("Academy")
        .findByIdAndUpdate(
          academyId,
          stats
            ? { averageCost: Math.ceil(stats.averageCost / 10) * 10 }
            : { $unset: { averageCost: 1 } },
        );
    } catch (error) {
      console.error(error);
    }
  },
);

// Call getAverageCost after save
CourseSchema.post("save", function () {
  void Course.getAverageCost(this.academy);
});

// Call getAverageCost after a course document is deleted
CourseSchema.post("deleteOne", { document: true, query: false }, async function () {
  await Course.getAverageCost(this.academy);
});

const Course = mongoose.model<ICourse, CourseModel>("Course", CourseSchema);

export default Course;
