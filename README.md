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
- **Smart Cleanup**: Automatic file deletion after 30 minutes of creation
- **Extended Timeouts**: 10-minute timeout support for long video processing

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
- [Changelog](CHANGELOG.md) - Version history and updates

## File Cleanup
Generated files (images and videos) are automatically deleted **30 minutes** after creation to save disk space. Download your files before they expire!
