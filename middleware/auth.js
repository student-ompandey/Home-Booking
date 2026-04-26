const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

/**
 * Authentication Middleware — Production Grade
 *
 * protect: Verifies JWT access token from Authorization header.
 * authorize: Restricts access to specific roles.
 */

/**
 * Protect routes — verify JWT access token.
 * Extracts token from "Authorization: Bearer <token>" header.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(ApiError.unauthorized("Not authorized — no token provided"));
  }

  try {
    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude sensitive fields)
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(ApiError.unauthorized("Not authorized — user not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token has expired — please refresh"));
    }
    return next(ApiError.unauthorized("Not authorized — invalid token"));
  }
};

/**
 * Authorize by role — restricts access to specific roles.
 * Must be used AFTER the protect middleware.
 *
 * Usage: authorize("admin", "owner")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Not authorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not authorized to access this route`
        )
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
