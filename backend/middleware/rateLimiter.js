const rateLimit = require("express-rate-limit");

/**
 * Rate Limiting Middleware — Production Grade
 *
 * Prevents brute-force attacks and abuse by limiting
 * request rates per IP address.
 */

/** General API rate limiter — 100 requests per 15 minutes */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

/** Strict limiter for auth endpoints — 10 requests per 15 minutes */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again in 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Upload limiter — 20 uploads per hour */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Upload limit reached, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, uploadLimiter };
