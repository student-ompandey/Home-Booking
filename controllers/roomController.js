const Room = require("../models/Room");

// @desc    Get all rooms (with optional filters)
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const { location, roomType, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (location) filter.location = { $regex: location, $options: "i" };
    if (roomType) filter.roomType = roomType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Room.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (owner only)
const createRoom = async (req, res, next) => {
  try {
    // Attach logged-in user as the owner
    req.body.owner = req.user._id;

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private (owner of the room only)
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Ensure the logged-in user is the room owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized — you can only update your own rooms",
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (owner of the room only)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Ensure the logged-in user is the room owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized — you can only delete your own rooms",
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };
