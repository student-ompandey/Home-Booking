const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/upload
 * @desc    Upload an image to Cloudinary
 * @access  Private
 */
router.post('/', protect, upload.single('image'), (req, res) => {
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

module.exports = router;
