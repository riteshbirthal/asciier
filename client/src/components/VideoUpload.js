import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

function VideoUpload({ onVideoProcessed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [width, setWidth] = useState(240);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('width', width);

    try {
      setUploading(true);
      setError('');
      setStatus('Uploading video...');

      const response = await axios.post(`${API_URL}/api/video/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 600000
      });

      const { videoId } = response.data;
      setUploading(false);
      setProcessing(true);
      setStatus('Processing video... This may take a few minutes.');

      pollVideoStatus(videoId);

    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setUploading(false);
      setProcessing(false);
    }
  };

  const pollVideoStatus = async (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/api/video/status/${id}`, {
          timeout: 30000
        });
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          setProcessing(false);
          setStatus('Video processed successfully! Download available.');
          setTimeout(() => {
            onVideoProcessed(`${API_URL}${response.data.videoUrl}`, id);
          }, 1000);
        } else if (response.data.status === 'error') {
          clearInterval(interval);
          setError(response.data.error || 'Processing failed');
          setProcessing(false);
        }
      } catch (err) {
        clearInterval(interval);
        setError('Failed to check video status');
        setProcessing(false);
      }
    }, 5000);
  };

  return (
    <div className="card">
      <h2>Upload Your Video</h2>
      
      <div style={{ marginTop: '20px' }}>
        <input
          type="file"
          id="video-input"
          accept="video/mp4,video/avi,video/mov,video/mkv,video/webm"
          onChange={handleFileSelect}
        />
        <label htmlFor="video-input" className="file-input-label">
          Choose Video File
        </label>
        
        {selectedFile && (
          <div className="file-info">
            <strong>Selected:</strong> {selectedFile.name} 
            ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="width-slider-video" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          ASCII Width: {width} characters
        </label>
        <input
          id="width-slider-video"
          type="range"
          min="60"
          max="420"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          style={{ width: '100%' }}
          disabled={uploading || processing}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
          <span>Faster (60)</span>
          <span>Balanced (240)</span>
          <span>High Detail (420)</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
          💡 Higher width = more detail but slower processing. 240 is optimized for HD screens.
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || uploading || processing}
        >
          {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Convert to ASCII'}
        </button>
      </div>

      {(uploading || processing) && <div className="loader"></div>}

      {status && (
        <div className={`status ${processing ? 'processing' : 'completed'}`}>
          {status}
        </div>
      )}

      {error && (
        <div className="status error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <strong>Supported formats:</strong> MP4, AVI, MOV, MKV, WebM<br/>
        <strong>Max file size:</strong> 100MB<br/>
        <strong>Processing time:</strong> Depends on video length, quality, and ASCII width<br/>
        <strong>Tip:</strong> Start with 150 width for best balance of quality and speed
      </div>
    </div>
  );
}

export default VideoUpload;
