const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const videoRoutes = require('./routes/video');
const imageRoutes = require('./routes/image');
const fileCleanupManager = require('./utils/fileCleanup');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

const uploadsDir = path.join(__dirname, '../uploads');
const outputsDir = path.join(__dirname, '../outputs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

app.use('/api/video', videoRoutes);
app.use('/api/image', imageRoutes);

app.use('/uploads', express.static(uploadsDir));
app.use('/outputs', express.static(outputsDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ASCIIer API is running' });
});

app.get('/api/cleanup/status', (req, res) => {
  const trackedFiles = fileCleanupManager.getTrackedFilesInfo();
  res.json({
    totalTrackedFiles: trackedFiles.length,
    files: trackedFiles
  });
});

fileCleanupManager.startCleanupScheduler();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`Outputs directory: ${outputsDir}`);
  console.log('File cleanup scheduler started - files expire after 30 minutes');
});

server.timeout = 600000;
server.keepAliveTimeout = 620000;
server.headersTimeout = 630000;

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  fileCleanupManager.stopCleanupScheduler();
  process.exit(0);
});
