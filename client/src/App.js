import React, { useState } from 'react';
import VideoUpload from './components/VideoUpload';
import VideoPlayer from './components/VideoPlayer';
import ImageUpload from './components/ImageUpload';
import ImageViewer from './components/ImageViewer';

function App() {
  const [mode, setMode] = useState('image');
  const [processedVideo, setProcessedVideo] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [asciiImage, setAsciiImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [imageId, setImageId] = useState(null);

  const handleVideoProcessed = (videoUrl, id) => {
    setProcessedVideo(videoUrl);
    setVideoId(id);
  };

  const handleImageConverted = (asciiUrl, id, originalUrl) => {
    setAsciiImage(asciiUrl);
    setImageId(id);
    setOriginalImage(originalUrl);
  };

  const handleReset = () => {
    setProcessedVideo(null);
    setVideoId(null);
    setAsciiImage(null);
    setImageId(null);
    setOriginalImage(null);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    handleReset();
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🎬 ASCIIer</h1>
        <p className="subtitle">Transform your media into ASCII art masterpieces</p>
        
        <div className="mode-selector">
          <button 
            className={`mode-button ${mode === 'image' ? 'active' : ''}`}
            onClick={() => handleModeChange('image')}
          >
            🖼️ Image Mode
          </button>
          <button 
            className={`mode-button ${mode === 'video' ? 'active' : ''}`}
            onClick={() => handleModeChange('video')}
          >
            📹 Video Mode
          </button>
        </div>

        {mode === 'video' ? (
          !processedVideo ? (
            <VideoUpload onVideoProcessed={handleVideoProcessed} />
          ) : (
            <VideoPlayer 
              videoUrl={processedVideo} 
              videoId={videoId}
              onReset={handleReset}
            />
          )
        ) : (
          !asciiImage ? (
            <ImageUpload onImageConverted={handleImageConverted} />
          ) : (
            <ImageViewer 
              asciiImageUrl={asciiImage}
              originalImageUrl={originalImage}
              imageId={imageId}
              onReset={handleReset}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;
