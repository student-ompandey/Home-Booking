const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * Auth Service — Business logic for authentication.
 * Handles registration, login, token refresh, and logout.
 */
class AuthService {
  /**
   * Register a new user.
   * @param {Object} userData - { name, email, password, role }
   * @returns {Object} - { user, accessToken, refreshToken }
   */
  static async register(userData) {
    const { email } = userData;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create(userData);

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
    });

    logger.info(`New user registered: ${user.email} (${user.role})`);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login an existing user.
   * @param {string} email
   * @param {string} password
   * @returns {Object} - { user, accessToken, refreshToken }
   */
  static async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token (supports multiple devices)
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refreshToken },
    });

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   * Implements refresh token rotation for security.
   * @param {string} refreshToken
   * @returns {Object} - { accessToken, refreshToken }
   */
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized("Refresh token is required");
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    // Find user and verify the refresh token exists in their stored tokens
    const user = await User.findById(decoded.id).select("+refreshTokens");
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      // Possible token reuse attack — invalidate all sessions
      if (user) {
        await User.findByIdAndUpdate(user._id, { refreshTokens: [] });
        logger.warn(`Possible token reuse detected for user: ${user.email}`);
      }
      throw ApiError.unauthorized("Invalid refresh token — please login again");
    }

    // Rotate: remove old refresh token, generate new pair
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: refreshToken },
    });
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout — invalidate a specific refresh token.
   * @param {string} userId
   * @param {string} refreshToken
   */
  static async logout(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
    logger.info(`User logged out: ${userId}`);
  }

  /**
   * Logout from all devices — invalidate all refresh tokens.
   * @param {string} userId
   */
  static async logoutAll(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokens: [] });
    logger.info(`User logged out from all devices: ${userId}`);
  }
}

module.exports = AuthService;
