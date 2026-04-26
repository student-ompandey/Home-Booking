const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * Upload Service — Handles file uploads via Multer (local) or Cloudinary (cloud).
 */
class UploadService {
  /**
   * Upload images to Cloudinary.
   * @param {Array} files - Array of multer file objects
   * @param {string} folder - Cloudinary folder name
   * @returns {Array} - Array of image URLs
   */
  static async uploadToCloudinary(files, folder = "settelinn/rooms") {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [
              { width: 1200, height: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              logger.error(`Cloudinary upload error: ${error.message}`);
              reject(new ApiError(500, "Image upload failed"));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    logger.info(`Uploaded ${urls.length} images to Cloudinary`);
    return urls;
  }

  /**
   * Upload images to local storage (fallback when Cloudinary is not configured).
   * @param {Array} files - Array of multer file objects
   * @returns {Array} - Array of local file paths
   */
  static async uploadToLocal(files) {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadDir = path.join(process.cwd(), "uploads", "rooms");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const urls = files.map((file) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/rooms/${uniqueName}`;
    });

    logger.info(`Uploaded ${urls.length} images to local storage`);
    return urls;
  }

  /**
   * Delete image from Cloudinary by URL.
   * @param {string} imageUrl
   */
  static async deleteFromCloudinary(imageUrl) {
    try {
      // Extract public_id from URL
      const parts = imageUrl.split("/");
      const fileWithExt = parts.pop();
      const folder = parts.slice(parts.indexOf("settelinn")).join("/");
      const publicId = `${folder}/${fileWithExt.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId);
      logger.info(`Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error(`Error deleting Cloudinary image: ${error.message}`);
    }
  }
}

module.exports = UploadService;
