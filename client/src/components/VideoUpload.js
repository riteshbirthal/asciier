import React, { useState } from 'react';
import axios from 'axios';
import { getSessionHeaders, extractSessionId } from '../utils/sessionManager';

function VideoUpload({ onVideoProcessed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [videoId, setVideoId] = useState(null);

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

    try {
      setUploading(true);
      setError('');
      setStatus('Uploading video...');

      const response = await axios.post('/api/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getSessionHeaders()
        }
      });

      extractSessionId(response);

      const { videoId } = response.data;
      setVideoId(videoId);
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
        const response = await axios.get(`/api/video/status/${id}`, {
          headers: getSessionHeaders()
        });
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          setProcessing(false);
          setStatus('Video processed successfully!');
          setTimeout(() => {
            onVideoProcessed(`http://localhost:5000${response.data.videoUrl}`, id);
          }, 1000);
        }
      } catch (err) {
        clearInterval(interval);
        setError('Failed to check video status');
        setProcessing(false);
      }
    }, 3000);
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
        <strong>Note:</strong> Processing time depends on video length and quality.
      </div>
    </div>
  );
}

export default VideoUpload;
