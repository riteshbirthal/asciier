import React, { useState } from 'react';
import VideoUpload from './components/VideoUpload';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [processedVideo, setProcessedVideo] = useState(null);
  const [videoId, setVideoId] = useState(null);

  const handleVideoProcessed = (videoUrl, id) => {
    setProcessedVideo(videoUrl);
    setVideoId(id);
  };

  const handleReset = () => {
    setProcessedVideo(null);
    setVideoId(null);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🎬 ASCIIer</h1>
        <p className="subtitle">Transform your videos into ASCII art masterpieces</p>
        
        {!processedVideo ? (
          <VideoUpload onVideoProcessed={handleVideoProcessed} />
        ) : (
          <VideoPlayer 
            videoUrl={processedVideo} 
            videoId={videoId}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
