const Room = require("../models/Room");
const User = require("../models/User");
const Booking = require("../models/Booking");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");
const { sendNotification } = require("./notificationService");

/**
 * Admin Service — Business logic for admin dashboard operations.
 * Handles room approval/rejection, stats, and user management.
 */
class AdminService {
  /**
   * Get dashboard statistics.
   * @returns {Object} stats
   */
  static async getStats() {
    const [totalUsers, totalOwners, totalRooms, pendingRooms, approvedRooms, rejectedRooms, totalBookings] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "owner" }),
        Room.countDocuments(),
        Room.countDocuments({ status: "pending" }),
        Room.countDocuments({ status: "approved" }),
        Room.countDocuments({ status: "rejected" }),
        Booking.countDocuments(),
      ]);

    return {
      totalUsers,
      totalOwners,
      totalRooms,
      pendingRooms,
      approvedRooms,
      rejectedRooms,
      totalBookings,
    };
  }

  /**
   * Get analytics data for charts
   * @returns {Object} analytics
   */
  static async getAnalytics() {
    // 1. Monthly User Growth (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Monthly Room Uploads (Last 6 months)
    const roomUploads = await Room.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Room Type Distribution
    const roomTypes = await Room.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      userGrowth: userGrowth.map((item) => ({ month: item._id, users: item.count })),
      roomUploads: roomUploads.map((item) => ({ month: item._id, rooms: item.count })),
      roomTypes: roomTypes.map((item) => ({ name: item._id, value: item.count })),
    };
  }

  /**
   * Get all rooms for admin with optional status filter.
   * @param {Object} queryParams - { status, page, limit }
   * @returns {Object} - { rooms, pagination }
   */
  static async getAllRooms(queryParams) {
    const { status, page = 1, limit = 20 } = queryParams;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate("owner", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Room.countDocuments(filter),
    ]);

    return {
      rooms,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
        hasNext: Number(page) < Math.ceil(total / Number(limit)),
        hasPrev: Number(page) > 1,
      },
    };
  }

  /**
   * Approve a room listing.
   * @param {string} roomId
   * @returns {Object} room
   */
  static async approveRoom(roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw ApiError.notFound("Room not found");

    room.status = "approved";
    room.adminNote = null;
    await room.save();

    // Notify the room owner
    await sendNotification({
      user: room.owner,
      message: `Your room "${room.title}" has been approved and is now public!`,
      type: "room_approved",
      relatedId: room._id,
    });

    logger.info(`Room approved: "${room.title}" (${roomId})`);
    return room;
  }

  /**
   * Reject a room listing with optional reason.
   * @param {string} roomId
   * @param {string} reason
   * @returns {Object} room
   */
  static async rejectRoom(roomId, reason = null) {
    const room = await Room.findById(roomId);
    if (!room) throw ApiError.notFound("Room not found");

    room.status = "rejected";
    room.adminNote = reason;
    await room.save();

    // Notify the room owner
    await sendNotification({
      user: room.owner,
      message: `Your room "${room.title}" was rejected. Reason: ${reason || "Not provided"}`,
      type: "room_rejected",
      relatedId: room._id,
    });

    logger.info(`Room rejected: "${room.title}" (${roomId}) — ${reason || "No reason"}`);
    return room;
  }

  /**
   * Delete a room (admin force delete).
   * @param {string} roomId
   */
  static async deleteRoom(roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw ApiError.notFound("Room not found");

    await Room.findByIdAndDelete(roomId);
    logger.info(`Room deleted by admin: "${room.title}" (${roomId})`);
  }

  /**
   * Get all users for admin.
   * @param {Object} queryParams - { role, page, limit }
   * @returns {Object} - { users, pagination }
   */
  static async getAllUsers(queryParams) {
    const { role, page = 1, limit = 20 } = queryParams;

    const filter = {};
    if (role) filter.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Toggle user active status (block/unblock)
   * @param {string} userId
   * @returns {Object} user
   */
  static async toggleUserStatus(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    if (user.role === "admin") throw ApiError.forbidden("Cannot block another admin");

    user.isActive = !user.isActive;
    await user.save();

    logger.info(`User status toggled: "${user.email}" (${userId}) -> active: ${user.isActive}`);
    return user;
  }
}

module.exports = AdminService;
