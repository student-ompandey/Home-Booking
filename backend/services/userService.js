const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * User Service — Business logic for user profile management.
 */
class UserService {
  /**
   * Get user profile by ID.
   * @param {string} userId
   * @returns {Object} user
   */
  static async getProfile(userId) {
    const user = await User.findById(userId).lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  /**
   * Update user profile.
   * @param {string} userId
   * @param {Object} updateData - { name, email, phone, avatar }
   * @returns {Object} updatedUser
   */
  static async updateProfile(userId, updateData) {
    // If email is being changed, check for duplicates
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw ApiError.conflict("Email is already in use");
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    logger.info(`Profile updated: ${user.email}`);
    return user;
  }

  /**
   * Change user password.
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw ApiError.unauthorized("Current password is incorrect");
    }

    // Update password (hashed via pre-save hook)
    user.password = newPassword;
    // Invalidate all refresh tokens on password change for security
    user.refreshTokens = [];
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);
  }

  /**
   * Get all users (admin only).
   * @param {number} page
   * @param {number} limit
   * @returns {Object} - { users, pagination }
   */
  static async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-refreshTokens")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = UserService;
