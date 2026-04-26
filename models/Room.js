const mongoose = require("mongoose");

/**
 * Room Model — Production Grade
 *
 * Features:
 * - Full-text search on title, location, description
 * - Amenities array for filtering
 * - Availability toggle
 * - Compound indexes for common query patterns
 * - Owner reference (User)
 * - Timestamps (createdAt, updatedAt)
 */

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a room title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Cannot have more than 10 images",
      },
    },
    roomType: {
      type: String,
      required: [true, "Please provide a room type"],
      enum: {
        values: ["single", "double", "suite", "apartment", "hostel", "pg"],
        message: "Room type must be one of: single, double, suite, apartment, hostel, pg",
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ────────────────────────────────────────────────────

// Text index for full-text search across title, location, description
roomSchema.index(
  { title: "text", location: "text", description: "text" },
  { weights: { title: 10, location: 5, description: 1 } }
);

// Compound indexes for common filter+sort patterns
roomSchema.index({ location: 1, price: 1 });
roomSchema.index({ roomType: 1, price: 1 });
roomSchema.index({ owner: 1, createdAt: -1 });
roomSchema.index({ isAvailable: 1, createdAt: -1 });
roomSchema.index({ price: 1, createdAt: -1 });

module.exports = mongoose.model("Room", roomSchema);
