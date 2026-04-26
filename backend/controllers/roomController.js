const RoomService = require("../services/roomService");
const UploadService = require("../services/uploadService");
const { configureCloudinary } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Room Controller — Thin controller layer.
 * Delegates business logic to RoomService & UploadService.
 */

// @desc    Get all rooms (with filters, search, pagination)
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const { rooms, pagination } = await RoomService.getRooms(req.query);

  res.status(200).json({
    success: true,
    count: rooms.length,
    pagination,
    data: rooms,
  });
});

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await RoomService.getRoomById(req.params.id);

  res.status(200).json({
    success: true,
    data: room,
  });
});

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private (owner, admin)
const createRoom = asyncHandler(async (req, res) => {
  // Handle image uploads if files are present
  if (req.files && req.files.length > 0) {
    const isCloudinary = configureCloudinary();
    const imageUrls = isCloudinary
      ? await UploadService.uploadToCloudinary(req.files)
      : await UploadService.uploadToLocal(req.files);
    req.body.images = imageUrls;
  }

  const room = await RoomService.createRoom(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    data: room,
  });
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private (owner of the room, admin)
const updateRoom = asyncHandler(async (req, res) => {
  // Handle new image uploads if files are present
  if (req.files && req.files.length > 0) {
    const isCloudinary = configureCloudinary();
    const imageUrls = isCloudinary
      ? await UploadService.uploadToCloudinary(req.files)
      : await UploadService.uploadToLocal(req.files);

    // Append to existing images or replace
    req.body.images = imageUrls;
  }

  const room = await RoomService.updateRoom(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    data: room,
  });
});

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (owner of the room, admin)
const deleteRoom = asyncHandler(async (req, res) => {
  await RoomService.deleteRoom(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

// @desc    Get rooms owned by the current user
// @route   GET /api/rooms/my-rooms
// @access  Private
const getMyRooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { rooms, pagination } = await RoomService.getRoomsByOwner(
    req.user._id,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    count: rooms.length,
    pagination,
    data: rooms,
  });
});

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
};
