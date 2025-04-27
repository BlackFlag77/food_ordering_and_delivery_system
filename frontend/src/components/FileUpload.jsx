import React, { useState, useRef } from 'react';

export default function FileUpload({ onUploadComplete, currentImageUrl = '' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [error, setError] = useState('');
  const [compressionProgress, setCompressionProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Function to compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      setCompressionProgress(10);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        setCompressionProgress(30);
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          setCompressionProgress(50);
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          setCompressionProgress(80);
          
          // Compress with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setCompressionProgress(100);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError('');
    setCompressionProgress(0);

    try {
      // Compress the image
      const compressedImage = await compressImage(file);
      setPreviewUrl(compressedImage);
      
      // Use the compressed image data URL directly
      onUploadComplete(compressedImage);
      
      // Log that we're using local storage for the image
      console.log('Image uploaded and stored locally (backend unavailable)');
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again with a different image.');
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
      setCompressionProgress(100);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewUrl('');
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <div 
        className={`file-upload-area ${previewUrl ? 'has-image' : ''}`}
        onClick={handleButtonClick}
      >
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
            <button 
              className="remove-image-btn" 
              onClick={handleRemoveImage}
              type="button"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">📷</span>
            <span className="upload-text">
              {isUploading ? 'Processing image...' : 'Click to upload image'}
            </span>
            {isUploading && (
              <div className="compression-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${compressionProgress}%` }}
                ></div>
                <span className="progress-text">{compressionProgress}%</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
} 