# ASCIIer - Video to ASCII Converter

A full-stack web application that converts regular videos into ASCII art videos while preserving the original audio.

## Features
- **Video to ASCII**: Upload video files (MP4, AVI, MOV, MKV) with adjustable width (60-240 characters)
- **Image to ASCII**: Upload images (JPEG, PNG, GIF, BMP, WebP) with adjustable detail (40-200 characters)
- **Audio Preservation**: Original audio maintained in converted videos
- **HD Optimized**: Smart font sizing optimized for HD and 4K displays
- **Adjustable Quality**: Control processing speed vs. detail with width slider
- **Real-time Progress**: Live status updates during processing
- **Download Support**: Download converted files
- **Smart Cleanup**: Automatic file deletion after 60 minutes or on session end
- **Session Management**: Files tracked per user session

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js + Express
- **Video Processing**: FFmpeg
- **Image Processing**: Sharp

## Installation

```bash
# Install all dependencies
npm run install-all

# Run development servers
npm run dev
```

## Usage
1. Open http://localhost:3000
2. Upload a video file
3. Wait for processing
4. Download or play the ASCII video

## Requirements
- Node.js 16+
- FFmpeg installed on system

## Documentation
- [Setup Instructions](SETUP.md) - Installation and configuration guide
- [File Cleanup System](FILE_CLEANUP.md) - Automatic file management documentation
- [Changelog](CHANGELOG.md) - Version history and updates
