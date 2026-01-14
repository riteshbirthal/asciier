const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { processVideo } = require('../utils/videoProcessor');
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
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed'));
  }
});

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoId = uuidv4();
    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, '../../outputs', `${videoId}.mp4`);
    const sessionId = req.sessionId;

    fileCleanupManager.trackFile(inputPath, sessionId, 60);

    res.json({
      message: 'Video uploaded successfully',
      videoId,
      filename: req.file.filename,
      sessionId
    });

    processVideo(inputPath, outputPath, videoId, sessionId).then(() => {
      fileCleanupManager.trackFile(outputPath, sessionId, 60);
    }).catch(err => {
      console.error('Video processing error:', err);
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/status/:videoId', (req, res) => {
  const { videoId } = req.params;
  const outputPath = path.join(__dirname, '../../outputs', `${videoId}.mp4`);
  
  if (fs.existsSync(outputPath)) {
    res.json({
      status: 'completed',
      videoUrl: `/outputs/${videoId}.mp4`
    });
  } else {
    res.json({ status: 'processing' });
  }
});

router.get('/download/:videoId', (req, res) => {
  const { videoId } = req.params;
  const outputPath = path.join(__dirname, '../../outputs', `${videoId}.mp4`);
  
  if (fs.existsSync(outputPath)) {
    res.download(outputPath, `ascii_${videoId}.mp4`);
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

module.exports = router;
