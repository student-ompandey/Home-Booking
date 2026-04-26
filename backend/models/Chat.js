const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      // Optional: links this chat to a specific room listing
    },
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate chats between same two users for same room
chatSchema.index({ participants: 1, room: 1 });

module.exports = mongoose.model("Chat", chatSchema);
