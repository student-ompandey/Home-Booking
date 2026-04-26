const AdminService = require("../services/adminService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Admin Controller — Dashboard and room approval endpoints.
 */

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (admin only)
const getStats = asyncHandler(async (req, res) => {
  const stats = await AdminService.getStats();
  res.status(200).json({ success: true, data: stats });
});

// @desc    Get all rooms (admin view with status filter)
// @route   GET /api/admin/rooms
// @access  Private (admin only)
const getAllRooms = asyncHandler(async (req, res) => {
  const { rooms, pagination } = await AdminService.getAllRooms(req.query);
  res.status(200).json({ success: true, count: rooms.length, pagination, data: rooms });
});

// @desc    Approve a room
// @route   PUT /api/admin/rooms/:id/approve
// @access  Private (admin only)
const approveRoom = asyncHandler(async (req, res) => {
  const room = await AdminService.approveRoom(req.params.id);
  res.status(200).json({ success: true, message: "Room approved successfully", data: room });
});

// @desc    Reject a room
// @route   PUT /api/admin/rooms/:id/reject
// @access  Private (admin only)
const rejectRoom = asyncHandler(async (req, res) => {
  const room = await AdminService.rejectRoom(req.params.id, req.body.reason);
  res.status(200).json({ success: true, message: "Room rejected", data: room });
});

// @desc    Delete a room (admin)
// @route   DELETE /api/admin/rooms/:id
// @access  Private (admin only)
const deleteRoom = asyncHandler(async (req, res) => {
  await AdminService.deleteRoom(req.params.id);
  res.status(200).json({ success: true, message: "Room deleted by admin" });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await AdminService.getAllUsers(req.query);
  res.status(200).json({ success: true, count: users.length, pagination, data: users });
});

module.exports = { getStats, getAllRooms, approveRoom, rejectRoom, deleteRoom, getAllUsers };
