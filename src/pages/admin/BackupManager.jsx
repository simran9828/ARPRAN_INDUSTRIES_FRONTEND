import React, { useState } from 'react';
import { Database, Download, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

export default function BackupManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

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

  const handleRestoreBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!window.confirm('Restore this backup? It will replace the current CMS content on this website. Download a backup of the current content first.')) return;

    setIsRestoring(true);
    setMessage({ type: '', text: '' });
    try {
      const backup = JSON.parse(await file.text());
      const res = await authFetch('/api/admin/backup/restore', {
        method: 'POST',
        body: backup
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Failed to restore database backup');
      await refreshCMS();
      setMessage({ type: 'success', text: 'Database backup restored successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof SyntaxError ? 'This file is not valid JSON.' : err.message });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          Database Backup & Data Preservation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Download a CMS snapshot or restore one after moving your website to persistent storage.
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

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900">Restore a CMS Backup</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select the JSON backup file you downloaded earlier. This replaces current CMS content.</p>
          </div>
        </div>
        <label className="inline-flex px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow items-center gap-2 cursor-pointer disabled:opacity-50">
          {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span>{isRestoring ? 'Restoring Backup...' : 'Choose Backup JSON'}</span>
          <input type="file" accept=".json,application/json" className="sr-only" disabled={isRestoring} onChange={handleRestoreBackup} />
        </label>
      </div>
    </div>
  );
}
