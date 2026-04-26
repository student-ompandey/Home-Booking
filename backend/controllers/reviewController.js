const Review = require("../models/Review");
const Room = require("../models/Room");
const { createReviewSchema } = require("../validators/reviewValidator");
const ApiError = require("../utils/ApiError");
const { sendNotification } = require("../services/notificationService");

/**
 * @desc    Add a review
 * @route   POST /api/reviews
 * @access  Private
 */
const addReview = async (req, res, next) => {
  try {
    const { error } = createReviewSchema.validate(req.body);
    if (error) {
      throw ApiError.badRequest(error.details[0].message);
    }

    const { roomId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if room exists and is approved
    const room = await Room.findById(roomId);
    if (!room) {
      throw ApiError.notFound("Room not found");
    }
    if (room.status !== "approved") {
      throw ApiError.badRequest("You can only review approved rooms");
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ room: roomId, user: userId });
    if (existingReview) {
      throw ApiError.badRequest("You have already reviewed this room");
    }

    const review = await Review.create({
      user: req.user._id,
      room: roomId,
      rating,
      comment,
    });

    // Populate user info for the response
    await review.populate("user", "name");

    // Notify the room owner
    if (room.owner.toString() !== req.user._id.toString()) {
      await sendNotification({
        user: room.owner,
        message: `${req.user.name} left a ${rating}-star review on your room "${room.title}".`,
        type: "new_review",
        relatedId: room._id,
      });
    }

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all reviews for a room
 * @route   GET /api/reviews/:roomId
 * @access  Public
 */
const getRoomReviews = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { room: roomId };

    const reviews = await Review.find(query)
      .populate({
        path: "user",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addReview,
  getRoomReviews,
};
