const multer = require("multer");
const ApiError = require("../utils/ApiError");

/**
 * Multer Upload Middleware — configured for memory storage.
 *
 * Files are held in memory as Buffer objects, which can then be
 * streamed to Cloudinary or written to local disk by the upload service.
 */

// Allowed MIME types for image uploads
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 10;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type: ${file.mimetype}. Allowed: JPEG, JPG, PNG, WebP`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

// ─── Pre-configured Upload Middleware ──────────────────────────

/** Upload multiple room images (field name: "images", max: 10) */
const uploadRoomImages = upload.array("images", MAX_FILES);

/** Upload single avatar image (field name: "avatar") */
const uploadAvatar = upload.single("avatar");

module.exports = { upload, uploadRoomImages, uploadAvatar };
