# Setup Instructions

## Prerequisites

1. **Node.js** (v16 or higher)
   - Download from https://nodejs.org/

2. **FFmpeg** (Required for video processing)
   - **Windows**: Download from https://ffmpeg.org/download.html
     - Extract the zip file
     - Add the `bin` folder to your system PATH
     - Verify: Open CMD and run `ffmpeg -version`
   
   - **Mac**: `brew install ffmpeg`
   
   - **Linux**: `sudo apt-get install ffmpeg` or `sudo yum install ffmpeg`

## Installation Steps

1. **Install backend dependencies**
   ```bash
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

   Or use the shortcut:
   ```bash
   npm run install-all
   ```

## Running the Application

### Option 1: Run both servers simultaneously
```bash
npm run dev
```

### Option 2: Run servers separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Testing

1. Open http://localhost:3000
2. Click "Choose Video File"
3. Select a video (recommended: small video < 10MB for testing)
4. Click "Convert to ASCII"
5. Wait for processing (may take 1-5 minutes depending on video length)
6. View or download the ASCII video

## Troubleshooting

### FFmpeg not found
- Ensure FFmpeg is installed and added to PATH
- Restart your terminal/IDE after adding to PATH
- Test: `ffmpeg -version`

### Port already in use
- Change PORT in `.env` file (create from `.env.example`)
- Or kill the process using the port

### Out of memory
- Reduce video size or length
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run server`

## Project Structure

```
asciier/
├── server/              # Backend (Express)
│   ├── index.js        # Main server
│   ├── routes/         # API routes
│   └── utils/          # Video processing utilities
├── client/             # Frontend (React)
│   ├── src/
│   │   ├── components/ # React components
│   │   └── App.js     # Main app
│   └── public/
├── uploads/            # Temporary uploaded videos
└── outputs/            # Processed ASCII videos
```
