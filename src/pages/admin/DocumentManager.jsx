import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, CheckCircle2, AlertCircle, Loader2, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import DocumentUploader from '../../components/admin/DocumentUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const loadDocuments = async () => {
    try {
      const res = await authFetch('/api/admin/documents');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setDocuments(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleCreateNew = () => {
    setEditingDoc({
      id: null,
      title: '',
      description: '',
      file_url: '/brochure.pdf',
      file_type: 'PDF',
      file_size: 0,
      display_order: documents.length + 1,
      status: 'published'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingDoc.title || !editingDoc.file_url) {
      setMessage({ type: 'error', text: 'Document title and file are required.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !editingDoc.id;
      const url = isNew ? '/api/admin/documents' : `/api/admin/documents/${editingDoc.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, { method, body: editingDoc });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save document');
      }

      setMessage({ type: 'success', text: `Document "${editingDoc.title}" saved successfully!` });
      setEditingDoc(null);
      loadDocuments();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/admin/documents/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Document removed.' });
        loadDocuments();
        if (refreshCMS) await refreshCMS();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error deleting document' });
    } finally {
      setDeleteId(null);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Catalogues & PDF Documents ({documents.length} Files)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload company brochures, technical specs, and ISO certificates for public download.
          </p>
        </div>

        {!editingDoc && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Message */}
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

      {/* Edit / Create Form */}
      {editingDoc ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-900">
              {editingDoc.id ? `Edit Document: ${editingDoc.title}` : 'Upload New Document'}
            </h2>
            <button
              onClick={() => setEditingDoc(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <DocumentUploader
                  label="Select PDF or Word Document"
                  value={editingDoc.file_url}
                  onChange={(url, name, size) => setEditingDoc({
                    ...editingDoc,
                    file_url: url,
                    file_size: size || editingDoc.file_size
                  })}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    placeholder="e.g. ARPRAN Complete Stone Architecture Catalogue"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Document Description
                  </label>
                  <textarea
                    rows="3"
                    value={editingDoc.description || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                    placeholder="Short description of document contents..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={editingDoc.display_order}
                      onChange={(e) => setEditingDoc({ ...editingDoc, display_order: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Publish Status
                    </label>
                    <select
                      value={editingDoc.status}
                      onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Document</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Documents List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    doc.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {doc.description || 'Downloadable PDF catalogue.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0A4E9B] hover:underline flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Preview</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingDoc(doc)}
                    className="p-1.5 text-slate-600 hover:text-[#0A4E9B] rounded-lg cursor-pointer"
                    title="Edit Document"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(doc.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to remove this document? Visitors will no longer be able to download it."
        loading={isSaving}
      />

    </div>
  );
}
