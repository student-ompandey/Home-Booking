const logger = require("../utils/logger");

/**
 * Global Error Handling Middleware — Production Grade
 *
 * Handles all errors thrown in the application:
 * - Operational errors (ApiError) — expected, user-facing
 * - Mongoose errors — validation, duplicate key, cast
 * - JWT errors — invalid/expired tokens
 * - Unexpected errors — logged with stack trace
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  const isOperational = err.isOperational || false;

  // ─── Mongoose: Bad ObjectId ─────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─── Mongoose: Duplicate Key ────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value entered for: ${field}`;
  }

  // ─── Mongoose: Validation Error ─────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // ─── JWT: Invalid Token ─────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // ─── JWT: Expired Token ─────────────────────────────────────
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  // ─── Multer: File Upload Errors ─────────────────────────────
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size exceeds the 5MB limit";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Unexpected file field";
  }

  // ─── Logging ────────────────────────────────────────────────
  if (statusCode >= 500) {
    // Log unexpected errors with full stack
    logger.error(`${statusCode} — ${message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    // Log client errors at warn level
    logger.warn(`${statusCode} — ${message} [${req.method} ${req.originalUrl}]`);
  }

  // ─── Response ───────────────────────────────────────────────
  const response = {
    success: false,
    message,
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  // Include error code for client-side handling
  if (err.code) {
    response.code = err.code;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
