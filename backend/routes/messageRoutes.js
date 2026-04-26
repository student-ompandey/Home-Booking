const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getMessages,
  sendMessage,
  markMessageSeen,
  markChatMessagesSeen,
} = require("../controllers/messageController");

const router = express.Router();

router.use(protect);

router.get("/:chatId", getMessages);
router.post("/", sendMessage);
router.put("/:id/seen", markMessageSeen);
router.put("/chat/:chatId/seen", markChatMessagesSeen);

module.exports = router;
