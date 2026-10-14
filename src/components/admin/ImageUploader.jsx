import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon, AlertCircle, Link, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ImageUploader({ 
  value, 
  onChange, 
  label = 'Product Image', 
  altValue = '', 
  onAltChange = null,
  titleSuggestion = '',
  recommendedSize = 'Recommended: 1200x800px (Max 10MB)'
}) {
  const [mode, setMode] = useState('upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { authFetch } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    // Check type
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP, SVG) are accepted.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
      if (onAltChange && !altValue) {
        // Auto generate descriptive alt text from file name or title
        const suggested = titleSuggestion || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        onAltChange(suggested);
      }
    } catch (err) {
      setError(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    if (onAltChange && !altValue && titleSuggestion) {
      onAltChange(titleSuggestion);
    }
    setUrlInput('');
  };

  const handleRemove = () => {
    onChange('');
    if (onAltChange) onAltChange('');
  };

  const handleAutoSuggestAlt = () => {
    if (!onAltChange) return;
    if (titleSuggestion) {
      onAltChange(titleSuggestion);
    } else if (value) {
      const filename = value.split('/').pop()?.split('?')[0] || '';
      const clean = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      if (clean) onAltChange(clean);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and size guide */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#0A4E9B]" />
          <span>{label}</span>
        </label>
        <span className="text-[11px] text-slate-400">{recommendedSize}</span>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* If an image is already set */}
      {value ? (
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative group">
            <img 
              src={value} 
              alt={altValue || 'Image preview'} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.src = '/logo.png'; }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate" title={value}>{value}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Image Ready</span>
            </p>
            
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-[#0A4E9B] hover:underline cursor-pointer"
              >
                Upload Replacement
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => {
                  setUrlInput(value);
                  setMode('url');
                  onChange('');
                }}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
              >
                Edit URL Directly
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      ) : (
        /* Image selection interface (Upload or Direct URL) */
        <div className="space-y-2">
          {/* Tabs for Upload vs URL */}
          <div className="flex items-center gap-1 border-b border-slate-200 pb-1">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                mode === 'upload' 
                  ? 'bg-blue-50 text-[#0A4E9B] font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                mode === 'url' 
                  ? 'bg-blue-50 text-[#0A4E9B] font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Enter Image URL</span>
            </button>
          </div>

          {mode === 'upload' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#0A4E9B] rounded-xl p-5 text-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/40 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#0A4E9B] animate-spin" />
                  <span className="text-xs font-semibold text-slate-600">Uploading and processing image...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-[#0A4E9B] transition">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A4E9B] transition">
                    Click to browse or drop an image here
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP, SVG up to 10MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">
                Direct Image Path or Public URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. /images/products/makrana-white.jpg or https://..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0A4E9B] font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                You can paste local paths like <code className="text-slate-600">/images/...</code> or hosted image URLs.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Alt Text (SEO & Accessibility) input */}
      {onAltChange && (
        <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Alt Text (SEO & Accessibility)</span>
              <span className="text-[10px] font-bold bg-[#0A4E9B]/10 text-[#0A4E9B] px-1.5 py-0.5 rounded">
                SEO
              </span>
            </label>
            {(titleSuggestion || value) && (
              <button
                type="button"
                onClick={handleAutoSuggestAlt}
                className="text-[11px] text-[#0A4E9B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                title="Fill alt text from title/filename"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-suggest</span>
              </button>
            )}
          </div>

          <input
            type="text"
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the image (e.g. Pristine Makrana White marble cladding on luxury facade)"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] text-slate-800"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            <span>Critical for Google Image Search rankings and screen readers</span>
            <span className={altValue.length > 125 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
              {altValue.length}/125 chars
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
