const cloudinary = require("cloudinary").v2;
const logger = require("../utils/logger");

/**
 * Configure Cloudinary for image uploads.
 * Falls back gracefully if credentials are not provided.
 */
const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn(
      "⚠️  Cloudinary credentials not configured — image uploads will use local storage"
    );
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  logger.info("☁️  Cloudinary configured successfully");
  return true;
};

module.exports = { cloudinary, configureCloudinary };
