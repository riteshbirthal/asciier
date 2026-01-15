const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];

async function imageToAscii(imagePath, outputPath, width = 150) {
  let sharpInstance = null;
  
  try {
    // Create Sharp instance and get metadata
    sharpInstance = sharp(imagePath);
    const metadata = await sharpInstance.metadata();
    
    const aspectRatio = metadata.height / metadata.width;
    const height = Math.floor(width * aspectRatio * 0.55);

    // Process image with a fresh Sharp instance to avoid file handle issues
    const resized = await sharp(imagePath)
      .resize(width, height, { fit: 'fill' })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = resized;
    let asciiArt = '';

    for (let i = 0; i < info.height; i++) {
      for (let j = 0; j < info.width; j++) {
        const pixelIndex = (i * info.width + j);
        const pixelValue = data[pixelIndex];
        const charIndex = Math.floor((pixelValue / 255) * (ASCII_CHARS.length - 1));
        asciiArt += ASCII_CHARS[charIndex];
      }
      asciiArt += '\n';
    }

    // Save ASCII text to .txt file
    const txtPath = outputPath.replace('.png', '.txt');
    await fs.writeFile(txtPath, asciiArt, 'utf8');

    // Fix aspect ratio calculation for image output
    const targetWidth = Math.max(metadata.width, 1920);
    const targetHeight = Math.floor(targetWidth * aspectRatio);

    const canvas = await createAsciiImage(asciiArt, info.width, info.height, targetWidth, targetHeight);
    
    // Use fresh Sharp instance for output
    await sharp(canvas)
      .resize(targetWidth, targetHeight, { fit: 'fill' })
      .toFile(outputPath);

    // Explicitly destroy Sharp instance to release resources
    if (sharpInstance) {
      sharpInstance.destroy();
    }

    return outputPath;
  } catch (error) {
    // Clean up on error
    if (sharpInstance) {
      sharpInstance.destroy();
    }
    throw new Error(`ASCII conversion failed: ${error.message}`);
  }
}

async function createAsciiImage(asciiText, charWidth, charHeight, targetWidth = 1920, targetHeight = 1080) {
  const pixelsPerChar = targetWidth / charWidth;
  const fontSize = Math.max(6, Math.min(30, pixelsPerChar * 0.85));
  
  const charWidthPx = fontSize * 0.6;
  const charHeightPx = fontSize * 1.15;
  
  const canvasWidth = Math.ceil(charWidth * charWidthPx);
  const canvasHeight = Math.ceil(charHeight * charHeightPx);

  const svg = `
    <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <text x="0" y="${fontSize}" font-family="Consolas, 'Courier New', monospace" font-size="${fontSize}" fill="white" xml:space="preserve" letter-spacing="0">
        ${asciiText.split('\n').map((line, i) => 
          `<tspan x="0" dy="${i === 0 ? 0 : charHeightPx}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</tspan>`
        ).join('')}
      </text>
    </svg>
  `;

  return Buffer.from(svg);
}

module.exports = { imageToAscii };
