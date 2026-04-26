const Room = require("../models/Room");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

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
    const [totalUsers, totalOwners, totalRooms, pendingRooms, approvedRooms, rejectedRooms] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "owner" }),
        Room.countDocuments(),
        Room.countDocuments({ status: "pending" }),
        Room.countDocuments({ status: "approved" }),
        Room.countDocuments({ status: "rejected" }),
      ]);

    return {
      totalUsers,
      totalOwners,
      totalRooms,
      pendingRooms,
      approvedRooms,
      rejectedRooms,
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
}

module.exports = AdminService;
