const mongoose = require("mongoose");

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
    },
    roomType: {
      type: String,
      required: [true, "Please provide a room type"],
      enum: ["single", "double", "suite", "apartment", "hostel", "pg"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
roomSchema.index({ location: 1, price: 1 });
roomSchema.index({ owner: 1 });

module.exports = mongoose.model("Room", roomSchema);
