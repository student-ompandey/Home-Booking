const Joi = require("joi");

/**
 * Joi validation schemas for user profile endpoints.
 */

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().trim().lowercase().email().messages({
    "string.email": "Please provide a valid email",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^[+]?[\d\s-]{7,15}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  avatar: Joi.string().uri().allow("", null),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "New password must be at least 6 characters",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "New password is required",
    }),
});

module.exports = { updateProfileSchema, changePasswordSchema };
