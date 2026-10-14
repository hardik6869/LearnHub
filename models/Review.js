const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
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
ReviewSchema.statics.getAverageRating = async function (academyId) {
  const obj = await this.aggregate([
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
    await this.model("Academy").findByIdAndUpdate(academyId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.academy);
});

// Call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.academy);
});

module.exports = mongoose.model("Review", ReviewSchema);
