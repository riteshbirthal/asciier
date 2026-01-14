const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { imageToAscii } = require('../utils/asciiConverter');
const fileCleanupManager = require('../utils/fileCleanup');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageId = uuidv4();
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, '../../outputs', `${imageId}.png`);
    const width = parseInt(req.body.width) || 120;

    await imageToAscii(inputPath, outputPath, width);

    fileCleanupManager.trackFile(outputPath, 30);

    // Delete input file asynchronously with delay to avoid Windows file lock issues
    setTimeout(() => {
      fs.unlink(inputPath, (err) => {
        if (err) {
          console.warn(`Could not delete input file ${inputPath}:`, err.message);
          // Track for cleanup if immediate delete fails
          fileCleanupManager.trackFile(inputPath, 5);
        } else {
          console.log(`Deleted input file: ${path.basename(inputPath)}`);
        }
      });
    }, 1000);

    res.json({
      message: 'Image converted successfully',
      imageId,
      imageUrl: `/outputs/${imageId}.png`
    });

  } catch (error) {
    console.error('Image conversion error:', error);
    
    // Clean up input file on error
    if (req.file && req.file.path) {
      setTimeout(() => {
        fs.unlink(req.file.path, (err) => {
          if (err) console.warn('Could not delete file on error:', err.message);
        });
      }, 1000);
    }
    
    res.status(500).json({ error: error.message });
  }
});

router.get('/download/:imageId', (req, res) => {
  const { imageId } = req.params;
  const outputPath = path.join(__dirname, '../../outputs', `${imageId}.png`);
  
  if (fs.existsSync(outputPath)) {
    res.download(outputPath, `ascii_${imageId}.png`);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

module.exports = router;
