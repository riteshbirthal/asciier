# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-01-14

### Added
- **Split deployment architecture** - Frontend (Vercel) + Backend (Render)
- **Environment variable configuration** for API URL
- **CORS configuration** with FRONTEND_URL environment variable
- **API configuration module** (`client/src/config.js`)
- Deployment files:
  - `render.yaml` - Render backend configuration
  - `vercel.json` - Vercel frontend configuration
  - `.env.example` - Environment variables template
  - `DEPLOY_VERCEL_RENDER.md` - Complete deployment guide
- Environment files:
  - `client/.env.development` - Local development API URL
  - `client/.env.production` - Production API URL template

### Changed
- Frontend now uses environment variables for all API calls
- Removed proxy configuration from `client/package.json`
- All components updated to import and use `API_URL` from config
- CORS now accepts specific origin from environment variable
- Backend configuration updated for cross-origin requests

### Deployment
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render with FFmpeg and persistent disk
- **Cost**: Free tier available, $7/month recommended for production

## [1.4.0] - 2026-01-14

### Removed
- **Session management system** - Simplified architecture by removing session tracking
  - Removed sessionMiddleware and session tracking logic
  - Removed session ID from all API responses
  - Removed sessionManager utility from frontend
  - No more connection close tracking

### Changed
- **File cleanup simplified to time-based only**
  - Files now auto-delete after **30 minutes** (was 60 minutes with session)
  - Removed session-based cleanup (connection close tracking)
  - Cleaner, more predictable cleanup behavior
- **Increased timeout settings for long video processing**
  - Frontend upload timeout: 10 minutes (600s)
  - Server timeout: 10 minutes (600s)
  - Keep-alive timeout: 10m 20s
  - Headers timeout: 10m 30s
  - Status polling interval increased: 3s → 5s
- **Processing status tracking improved**
  - Backend now tracks processing state (processing/completed/error)
  - Status endpoint returns detailed processing state
  - Download only available after complete processing
  - Error status properly handled and displayed
- **Request body size limit increased**
  - JSON and URL-encoded body limit: 150MB
  - Better support for large video uploads

### Fixed
- Download button now only appears after video + audio processing is fully complete
- Processing errors now properly displayed to user
- Status polling more reliable with error handling

## [1.3.0] - 2026-01-14

### Added
- **Adjustable ASCII width for videos** (60-240 characters)
  - Width slider in video upload UI
  - Default optimized for HD screens (150 characters)
  - Processing time scales with width selection
  - Labels: Faster (60), Balanced (150), High Detail (240)
- **Smart font sizing** in ASCII converter
  - Dynamic font size based on target resolution
  - Optimized for HD displays (1920x1080)
  - Better character spacing (letter-spacing: 0)
  - Improved font family (Consolas, Courier New)
  - Font size range: 6px-30px automatically calculated

### Changed
- ASCII converter default width changed from 420 to 150 characters
- Output resolution now targets minimum HD (1920x1080)
- Character height spacing reduced from 1.2x to 1.15x for better fit
- Video processing logs now include width parameter
- Improved SVG text rendering with proper XML escaping

### Fixed
- ASCII output now scales properly to screen resolution
- Better clarity on HD and 4K displays

## [1.2.0] - 2026-01-14

### Added
- **Automatic file cleanup system**
  - Time-based deletion: Files auto-delete after 60 minutes
  - Session-based cleanup: Files deleted when user closes browser/connection
  - Background scheduler runs every 60 seconds
  - Inactivity timeout: Sessions expire after 10 minutes of inactivity
- Session management middleware for tracking user sessions
- File tracking system with expiry times and session association
- Cleanup status API endpoint (`/api/cleanup/status`)
- Comprehensive FILE_CLEANUP.md documentation
- Session ID management in frontend with sessionStorage

### Changed
- Video and image routes now track files with cleanup manager
- Added session ID support across all API endpoints
- Enhanced CORS configuration to expose session headers
- Graceful shutdown handling for cleanup scheduler

## [1.1.0] - 2026-01-14

### Added
- Image to ASCII converter feature
- Mode switcher between Video and Image modes
- Adjustable ASCII width slider for images (40-200 characters)
- Side-by-side comparison view for original and ASCII images
- Image download functionality
- Support for JPEG, PNG, GIF, BMP, WebP image formats

### Fixed
- **Critical**: Fixed video not playing in browser ("No video with supported format" error)
- **Critical**: Fixed audio not playing in output videos
- Added proper FFmpeg settings for browser compatibility:
  - H.264 baseline profile with level 3.0
  - AAC audio codec with proper channel/frequency settings
  - MP4 container with `-movflags +faststart` for web streaming
  - Proper FPS output settings
- Enhanced audio extraction with stream detection using ffprobe
- Improved error logging for video processing
- Added progress tracking for FFmpeg operations

### Changed
- Updated subtitle from "videos" to "media" to reflect both video and image support
- Improved video processor with better error handling
- Enhanced logging throughout the video processing pipeline

## [1.0.0] - 2026-01-14

### Added
- Initial release
- Video to ASCII converter
- React frontend with upload interface
- Express backend with FFmpeg integration
- Frame extraction and ASCII conversion
- Audio preservation in converted videos
- Real-time processing status
- Video player with download option
- Responsive design
