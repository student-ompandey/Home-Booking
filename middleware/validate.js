const ApiError = require("../utils/ApiError");

/**
 * Joi Validation Middleware Factory.
 *
 * Creates an Express middleware that validates req[source] against
 * the provided Joi schema. Rejects with 400 on failure.
 *
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - Request property to validate ("body", "query", "params")
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.post("/", validate(createRoomSchema), controller.create)
 *   router.get("/", validate(querySchema, "query"), controller.list)
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Return all errors, not just the first
      stripUnknown: true, // Remove unknown fields
      convert: true, // Auto-convert types (e.g., string "5" → number 5)
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(ApiError.badRequest(message));
    }

    // Replace with validated + sanitized data
    req[source] = value;
    next();
  };
};

module.exports = validate;
