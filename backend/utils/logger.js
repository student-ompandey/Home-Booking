const winston = require("winston");
const path = require("path");

/**
 * Production-ready logger using Winston.
 * - Console: colorized, human-readable (always active)
 * - File: JSON format error logs (production only)
 * - File: JSON format combined logs (production only)
 */

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    // Console output — always active
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  ],
});

// Add file transports in production
if (process.env.NODE_ENV === "production") {
  logger.add(
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    })
  );
}

module.exports = logger;
