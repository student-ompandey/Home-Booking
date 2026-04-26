const mongoose = require("mongoose");
const Room = require("./Room");

/**
 * Review Model
 * Stores individual user reviews for rooms and automatically
 * calculates and updates the average rating on the Room document.
 */

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Please provide a review comment"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only leave one review per room
reviewSchema.index({ room: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function (roomId) {
  const stats = await this.aggregate([
    {
      $match: { room: roomId },
    },
    {
      $group: {
        _id: "$room",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Room.findByIdAndUpdate(roomId, {
      numReviews: stats[0].nRating,
      averageRating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
    });
  } else {
    // If no reviews left
    await Room.findByIdAndUpdate(roomId, {
      numReviews: 0,
      averageRating: 0,
    });
  }
};

// Call calcAverageRatings after saving a review
reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.room);
});

// Call calcAverageRatings after removing a review (e.g., findOneAndDelete)
// Mongoose 9 requires post hook for findOneAndDelete
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.room);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
