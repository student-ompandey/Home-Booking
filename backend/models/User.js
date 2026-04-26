const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * User Model — Production Grade
 *
 * Features:
 * - Roles: user, owner, admin
 * - Bcrypt password hashing (salt rounds: 12)
 * - Access token + refresh token generation
 * - Refresh token stored as array (supports multiple devices)
 * - Phone & avatar fields for profile management
 * - Indexed email for fast lookups
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Excluded from queries by default
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    refreshTokens: {
      type: [String],
      select: false, // Never expose refresh tokens in queries
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ─── Indexes ────────────────────────────────────────────────────
// Note: email index is auto-created by `unique: true` on the field
userSchema.index({ role: 1 });

// ─── Pre-save Hook: Hash Password ──────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance Methods ──────────────────────────────────────────

/** Compare entered password with stored hash */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/** Generate short-lived access token (default: 15m) */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "15m" }
  );
};

/** Generate long-lived refresh token (default: 7d) */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );
};

// ─── Backward Compatibility ────────────────────────────────────
/** Legacy method — maps to generateAccessToken */
userSchema.methods.generateToken = function () {
  return this.generateAccessToken();
};

module.exports = mongoose.model("User", userSchema);
