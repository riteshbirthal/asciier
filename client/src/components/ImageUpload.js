import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload({ onImageConverted }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');
  const [width, setWidth] = useState(120);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('width', width);

    try {
      setConverting(true);
      setError('');

      const response = await axios.post('/api/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      });

      const { imageId, imageUrl } = response.data;
      setConverting(false);
      onImageConverted(`http://localhost:5000${imageUrl}`, imageId, preview);

    } catch (err) {
      setError(err.response?.data?.error || 'Conversion failed');
      setConverting(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Your Image</h2>
      
      <div style={{ marginTop: '20px' }}>
        <input
          type="file"
          id="image-input"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
          onChange={handleFileSelect}
        />
        <label htmlFor="image-input" className="file-input-label">
          Choose Image File
        </label>
        
        {selectedFile && (
          <div className="file-info">
            <strong>Selected:</strong> {selectedFile.name} 
            ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
        )}
      </div>

      {preview && (
        <div className="image-preview">
          <h3>Original Image:</h3>
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }} />
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="width-slider" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          ASCII Width: {width} characters
        </label>
        <input
          id="width-slider"
          type="range"
          min="40"
          max="200"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
          <span>Low Detail (40)</span>
          <span>High Detail (200)</span>
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={handleConvert}
          disabled={!selectedFile || converting}
        >
          {converting ? 'Converting...' : 'Convert to ASCII'}
        </button>
      </div>

      {converting && <div className="loader"></div>}

      {error && (
        <div className="status error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <strong>Supported formats:</strong> JPEG, PNG, GIF, BMP, WebP<br/>
        <strong>Max file size:</strong> 10MB<br/>
        <strong>Tip:</strong> Higher width values provide more detail but larger output files.
      </div>
    </div>
  );
}

export default ImageUpload;
