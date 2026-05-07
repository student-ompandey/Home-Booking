const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/upload
 * @desc    Upload an image to Cloudinary
 * @access  Private
 */
router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Cloudinary Upload Error:", err);
      return res.status(500).json({ 
        success: false, 
        message: 'Upload failed: ' + err.message,
        error: err
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.path, // Cloudinary secure URL
      },
    });
  });
});

module.exports = router;
