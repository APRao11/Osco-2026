import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, X, Sparkles } from 'lucide-react';

const SAMPLE_COASTAL_IMAGES = [
  {
    name: 'Woven Basket',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Carved Coconut Bowl',
    url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Shell Chime',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bamboo Ware',
    url: 'https://images.unsplash.com/photo-1584282479905-24231bfaeb05?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Coastal Pottery',
    url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jute Macramé',
    url: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
  },
];

export function ImageUpload({
  currentImage,
  onImageChange,
  label = 'Product Image',
}) {
  const fileInputRef = useRef(null);
  const [showSamples, setShowSamples] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="artisan-image-upload">
      <div className="artisan-section-heading-row">
        <label className="artisan-label artisan-label-large">
          {label} <span className="artisan-required-mark">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowSamples(!showSamples)}
          className="artisan-text-button"
        >
          <Sparkles className="artisan-icon" />
          {showSamples ? 'Hide craft samples' : 'Pick from sample craft photos'}
        </button>
      </div>

      {showSamples && (
        <div className="artisan-sample-panel">
          <p className="artisan-muted artisan-small-text">
            Click a sample craft photo to use it for your listing:
          </p>
          <div className="artisan-sample-grid">
            {SAMPLE_COASTAL_IMAGES.map((sample, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  onImageChange(sample.url);
                  setShowSamples(false);
                }}
                className="artisan-sample-tile"
                title={sample.name}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="artisan-sample-image"
                />
                <span className="artisan-sample-caption">
                  {sample.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentImage ? (
        <div className="artisan-image-preview">
          <div className="artisan-image-preview-frame">
            <img
              src={currentImage}
              alt="Craft preview"
              className="artisan-image-preview-photo"
            />
          </div>

          <div className="artisan-image-overlay">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="artisan-button artisan-button-light"
            >
              <RefreshCw className="artisan-icon" />
              Replace Photo
            </button>
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="artisan-button artisan-button-danger"
            >
              <X className="artisan-icon" />
              Remove
            </button>
          </div>

          <div className="artisan-image-status">
            <span>
              <ImageIcon className="artisan-icon" />
              Image selected & ready
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="artisan-inline-link"
            >
              Choose another
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`artisan-dropzone ${isDragging ? 'is-dragging' : ''}`}
        >
          <div className="artisan-upload-icon">
            <Upload className="artisan-icon artisan-icon-large" />
          </div>
          <p className="artisan-dropzone-title">
            Click to upload an image from your device
          </p>
          <p className="artisan-muted artisan-small-text">
            or drag and drop your photo here (JPG, PNG, WEBP)
          </p>
          <div className="artisan-upload-hint">
            Clear natural lighting & craft detail view recommended
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="artisan-visually-hidden"
      />
    </div>
  );
}
