const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllRooms,
  approveRoom,
  rejectRoom,
  deleteRoom,
  getAllUsers,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

/**
 * Admin Routes — All routes require admin role.
 *
 * GET    /api/admin/stats              — Dashboard statistics
 * GET    /api/admin/rooms              — All rooms (with status filter)
 * PUT    /api/admin/rooms/:id/approve  — Approve a room
 * PUT    /api/admin/rooms/:id/reject   — Reject a room
 * DELETE /api/admin/rooms/:id          — Delete a room
 * GET    /api/admin/users              — All users
 */

// All admin routes are protected + admin-only
router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/rooms", getAllRooms);
router.put("/rooms/:id/approve", approveRoom);
router.put("/rooms/:id/reject", rejectRoom);
router.delete("/rooms/:id", deleteRoom);
router.get("/users", getAllUsers);

module.exports = router;
