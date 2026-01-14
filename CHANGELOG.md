# Changelog

All notable changes to this project will be documented in this file.

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
