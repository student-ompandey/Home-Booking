const AuthService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Auth Controller — Thin controller layer.
 * Delegates all business logic to AuthService.
 */

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.register(
    req.body
  );

  // Set refresh token in HTTP-only cookie
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user, accessToken },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.login(
    email,
    password
  );

  // Set refresh token in HTTP-only cookie
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user, accessToken },
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public (requires valid refresh token)
const refreshToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookie or body
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await AuthService.refreshToken(token);

  // Rotate refresh token cookie
  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken },
  });
});

// @desc    Logout user (current device)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  await AuthService.logout(req.user._id, token);

  // Clear refresh token cookie
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = asyncHandler(async (req, res) => {
  await AuthService.logoutAll(req.user._id);

  // Clear refresh token cookie
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
});

// ─── Helper: Set Refresh Token Cookie ──────────────────────────
function setRefreshTokenCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

module.exports = { register, login, refreshToken, logout, logoutAll };
