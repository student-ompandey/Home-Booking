const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../validators/userValidator");

/**
 * User Routes
 *
 * GET    /api/users/profile          — Get own profile (protected)
 * PUT    /api/users/profile          — Update own profile (protected)
 * PUT    /api/users/change-password  — Change password (protected)
 * GET    /api/users                  — Get all users (admin only)
 */

router.get("/profile", protect, getProfile);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

// Admin-only route
router.get("/", protect, authorize("admin"), getAllUsers);

module.exports = router;
