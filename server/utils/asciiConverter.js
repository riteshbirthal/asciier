const sharp = require('sharp');

const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];

async function imageToAscii(imagePath, outputPath, width = 120) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    const aspectRatio = metadata.height / metadata.width;
    const height = Math.floor(width * aspectRatio * 0.55);

    const resized = await image
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

    const canvas = await createAsciiImage(asciiArt, info.width, info.height);
    await sharp(canvas)
      .resize(metadata.width, metadata.height, { fit: 'fill' })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    throw new Error(`ASCII conversion failed: ${error.message}`);
  }
}

async function createAsciiImage(asciiText, charWidth, charHeight) {
  const fontSize = 10;
  const charWidthPx = fontSize * 0.6;
  const charHeightPx = fontSize * 1.2;
  
  const canvasWidth = Math.ceil(charWidth * charWidthPx);
  const canvasHeight = Math.ceil(charHeight * charHeightPx);

  const svg = `
    <svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="black"/>
      <text x="0" y="${fontSize}" font-family="monospace" font-size="${fontSize}" fill="white" xml:space="preserve">
        ${asciiText.split('\n').map((line, i) => 
          `<tspan x="0" dy="${i === 0 ? 0 : charHeightPx}">${line}</tspan>`
        ).join('')}
      </text>
    </svg>
  `;

  return Buffer.from(svg);
}

module.exports = { imageToAscii };
