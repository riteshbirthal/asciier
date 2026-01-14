const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { imageToAscii } = require('../utils/asciiConverter');

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

    fs.unlinkSync(inputPath);

    res.json({
      message: 'Image converted successfully',
      imageId,
      imageUrl: `/outputs/${imageId}.png`
    });

  } catch (error) {
    console.error('Image conversion error:', error);
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
