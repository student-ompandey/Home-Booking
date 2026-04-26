const Message = require("../models/Message");
const Chat = require("../models/Chat");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Get all messages for a specific chat
 * @route   GET /api/messages/:chatId
 * @access  Private
 */
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  // Validate that the user is a participant of this chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw ApiError.notFound("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );
  if (!isParticipant) {
    throw ApiError.forbidden("You are not a participant of this chat");
  }

  // Fetch all messages sorted by creation time (old -> new)
  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name")
    .sort({ createdAt: 1 })
    .lean();

  res.status(200).json({ success: true, data: messages });
});

/**
 * @desc    Send a new message in a chat
 * @route   POST /api/messages
 * @body    { chatId, text }
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, text } = req.body;

  if (!chatId || !text || !text.trim()) {
    throw ApiError.badRequest("Chat ID and message text are required");
  }

  // Validate chat and participant
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw ApiError.notFound("Chat not found");
  }

  const isParticipant = chat.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );
  if (!isParticipant) {
    throw ApiError.forbidden("You are not a participant of this chat");
  }

  const receiverId = chat.participants.find(
    (p) => p.toString() !== req.user._id.toString()
  );

  // Create message
  let message = await Message.create({
    chat: chatId,
    sender: req.user._id,
    receiver: receiverId,
    text: text.trim(),
  });

  // Populate sender name before returning
  message = await message.populate("sender", "name");

  // Update last message in chat model
  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: {
      text: message.text,
      sender: message.sender._id,
      createdAt: message.createdAt,
    },
  });

  res.status(201).json({ success: true, data: message });
});

/**
 * @desc    Mark a specific message as seen
 * @route   PUT /api/messages/:id/seen
 * @access  Private
 */
const markMessageSeen = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) {
    throw ApiError.notFound("Message not found");
  }

  // Ensure only the receiver can mark it as seen
  if (message.receiver.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden("You cannot mark this message as seen");
  }

  message.seen = true;
  await message.save();

  res.status(200).json({ success: true, data: message });
});

/**
 * @desc    Mark all unread messages in a chat as seen
 * @route   PUT /api/messages/chat/:chatId/seen
 * @access  Private
 */
const markChatMessagesSeen = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const result = await Message.updateMany(
    { chat: chatId, sender: { $ne: req.user._id }, seen: false },
    { seen: true }
  );

  res.status(200).json({ success: true, count: result.modifiedCount });
});

module.exports = {
  getMessages,
  sendMessage,
  markMessageSeen,
  markChatMessagesSeen,
};
