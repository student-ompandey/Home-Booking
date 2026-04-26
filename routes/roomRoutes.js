const express = require("express");
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
} = require("../controllers/roomController");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { uploadRoomImages } = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimiter");
const {
  createRoomSchema,
  updateRoomSchema,
  roomQuerySchema,
} = require("../validators/roomValidator");

/**
 * Room Routes
 *
 * GET    /api/rooms          — Get all rooms (public, filtered, paginated)
 * GET    /api/rooms/my-rooms — Get rooms owned by current user (protected)
 * GET    /api/rooms/:id      — Get single room (public)
 * POST   /api/rooms          — Create room (protected: owner, admin)
 * PUT    /api/rooms/:id      — Update room (protected: owner of room, admin)
 * DELETE /api/rooms/:id      — Delete room (protected: owner of room, admin)
 */

// Public routes
router.get("/", validate(roomQuerySchema, "query"), getRooms);

// Protected routes — must be above /:id to avoid route conflict
router.get("/my-rooms", protect, getMyRooms);

// Public route
router.get("/:id", getRoomById);

// Protected routes with file upload
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  uploadLimiter,
  uploadRoomImages,
  validate(createRoomSchema),
  createRoom
);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  uploadRoomImages,
  validate(updateRoomSchema),
  updateRoom
);

router.delete("/:id", protect, authorize("owner", "admin"), deleteRoom);

module.exports = router;
