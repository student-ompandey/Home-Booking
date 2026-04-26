const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getChats,
  createChat,
} = require("../controllers/chatController");

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.get("/", getChats);
router.post("/", createChat);

module.exports = router;
