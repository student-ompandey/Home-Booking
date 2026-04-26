const Notification = require("../models/Notification");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const logger = require("../utils/logger");

let io;

/**
 * Initialize Socket.io instance for the service.
 * Handles both notification rooms and chat rooms.
 */
const initSocket = (socketIoInstance) => {
  io = socketIoInstance;

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // ─── Notification: User joins personal room ───────────────
    socket.on("join", (userId) => {
      socket.join(userId);
      logger.info(`User ${userId} joined their notification room`);
    });

    // ─── Chat: User joins a specific chat room ────────────────
    socket.on("join_chat", (chatId) => {
      socket.join(`chat_${chatId}`);
      logger.info(`Socket ${socket.id} joined chat room: chat_${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(`chat_${chatId}`);
      logger.info(`Socket ${socket.id} left chat room: chat_${chatId}`);
    });

    // ─── Chat: Handle sending a message ───────────────────────
    socket.on("send_message", (messagePayload) => {
      // The message is already saved in the DB by the REST API.
      // We just need to broadcast it to the room.
      try {
        const { chat, receiver } = messagePayload;
        if (!chat) return;

        // Emit to everyone in the chat room EXCEPT the sender
        socket.to(`chat_${chat}`).emit("receive_message", messagePayload);
        
        // Also emit directly to the receiver's personal room so their sidebar updates
        // even if they don't have this specific chat open right now.
        if (receiver) {
          socket.to(receiver.toString()).emit("receive_message", messagePayload);
        }
      } catch (error) {
        logger.error(`Error broadcasting chat message: ${error.message}`);
      }
    });

    // ─── Chat: Typing indicators ──────────────────────────────
    socket.on("typing", ({ chatId, userName }) => {
      socket.to(`chat_${chatId}`).emit("user_typing", { chatId, userName });
    });

    socket.on("stop_typing", ({ chatId }) => {
      socket.to(`chat_${chatId}`).emit("user_stop_typing", { chatId });
    });

    // ─── Chat: Mark messages as seen ──────────────────────────
    socket.on("message_seen", async ({ chatId, userId }) => {
      try {
        // Since the API now handles DB persistence for "seen", 
        // we just broadcast the event to the other participant.
        socket.to(`chat_${chatId}`).emit("message_seen", { chatId, userId });
      } catch (error) {
        logger.error(`Error broadcasting message_seen: ${error.message}`);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};

/**
 * Create a notification in the DB and emit via Socket.io
 * @param {Object} data - { user, message, type, relatedId }
 */
const sendNotification = async (data) => {
  try {
    const notification = await Notification.create(data);

    // Emit real-time notification to the specific user's room
    if (io) {
      io.to(data.user.toString()).emit("new_notification", notification);
    }

    return notification;
  } catch (error) {
    logger.error(`Error sending notification: ${error.message}`);
  }
};

module.exports = {
  initSocket,
  sendNotification,
};
