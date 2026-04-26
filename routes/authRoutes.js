const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema } = require("../validators/authValidator");

/**
 * Auth Routes
 *
 * POST /api/auth/register       — Register new user (rate limited)
 * POST /api/auth/login          — Login user (rate limited)
 * POST /api/auth/refresh-token  — Refresh access token
 * POST /api/auth/logout         — Logout current device (protected)
 * POST /api/auth/logout-all     — Logout all devices (protected)
 */

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);

module.exports = router;
