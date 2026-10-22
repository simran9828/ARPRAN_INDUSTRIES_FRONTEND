import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DocumentUploader({ value, onChange, label = 'PDF / Document File' }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { authFetch } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError('Document exceeds maximum size of 50MB.');
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
        throw new Error(data.error || 'Failed to upload document');
      }

      onChange(data.url, file.name, file.size);
    } catch (err) {
      setError(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{value}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Uploaded & Accessible</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0A4E9B] hover:underline font-bold"
            >
              View
            </a>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#0A4E9B] hover:underline font-bold cursor-pointer"
            >
              Replace
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => onChange('', '', 0)}
              className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#0A4E9B] rounded-xl p-6 text-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/40 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#0A4E9B] animate-spin" />
              <span className="text-xs font-semibold text-slate-600">Uploading document...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-[#0A4E9B] transition">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A4E9B] transition">
                Upload Brochure, Certificate, or Catalogue (PDF)
              </p>
              <p className="text-[11px] text-slate-400">
                PDF, DOC, DOCX up to 50MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
