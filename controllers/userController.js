const UserService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * User Controller — Profile management endpoints.
 */

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await UserService.updateProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await UserService.changePassword(req.user._id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: "Password changed successfully — please login again",
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const { users, pagination } = await UserService.getAllUsers(page, limit);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    data: users,
  });
});

module.exports = { getProfile, updateProfile, changePassword, getAllUsers };
