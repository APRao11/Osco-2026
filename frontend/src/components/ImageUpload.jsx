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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[#2F2924]">
          {label} <span className="text-[#6B4632]">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowSamples(!showSamples)}
          className="text-xs text-[#6B4632] hover:text-[#8A6248] flex items-center gap-1 font-medium underline underline-offset-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showSamples ? 'Hide craft samples' : 'Pick from sample craft photos'}
        </button>
      </div>

      {showSamples && (
        <div className="p-3 bg-[#EFE4D3]/70 rounded-lg border border-[#D8C7B2]">
          <p className="text-xs text-[#756A60] mb-2 font-medium">
            Click a sample craft photo to use it for your listing:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SAMPLE_COASTAL_IMAGES.map((sample, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  onImageChange(sample.url);
                  setShowSamples(false);
                }}
                className="group relative rounded-md overflow-hidden border border-[#D8C7B2] hover:border-[#6B4632] aspect-square transition-all"
                title={sample.name}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute inset-x-0 bottom-0 bg-[#2F2924]/80 text-[10px] text-white py-0.5 px-1 truncate block text-center">
                  {sample.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {currentImage ? (
        <div className="relative rounded-xl overflow-hidden border border-[#D8C7B2] bg-[#FFF9F0] group shadow-xs">
          <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-[#EFE4D3]/40">
            <img
              src={currentImage}
              alt="Craft preview"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="absolute inset-0 bg-[#2F2924]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#FFF9F0] text-[#6B4632] hover:bg-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Replace Photo
            </button>
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="bg-red-800 text-white hover:bg-red-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>

          <div className="p-2.5 bg-[#FFF9F0] border-t border-[#D8C7B2] flex items-center justify-between text-xs text-[#756A60]">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#6B4632]" />
              Image selected & ready
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#6B4632] hover:underline font-medium"
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#6B4632] bg-[#EFE4D3]'
              : 'border-[#D8C7B2] hover:border-[#8A6248] bg-[#FFF9F0]/70 hover:bg-[#FFF9F0]'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#EFE4D3] text-[#6B4632] flex items-center justify-center mx-auto mb-3 border border-[#D8C7B2]">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-[#2F2924]">
            Click to upload an image from your device
          </p>
          <p className="text-xs text-[#756A60] mt-1">
            or drag and drop your photo here (JPG, PNG, WEBP)
          </p>
          <div className="mt-3 inline-flex items-center text-xs font-medium text-[#6B4632] bg-[#EFE4D3]/60 px-2.5 py-1 rounded-md border border-[#D8C7B2]/70">
            Clear natural lighting & craft detail view recommended
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
