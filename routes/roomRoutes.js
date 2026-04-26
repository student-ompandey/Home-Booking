const express = require("express");
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Protected routes (requires JWT)
router.post("/", protect, createRoom);
router.put("/:id", protect, updateRoom);
router.delete("/:id", protect, deleteRoom);

module.exports = router;
