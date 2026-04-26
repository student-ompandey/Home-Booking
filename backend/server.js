const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables FIRST — before any module reads process.env
dotenv.config();

const connectDB = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");

// Route imports
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const seedAdmin = require("./config/seedAdmin");

/**
 * ═══════════════════════════════════════════════════════════════
 *  Settel Inn — Production-Grade Server
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Initialize Express App ───────────────────────────────────
const app = express();

// ─── Connect to MongoDB + Seed Admin ─────────────────────────
connectDB().then(() => seedAdmin());

// ─── Configure Cloudinary ─────────────────────────────────────
configureCloudinary();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet()); // Security headers (XSS, HSTS, CSP, etc.)
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Rate Limiting ────────────────────────────────────────────
app.use("/api/", apiLimiter);

// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── HTTP Request Logging ─────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Colored concise output for dev
} else {
  // Production: stream Morgan logs through Winston
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ─── Static Files (for local uploads) ─────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── API Health Check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏠 Welcome to Settel Inn API",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth",
      rooms: "/api/rooms",
      users: "/api/users",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ─── Graceful Shutdown ────────────────────────────────────────
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    logger.info("HTTP server closed");
    const mongoose = require("mongoose");
    mongoose.connection.close(false).then(() => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
};

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`\n🚀 Settel Inn server running on port ${PORT}`);
  logger.info(`📍 http://localhost:${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = app;
