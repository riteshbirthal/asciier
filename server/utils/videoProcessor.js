const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { imageToAscii } = require('./asciiConverter');

async function processVideo(inputPath, outputPath, videoId) {
  const tempDir = path.join(__dirname, '../../uploads', `temp_${videoId}`);
  const framesDir = path.join(tempDir, 'frames');
  const asciiFramesDir = path.join(tempDir, 'ascii_frames');
  const audioPath = path.join(tempDir, 'audio.mp3');

  try {
    fs.mkdirSync(framesDir, { recursive: true });
    fs.mkdirSync(asciiFramesDir, { recursive: true });

    console.log(`Processing video: ${videoId}`);

    await extractAudio(inputPath, audioPath);
    await extractFrames(inputPath, framesDir);

    const frames = fs.readdirSync(framesDir).sort();
    console.log(`Converting ${frames.length} frames to ASCII...`);

    for (let i = 0; i < frames.length; i++) {
      const framePath = path.join(framesDir, frames[i]);
      const asciiFramePath = path.join(asciiFramesDir, frames[i]);
      await imageToAscii(framePath, asciiFramePath);
      
      if (i % 10 === 0) {
        console.log(`Processed ${i + 1}/${frames.length} frames`);
      }
    }

    await createVideoFromFrames(asciiFramesDir, audioPath, outputPath, inputPath);

    console.log(`Video processing completed: ${videoId}`);
    
    fs.rmSync(tempDir, { recursive: true, force: true });

  } catch (error) {
    console.error('Video processing error:', error);
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    throw error;
  }
}

function extractAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .toFormat('mp3')
      .on('end', () => resolve())
      .on('error', (err) => {
        console.warn('Audio extraction failed, video may not have audio:', err.message);
        resolve();
      })
      .save(outputPath);
  });
}

function extractFrames(inputPath, framesDir) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .fps(10)
      .on('end', () => resolve())
      .on('error', reject)
      .save(path.join(framesDir, 'frame_%04d.png'));
  });
}

function createVideoFromFrames(framesDir, audioPath, outputPath, originalVideo) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg()
      .input(path.join(framesDir, 'frame_%04d.png'))
      .inputFPS(10)
      .videoCodec('libx264')
      .outputOptions([
        '-pix_fmt yuv420p',
        '-preset fast',
        '-crf 23'
      ]);

    if (fs.existsSync(audioPath)) {
      command.input(audioPath)
        .audioCodec('aac')
        .audioBitrate('128k');
    }

    command
      .on('end', () => resolve())
      .on('error', reject)
      .save(outputPath);
  });
}

module.exports = { processVideo };
