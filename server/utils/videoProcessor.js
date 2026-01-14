const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { imageToAscii } = require('./asciiConverter');

async function processVideo(inputPath, outputPath, videoId, sessionId = null) {
  const tempDir = path.join(__dirname, '../../uploads', `temp_${videoId}`);
  const framesDir = path.join(tempDir, 'frames');
  const asciiFramesDir = path.join(tempDir, 'ascii_frames');
  const audioPath = path.join(tempDir, 'audio.mp3');

  try {
    fs.mkdirSync(framesDir, { recursive: true });
    fs.mkdirSync(asciiFramesDir, { recursive: true });

    console.log(`Processing video: ${videoId} (session: ${sessionId || 'none'})`);

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
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.warn('FFprobe failed:', err.message);
        return resolve();
      }

      const hasAudio = metadata.streams.some(stream => stream.codec_type === 'audio');
      
      if (!hasAudio) {
        console.log('No audio stream found in input video');
        return resolve();
      }

      console.log('Extracting audio...');
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .toFormat('mp3')
        .on('end', () => {
          console.log('Audio extraction completed');
          resolve();
        })
        .on('error', (err) => {
          console.warn('Audio extraction failed:', err.message);
          resolve();
        })
        .save(outputPath);
    });
  });
}

function extractFrames(inputPath, framesDir) {
  return new Promise((resolve, reject) => {
    console.log('Extracting frames...');
    ffmpeg(inputPath)
      .outputOptions([
        '-vf fps=10'
      ])
      .on('end', () => {
        console.log('Frame extraction completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Frame extraction error:', err.message);
        reject(err);
      })
      .save(path.join(framesDir, 'frame_%04d.png'));
  });
}

function createVideoFromFrames(framesDir, audioPath, outputPath, originalVideo) {
  return new Promise((resolve, reject) => {
    const hasAudio = fs.existsSync(audioPath) && fs.statSync(audioPath).size > 0;
    
    console.log(`Creating video from frames... Audio available: ${hasAudio}`);
    
    const command = ffmpeg()
      .input(path.join(framesDir, 'frame_%04d.png'))
      .inputFPS(10)
      .videoCodec('libx264')
      .fps(10)
      .outputOptions([
        '-pix_fmt yuv420p',
        '-preset medium',
        '-crf 23',
        '-movflags +faststart',
        '-profile:v baseline',
        '-level 3.0'
      ]);

    if (hasAudio) {
      command
        .input(audioPath)
        .audioCodec('aac')
        .audioBitrate('128k')
        .audioChannels(2)
        .audioFrequency(44100);
    } else {
      console.log('No audio track found, creating video without audio');
    }

    command
      .toFormat('mp4')
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${Math.floor(progress.percent)}% done`);
        }
      })
      .on('end', () => {
        console.log('Video creation completed');
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        console.error('FFmpeg error:', err.message);
        console.error('FFmpeg stderr:', stderr);
        reject(err);
      })
      .save(outputPath);
  });
}

module.exports = { processVideo };
