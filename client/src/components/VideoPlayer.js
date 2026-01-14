import React from 'react';
import API_URL from '../config';

function VideoPlayer({ videoUrl, videoId, onReset }) {
  const handleDownload = () => {
    window.location.href = `${API_URL}/api/video/download/${videoId}`;
  };

  return (
    <div className="card">
      <h2>Your ASCII Video</h2>
      
      <div className="video-preview">
        <video controls autoPlay>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="actions">
        <button onClick={handleDownload}>
          Download ASCII Video
        </button>
        <button onClick={onReset} style={{ background: '#6c757d' }}>
          Convert Another Video
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>✓ Video successfully converted to ASCII art</p>
        <p>✓ Original audio preserved</p>
      </div>
    </div>
  );
}

export default VideoPlayer;
