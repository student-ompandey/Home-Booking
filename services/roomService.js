const Room = require("../models/Room");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * Room Service — Business logic for room CRUD operations.
 * Supports pagination, filtering, text search, and sorting.
 */
class RoomService {
  /**
   * Get rooms with pagination, filtering, text search, and sorting.
   * @param {Object} queryParams - Validated query parameters
   * @returns {Object} - { rooms, pagination }
   */
  static async getRooms(queryParams) {
    const {
      location,
      roomType,
      minPrice,
      maxPrice,
      search,
      isAvailable,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = queryParams;

    // Build filter object
    const filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (roomType) filter.roomType = roomType;
    if (typeof isAvailable === "boolean") filter.isAvailable = isAvailable;

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Full-text search (uses MongoDB text index)
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // If text search, add relevance score sorting
    if (search) {
      sort.score = { $meta: "textScore" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with parallel count for performance
    const [rooms, total] = await Promise.all([
      Room.find(
        filter,
        search ? { score: { $meta: "textScore" } } : undefined
      )
        .populate("owner", "name email avatar")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(), // .lean() for read-only performance boost
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
   * Get a single room by ID.
   * @param {string} roomId
   * @returns {Object} room
   */
  static async getRoomById(roomId) {
    const room = await Room.findById(roomId)
      .populate("owner", "name email avatar")
      .lean();

    if (!room) {
      throw ApiError.notFound("Room not found");
    }

    return room;
  }

  /**
   * Create a new room.
   * @param {Object} roomData
   * @param {string} ownerId
   * @returns {Object} room
   */
  static async createRoom(roomData, ownerId) {
    const room = await Room.create({ ...roomData, owner: ownerId });
    logger.info(`Room created: "${room.title}" by owner ${ownerId}`);
    return room;
  }

  /**
   * Update a room (only by the owner or admin).
   * @param {string} roomId
   * @param {Object} updateData
   * @param {Object} user - { _id, role }
   * @returns {Object} room
   */
  static async updateRoom(roomId, updateData, user) {
    const room = await Room.findById(roomId);

    if (!room) {
      throw ApiError.notFound("Room not found");
    }

    // Authorization: owner or admin can update
    if (room.owner.toString() !== user._id.toString() && user.role !== "admin") {
      throw ApiError.forbidden("You can only update your own rooms");
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    }).populate("owner", "name email avatar");

    logger.info(`Room updated: "${updatedRoom.title}" (${roomId})`);
    return updatedRoom;
  }

  /**
   * Delete a room (only by the owner or admin).
   * @param {string} roomId
   * @param {Object} user - { _id, role }
   */
  static async deleteRoom(roomId, user) {
    const room = await Room.findById(roomId);

    if (!room) {
      throw ApiError.notFound("Room not found");
    }

    // Authorization: owner or admin can delete
    if (room.owner.toString() !== user._id.toString() && user.role !== "admin") {
      throw ApiError.forbidden("You can only delete your own rooms");
    }

    await Room.findByIdAndDelete(roomId);
    logger.info(`Room deleted: "${room.title}" (${roomId})`);
  }

  /**
   * Get all rooms owned by a specific user.
   * @param {string} ownerId
   * @param {number} page
   * @param {number} limit
   * @returns {Object} - { rooms, pagination }
   */
  static async getRoomsByOwner(ownerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Room.countDocuments({ owner: ownerId }),
    ]);

    return {
      rooms,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = RoomService;
