import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function SocialManager() {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSocial, setEditingSocial] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const loadSocials = async () => {
    try {
      const res = await authFetch('/api/admin/social');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSocials(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocials();
  }, []);

  const handleCreateNew = () => {
    setEditingSocial({
      id: null,
      platform: 'Instagram',
      url: 'https://instagram.com/',
      display_order: socials.length + 1,
      status: 'published'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingSocial.platform || !editingSocial.url) {
      setMessage({ type: 'error', text: 'Platform and URL are required.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !editingSocial.id;
      const url = isNew ? '/api/admin/social' : `/api/admin/social/${editingSocial.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, { method, body: editingSocial });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save social link');
      }

      setMessage({ type: 'success', text: 'Social media link saved!' });
      setEditingSocial(null);
      loadSocials();
      refreshCMS();
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
      const res = await authFetch(`/api/admin/social/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Social link removed.' });
        loadSocials();
        refreshCMS();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error deleting social link' });
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
            Social Media Channels ({socials.length} Platforms)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage links to Instagram, LinkedIn, Facebook, YouTube, and WhatsApp for the website footer.
          </p>
        </div>

        {!editingSocial && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Link</span>
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

      {/* Form */}
      {editingSocial ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-900">
              {editingSocial.id ? `Edit ${editingSocial.platform} Link` : 'Add Social Platform'}
            </h2>
            <button
              onClick={() => setEditingSocial(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSocial.platform}
                  onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                  placeholder="e.g. Instagram, LinkedIn, YouTube"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Profile / Channel URL
                </label>
                <input
                  type="url"
                  required
                  value={editingSocial.url}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingSocial.display_order}
                  onChange={(e) => setEditingSocial({ ...editingSocial, display_order: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={editingSocial.status}
                  onChange={(e) => setEditingSocial({ ...editingSocial, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                >
                  <option value="published">Active / Published</option>
                  <option value="draft">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSocial(null)}
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
                <span>Save Social Link</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Social Links List */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          {socials.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">{s.platform}</span>
                  <a 
                    href={s.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-slate-500 hover:text-[#0A4E9B] hover:underline flex items-center gap-1"
                  >
                    <span className="truncate max-w-xs">{s.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  s.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {s.status === 'published' ? 'Active' : 'Inactive'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingSocial(s)}
                    className="p-1.5 text-slate-600 hover:text-[#0A4E9B] rounded-lg cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg cursor-pointer"
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
        title="Remove Social Media Link"
        message="Are you sure you want to remove this social link from the website?"
        loading={isSaving}
      />

    </div>
  );
}
