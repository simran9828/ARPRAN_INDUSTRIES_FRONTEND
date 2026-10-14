import React, { useState } from 'react';
import { Database, Download, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BackupManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();

  const handleExportBackup = async () => {
    setIsExporting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/backup/export');
      if (!res.ok) throw new Error('Failed to generate database export');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arpran_cms_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Database backup downloaded successfully to your computer!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          Database Backup & Data Preservation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Export full JSON snapshots of your products, categories, hero slides, documents, and website settings.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900">
              Complete Structured Database Snapshot
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Includes 250+ products, 12 categories, hero slides, About page, SEO, and contact data.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          Clicking the button below will immediately package all relational tables from your SQLite database into a standardized JSON file and trigger a local download.
        </p>

        <button
          onClick={handleExportBackup}
          disabled={isExporting}
          className="px-6 py-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Backup Snapshot...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Database Backup (.json)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
