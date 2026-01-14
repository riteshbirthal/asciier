import React from 'react';
import API_URL from '../config';

function ImageViewer({ asciiImageUrl, originalImageUrl, imageId, onReset }) {
  const handleDownload = () => {
    window.location.href = `${API_URL}/api/image/download/${imageId}`;
  };

  return (
    <div className="card">
      <h2>Your ASCII Image</h2>
      
      <div className="image-comparison">
        <div className="comparison-side">
          <h3>Original</h3>
          <img 
            src={originalImageUrl} 
            alt="Original" 
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              border: '2px solid #ddd' 
            }} 
          />
        </div>
        
        <div className="comparison-side">
          <h3>ASCII Version</h3>
          <img 
            src={asciiImageUrl} 
            alt="ASCII" 
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              border: '2px solid #ddd',
              background: '#000'
            }} 
          />
        </div>
      </div>

      <div className="actions">
        <button onClick={handleDownload}>
          Download ASCII Image
        </button>
        <button onClick={onReset} style={{ background: '#6c757d' }}>
          Convert Another Image
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>✓ Image successfully converted to ASCII art</p>
        <p>✓ Click the image to view full size</p>
      </div>
    </div>
  );
}

export default ImageViewer;
