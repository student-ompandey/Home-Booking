const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Get all chats for the logged-in user
 * @route   GET /api/chats
 * @access  Private
 */
const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate("participants", "name email role")
    .populate("room", "title images")
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: chats });
});

/**
 * @desc    Create or get existing chat between current user and a room owner
 * @route   POST /api/chats
 * @body    { ownerId, roomId }
 * @access  Private
 */
const createChat = asyncHandler(async (req, res) => {
  const { ownerId, roomId } = req.body;
  const userId = req.user._id;

  if (!ownerId) {
    throw ApiError.badRequest("ownerId is required");
  }

  // Prevent chatting with yourself
  if (ownerId === userId.toString()) {
    throw ApiError.badRequest("You cannot chat with yourself");
  }

  // Check if a chat already exists between these two users for this room
  const query = {
    participants: { $all: [userId, ownerId] },
  };
  if (roomId) query.room = roomId;

  let chat = await Chat.findOne(query);

  if (!chat) {
    const chatData = {
      participants: [userId, ownerId],
    };
    if (roomId) chatData.room = roomId;
    chat = await Chat.create(chatData);
  }

  // Populate for the response
  chat = await Chat.findById(chat._id)
    .populate("participants", "name email role")
    .populate("room", "title images");

  res.status(200).json({ success: true, data: chat });
});



module.exports = {
  getChats,
  createChat,
};
