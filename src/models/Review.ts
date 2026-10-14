import mongoose, { HydratedDocument, Model, Types } from "mongoose";

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

interface AverageRatingResult {
  _id: Types.ObjectId;
  averageRating: number;
}

const ReviewSchema = new mongoose.Schema<IReview, ReviewModel>({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title or the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    required: [true, "Please add a rating between 1 to 10."],
    min: 1,
    max: 10,
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

// Prevent user from submitting more than one review per academy
ReviewSchema.index({ academy: 1, user: 1 }, { unique: true });

// Static method to get avg of rating and save
ReviewSchema.static(
  "getAverageRating",
  async function (this: ReviewModel, academyId: Types.ObjectId) {
    const obj = await this.aggregate<AverageRatingResult>([
      {
        $match: { academy: academyId },
      },
      {
        $group: {
          _id: "$academy",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    try {
      const stats = obj[0];
      // No reviews left (after a delete): clear the average instead of keeping a stale one
      await this.db.model("Academy").findByIdAndUpdate(
        academyId,
        stats
          ? { averageRating: stats.averageRating }
          : { $unset: { averageRating: 1 } },
      );
    } catch (error) {
      console.error(error);
    }
  },
);

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  void Review.getAverageRating(this.academy);
});

// Call getAverageRating after a review document is deleted
ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await Review.getAverageRating(this.academy);
  },
);

const Review = mongoose.model<IReview, ReviewModel>("Review", ReviewSchema);

export default Review;
