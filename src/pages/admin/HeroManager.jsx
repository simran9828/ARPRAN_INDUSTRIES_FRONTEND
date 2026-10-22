import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function HeroManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null); // null = list, 'new' or slide object = form
  const [deleteId, setDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const fetchSlides = async () => {
    try {
      const res = await authFetch('/api/admin/hero');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSlides(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleCreateNew = () => {
    setEditingSlide({
      id: null,
      title: 'The World of Natural Stones',
      subtitle: 'Makrana White, Calacatta & Statuario Series',
      tag: 'Opulent White Marble Architecture',
      highlight: 'Polished Gangsaw Slabs',
      description: 'Calibrated gangsaw granite slabs, pristine Makrana marble, quartzite, sandstone, slate, natural stone veneers, and handcrafted landscaping.',
      image: '/images/hero/slide-1.jpg',
      button_text: 'Explore 12 Collections',
      button_link: '/products',
      display_order: slides.length + 1,
      status: 'published'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !editingSlide.id;
      const url = isNew ? '/api/admin/hero' : `/api/admin/hero/${editingSlide.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, {
        method,
        body: editingSlide
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save slide');
      }

      setMessage({ type: 'success', text: `Slide successfully ${isNew ? 'created' : 'updated'}!` });
      setEditingSlide(null);
      fetchSlides();
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
      const res = await authFetch(`/api/admin/hero/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Hero slide removed successfully' });
        fetchSlides();
        if (refreshCMS) await refreshCMS();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error deleting slide' });
    } finally {
      setDeleteId(null);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Homepage Hero Slides
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the prominent background architectural sliders, tags, titles, and call-to-action buttons.
          </p>
        </div>

        {!editingSlide && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        )}
      </div>

      {/* Notifications */}
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

      {/* Form View */}
      {editingSlide ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-900">
              {editingSlide.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </h2>
            <button
              onClick={() => setEditingSlide(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <ImageUploader
                  label="Hero Background Image"
                  value={editingSlide.image}
                  onChange={(url) => setEditingSlide({ ...editingSlide, image: url })}
                  recommendedSize="1920x1080px (Landscape Architecture)"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Slide Tag / Micro Badge
                  </label>
                  <input
                    type="text"
                    value={editingSlide.tag || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                    placeholder="e.g. Opulent White Marble Architecture"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    placeholder="e.g. The World of Natural Stones"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtitle / Series
                  </label>
                  <input
                    type="text"
                    value={editingSlide.subtitle || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    placeholder="e.g. Makrana White, Calacatta & Statuario Series"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Highlight Badge
                  </label>
                  <input
                    type="text"
                    value={editingSlide.highlight || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, highlight: e.target.value })}
                    placeholder="e.g. Polished Gangsaw Slabs"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                  />
                </div>
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Slide Description Text
              </label>
              <textarea
                rows="3"
                value={editingSlide.description || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                placeholder="Short architectural description..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={editingSlide.button_text || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, button_text: e.target.value })}
                  placeholder="Explore 12 Collections"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  value={editingSlide.button_link || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, button_link: e.target.value })}
                  placeholder="/products"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingSlide.display_order}
                  onChange={(e) => setEditingSlide({ ...editingSlide, display_order: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={editingSlide.status}
                  onChange={(e) => setEditingSlide({ ...editingSlide, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
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
                <span>Save Slide Changes</span>
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Slides List View */
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
              Loading hero slides...
            </div>
          ) : slides.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-500">
              No hero slides configured. Click "Add New Slide" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <div 
                  key={slide.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/logo.png'; }}
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        #{slide.display_order} • {slide.status === 'published' ? '🟢 Published' : '⚪ Draft'}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-[#0A4E9B] tracking-wider block">
                        {slide.tag || 'Slide Tag'}
                      </span>
                      <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-1">
                        {slide.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {slide.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      CTA: {slide.button_text}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="p-1.5 text-slate-600 hover:text-[#0A4E9B] hover:bg-white rounded-lg transition cursor-pointer"
                        title="Edit Slide"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(slide.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Hero Slide"
        message="Are you sure you want to delete this hero slide? It will immediately disappear from the homepage slider."
        loading={isSaving}
      />

    </div>
  );
}
