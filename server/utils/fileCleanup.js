const fs = require('fs');
const path = require('path');

class FileCleanupManager {
  constructor() {
    this.trackedFiles = new Map();
    this.cleanupInterval = null;
  }

  startCleanupScheduler() {
    console.log('Starting file cleanup scheduler...');
    
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredFiles();
    }, 60000);
  }

  trackFile(filePath, expiryMinutes = 30) {
    const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
    
    this.trackedFiles.set(filePath, {
      path: filePath,
      createdAt: Date.now(),
      expiryTime,
      expiryMinutes
    });

    console.log(`Tracking file: ${path.basename(filePath)} (expires in ${expiryMinutes} minutes)`);
  }

  cleanupExpiredFiles() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [filePath, fileInfo] of this.trackedFiles.entries()) {
      if (now >= fileInfo.expiryTime) {
        this.deleteFile(filePath);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired file(s)`);
    }
  }

  deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${path.basename(filePath)}`);
        this.trackedFiles.delete(filePath);
        return true;
      } else {
        this.trackedFiles.delete(filePath);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error.message);
      this.trackedFiles.delete(filePath);
      return false;
    }
  }

  getTrackedFilesInfo() {
    const files = [];
    const now = Date.now();

    for (const [filePath, fileInfo] of this.trackedFiles.entries()) {
      const timeRemaining = Math.max(0, fileInfo.expiryTime - now);
      files.push({
        file: path.basename(filePath),
        createdAt: new Date(fileInfo.createdAt).toISOString(),
        expiresIn: Math.floor(timeRemaining / 1000) + 's',
        exists: fs.existsSync(filePath)
      });
    }

    return files;
  }

  stopCleanupScheduler() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      console.log('File cleanup scheduler stopped');
    }
  }

  cleanupAll() {
    console.log('Cleaning up all tracked files...');
    let count = 0;

    for (const filePath of this.trackedFiles.keys()) {
      if (this.deleteFile(filePath)) {
        count++;
      }
    }

    console.log(`Cleaned up ${count} file(s)`);
  }
}

const fileCleanupManager = new FileCleanupManager();

module.exports = fileCleanupManager;
