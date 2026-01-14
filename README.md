# ASCIIer - Video to ASCII Converter

A full-stack web application that converts regular videos into ASCII art videos while preserving the original audio.

## Features
- **Video to ASCII**: Upload video files (MP4, AVI, MOV, MKV) and convert to ASCII art
- **Image to ASCII**: Upload images (JPEG, PNG, GIF, BMP, WebP) with adjustable detail
- **Audio Preservation**: Original audio maintained in converted videos
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
