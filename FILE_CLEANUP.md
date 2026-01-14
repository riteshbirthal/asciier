# Automatic File Cleanup System

## Overview

ASCIIer includes an intelligent automatic file cleanup system that manages disk space by automatically deleting generated files after a specified time period or when user sessions end.

## Features

### 1. **Time-Based Cleanup (60 Minutes)**
All generated files (images and videos) are automatically deleted 60 minutes after creation.

### 2. **Session-Based Cleanup**
Files are associated with user sessions and cleaned up when:
- User closes the browser tab/window (30 seconds grace period)
- Session becomes inactive for 10+ minutes
- Connection is lost

### 3. **Background Scheduler**
A background job runs every 60 seconds to check and delete expired files automatically.

## How It Works

### Session Management

1. **Session Creation**
   - Each user is assigned a unique session ID on first request
   - Session ID is stored in browser's sessionStorage
   - Session ID is sent with all API requests via `X-Session-Id` header

2. **File Tracking**
   - All uploaded and generated files are tracked in memory
   - Each file is associated with its session ID
   - File metadata includes: creation time, expiry time, session ID

3. **Cleanup Triggers**

   **Time-Based (60 minutes)**
   ```
   File created → 60 minutes pass → Automatic deletion
   ```

   **Connection Close**
   ```
   User closes browser → 30s grace period → Delete session files
   ```

   **Inactivity (10 minutes)**
   ```
   No requests for 10 min → Session expired → Delete session files
   ```

## Architecture

### Components

#### 1. `fileCleanup.js` - File Cleanup Manager
- Tracks all generated files with metadata
- Manages cleanup scheduling (runs every 60 seconds)
- Handles file deletion and cleanup logic
- Provides status API for monitoring

**Key Methods:**
- `trackFile(filePath, sessionId, expiryMinutes)` - Register a file for tracking
- `cleanupExpiredFiles()` - Delete files past expiry time
- `cleanupSessionFiles(sessionId)` - Delete all files for a session
- `getTrackedFilesInfo()` - Get list of tracked files with status

#### 2. `sessionMiddleware.js` - Session Management
- Creates and tracks user sessions
- Monitors connection status
- Detects inactive sessions (10+ minute timeout)
- Triggers cleanup on connection close

**Features:**
- Automatic session ID generation
- Connection close detection
- Inactivity monitoring
- Grace period before cleanup (30 seconds)

#### 3. Route Integration
- Video and image routes register files with cleanup manager
- Session ID passed through entire processing pipeline
- Files tracked immediately after creation

### File Lifecycle

```
┌─────────────────┐
│ User uploads    │
│ video/image     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ File saved to   │
│ disk            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ trackFile()     │
│ called          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ File tracked    │
│ with 60min TTL  │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────────┐
│ 60 minutes      │  │ User closes      │
│ pass            │  │ connection       │
└────────┬────────┘  └────────┬─────────┘
         │                    │
         ▼                    ▼
┌─────────────────────────────┐
│ File automatically deleted  │
└─────────────────────────────┘
```

## Monitoring & Debugging

### Check Cleanup Status

**API Endpoint:**
```
GET http://localhost:5000/api/cleanup/status
```

**Response:**
```json
{
  "totalTrackedFiles": 3,
  "files": [
    {
      "file": "abc123.mp4",
      "sessionId": "xyz-789",
      "createdAt": "2026-01-14T12:30:00.000Z",
      "expiresIn": "3599s",
      "exists": true
    }
  ]
}
```

### Server Console Logs

The cleanup system provides detailed logging:

```
✓ New session created: xyz-789
✓ Tracking file: abc123.mp4 (expires in 60 minutes, session: xyz-789)
✓ Connection closed for session: xyz-789
✓ Session timeout, cleaning up: xyz-789
✓ Cleaned up 2 file(s) for session xyz-789
✓ Cleaned up 5 expired file(s)
✓ Deleted file: abc123.mp4
```

## Configuration

### Change Expiry Time

**For all files (default: 60 minutes):**
```javascript
// In routes/video.js or routes/image.js
fileCleanupManager.trackFile(outputPath, sessionId, 30); // 30 minutes
```

**For specific file types:**
```javascript
// Videos: 90 minutes
fileCleanupManager.trackFile(videoPath, sessionId, 90);

// Images: 30 minutes  
fileCleanupManager.trackFile(imagePath, sessionId, 30);
```

### Change Cleanup Interval

**In `fileCleanup.js`:**
```javascript
// Default: 60 seconds
this.cleanupInterval = setInterval(() => {
  this.cleanupExpiredFiles();
}, 30000); // Change to 30 seconds
```

### Change Inactivity Timeout

**In `sessionMiddleware.js`:**
```javascript
// Default: 10 minutes
const inactivityTimeout = 5 * 60 * 1000; // Change to 5 minutes
```

### Change Connection Close Grace Period

**In `sessionMiddleware.js`:**
```javascript
setTimeout(() => {
  // ...cleanup logic
}, 60000); // Change to 60 seconds (default: 30s)
```

## Testing

### Test Time-Based Cleanup

1. Upload a file
2. Check status: `curl http://localhost:5000/api/cleanup/status`
3. Wait 60 minutes (or modify expiry time for testing)
4. File should be automatically deleted

### Test Session Cleanup

1. Upload a file
2. Note the session ID from browser DevTools > Network > Response Headers
3. Close browser tab
4. Wait 30 seconds
5. File should be deleted

### Test Manually

```javascript
// In Node.js REPL or test script
const fileCleanupManager = require('./server/utils/fileCleanup');

// Track a test file (1 minute expiry)
fileCleanupManager.trackFile('/path/to/test.mp4', 'test-session', 1);

// Check status
console.log(fileCleanupManager.getTrackedFilesInfo());

// Manual cleanup
fileCleanupManager.cleanupSessionFiles('test-session');
```

## Production Considerations

### 1. **Disk Space Monitoring**
- Monitor disk usage regularly
- Set up alerts for low disk space
- Consider shorter expiry times for high-traffic scenarios

### 2. **Session Storage**
- Sessions are stored in memory (lost on server restart)
- Consider Redis/database for persistent session storage in production
- Implement session recovery mechanism

### 3. **File System Performance**
- Large number of files may slow down cleanup
- Consider batch deletion
- Use database to track files instead of Map for scalability

### 4. **Backup Strategy**
- Files are permanently deleted (no recovery)
- Consider archiving before deletion if needed
- Implement soft-delete with grace period

### 5. **Load Balancing**
- Session affinity required (sticky sessions)
- Or use shared session storage (Redis)
- File cleanup coordination across servers

## Security

- Session IDs are UUIDs (cryptographically secure)
- Files are isolated per session
- No cross-session file access
- Automatic cleanup prevents disk filling attacks

## Troubleshooting

### Files not deleting
1. Check server logs for cleanup messages
2. Verify cleanup scheduler started: Look for "File cleanup scheduler started"
3. Check tracked files: `GET /api/cleanup/status`
4. Ensure sufficient permissions to delete files

### Memory leaks
- Cleanup manager removes entries from tracking map on deletion
- Sessions are removed after cleanup
- Monitor memory usage: `process.memoryUsage()`

### Session persistence issues
- Check browser sessionStorage in DevTools
- Verify `X-Session-Id` header in requests
- Check CORS configuration includes `exposedHeaders`
