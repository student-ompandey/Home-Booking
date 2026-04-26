const Joi = require("joi");

const createReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Please provide a rating",
  }),
  comment: Joi.string().trim().max(1000).required().messages({
    "string.max": "Comment cannot exceed 1000 characters",
    "any.required": "Please provide a review comment",
  }),
  roomId: Joi.string().required().messages({
    "any.required": "Room ID is required to leave a review",
  }),
});

module.exports = {
  createReviewSchema,
};
