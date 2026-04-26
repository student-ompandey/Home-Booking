const Joi = require("joi");

/**
 * Joi validation schemas for room endpoints.
 * Validates create, update, and query parameters.
 */

const createRoomSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),
  price: Joi.number().min(0).max(1000000).required().messages({
    "number.min": "Price cannot be negative",
    "number.max": "Price cannot exceed 1,000,000",
    "any.required": "Price is required",
  }),
  location: Joi.string().trim().min(2).max(200).required().messages({
    "string.min": "Location must be at least 2 characters",
    "any.required": "Location is required",
  }),
  description: Joi.string().trim().min(10).max(2000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  images: Joi.array().items(Joi.string().uri()).max(10).default([]).messages({
    "array.max": "Cannot upload more than 10 images",
  }),
  roomType: Joi.string()
    .valid("single", "double", "suite", "apartment", "hostel", "pg")
    .required()
    .messages({
      "any.only":
        "Room type must be one of: single, double, suite, apartment, hostel, pg",
      "any.required": "Room type is required",
    }),
  amenities: Joi.array().items(Joi.string().trim()).max(20).default([]),
  isAvailable: Joi.boolean().default(true),
});

const updateRoomSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  price: Joi.number().min(0).max(1000000),
  location: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().min(10).max(2000),
  images: Joi.array().items(Joi.string().uri()).max(10),
  roomType: Joi.string().valid(
    "single",
    "double",
    "suite",
    "apartment",
    "hostel",
    "pg"
  ),
  amenities: Joi.array().items(Joi.string().trim()).max(20),
  isAvailable: Joi.boolean(),
}).min(1); // At least one field must be provided for update

const roomQuerySchema = Joi.object({
  location: Joi.string().trim().max(200),
  roomType: Joi.string().valid(
    "single",
    "double",
    "suite",
    "apartment",
    "hostel",
    "pg"
  ),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  search: Joi.string().trim().max(100),
  isAvailable: Joi.boolean(),
  sortBy: Joi.string().valid("price", "createdAt", "title").default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

module.exports = { createRoomSchema, updateRoomSchema, roomQuerySchema };
