# ASCIIer - Video to ASCII Converter

A full-stack web application that converts regular videos into ASCII art videos while preserving the original audio.

## Features
- Upload video files (MP4, AVI, MOV, MKV)
- Converts each frame to ASCII art
- Preserves original audio
- Real-time processing progress
- Download converted ASCII video

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
