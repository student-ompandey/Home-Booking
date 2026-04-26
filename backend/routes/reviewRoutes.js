const express = require("express");
const { addReview, getRoomReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .post(protect, addReview);

router.route("/:roomId")
  .get(getRoomReviews);

module.exports = router;
