import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Edit2, UploadCloud, CheckCircle2, AlertCircle, 
  Loader2, Image as ImageIcon, Copy, Check, Search, Filter, 
  Globe, Sparkles, X, ExternalLink, AlertTriangle, ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';

const CATEGORIES = [
  'Architecture',
  'Interiors',
  'Landscaping',
  'Finishes',
  'Factory & Quarry',
  'Slabs',
  'Veneers',
  'Monuments & Carvings',
  'Custom Projects'
];

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [altFilter, setAltFilter] = useState('all'); // 'all', 'missing_alt', 'has_alt'
  const [sortBy, setSortBy] = useState('order_asc'); // 'order_asc', 'newest', 'title_asc'

  // New item form state
  const [newItem, setNewItem] = useState({
    title: '',
    alt_text: '',
    category: 'Architecture',
    image_url: '',
    display_order: 1,
    status: 'published'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadGallery = async () => {
    try {
      const res = await authFetch('/api/admin/gallery');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setGallery(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  // Filtered & Sorted Gallery List
  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => {
      // 1. Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.alt_text && item.alt_text.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.image_url && item.image_url.toLowerCase().includes(q));

      // 2. Category filter
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // 3. Alt text filter
      const hasAlt = !!(item.alt_text && item.alt_text.trim());
      const matchAlt = altFilter === 'all' || 
        (altFilter === 'missing_alt' && !hasAlt) ||
        (altFilter === 'has_alt' && hasAlt);

      return matchSearch && matchCategory && matchAlt;
    }).sort((a, b) => {
      if (sortBy === 'order_asc') {
        return (a.display_order || 0) - (b.display_order || 0);
      }
      if (sortBy === 'newest') {
        return (b.id || 0) - (a.id || 0);
      }
      if (sortBy === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });
  }, [gallery, searchQuery, selectedCategory, altFilter, sortBy]);

  // Statistics
  const missingAltCount = useMemo(() => {
    return gallery.filter(item => !item.alt_text || !item.alt_text.trim()).length;
  }, [gallery]);

  // Handle Create (Add Image)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newItem.image_url || !newItem.title) {
      setMessage({ type: 'error', text: 'Image and title are required.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/gallery', {
        method: 'POST',
        body: {
          ...newItem,
          alt_text: newItem.alt_text || newItem.title // fallback to title if empty
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add image');
      }

      setMessage({ type: 'success', text: 'Image added to gallery successfully with SEO Alt Text!' });
      setIsAdding(false);
      setNewItem({ 
        title: '', 
        alt_text: '', 
        category: 'Architecture', 
        image_url: '', 
        display_order: (gallery.length || 0) + 1,
        status: 'published' 
      });
      loadGallery();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Edit (Update Image)
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem || !editingItem.image_url || !editingItem.title) {
      setMessage({ type: 'error', text: 'Image URL and title are required.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch(`/api/admin/gallery/${editingItem.id}`, {
        method: 'PUT',
        body: {
          title: editingItem.title,
          alt_text: editingItem.alt_text || editingItem.title,
          category: editingItem.category || 'General',
          image_url: editingItem.image_url,
          display_order: Number(editingItem.display_order) || 0,
          status: editingItem.status || 'published'
        }
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update image');
      }

      setMessage({ type: 'success', text: `Image "${editingItem.title}" updated successfully!` });
      setEditingItem(null);
      loadGallery();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/admin/gallery/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Image removed from gallery.' });
        loadGallery();
        if (refreshCMS) await refreshCMS();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete image' });
    } finally {
      setDeleteId(null);
      setIsSaving(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Media & Gallery Manager
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, add, and edit architectural stone photos with SEO Alt Text optimization.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{gallery.length} Total Images</span>
            </span>

            {missingAltCount > 0 ? (
              <button
                type="button"
                onClick={() => setAltFilter(altFilter === 'missing_alt' ? 'all' : 'missing_alt')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  altFilter === 'missing_alt'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
                title="Click to filter images missing Alt Text"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{missingAltCount} Missing Alt Text (Needs SEO)</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>100% SEO Alt Text Optimized</span>
              </span>
            )}
          </div>
        </div>

        {/* Add Image Button */}
        {!isAdding && !editingItem && (
          <button
            onClick={() => {
              setNewItem({
                title: '',
                alt_text: '',
                category: 'Architecture',
                image_url: '',
                display_order: (gallery.length || 0) + 1,
                status: 'published'
              });
              setIsAdding(true);
            }}
            className="px-5 py-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow flex items-center justify-center gap-2 self-start cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Image</span>
          </button>
        )}
      </div>

      {/* Alert / Notification Message */}
      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-2 transition ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setMessage({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          ADD NEW IMAGE FORM (MODAL / ACCORDION)
          ========================================================================= */}
      {isAdding && (
        <div className="bg-white rounded-2xl border-2 border-[#0A4E9B]/30 p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0A4E9B] flex items-center justify-center">
                <Plus className="w-4 h-4 font-bold" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Add New Image to Gallery</h2>
                <p className="text-xs text-slate-500">Upload a project photo or enter an image path with SEO metadata.</p>
              </div>
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Image Selector */}
              <div>
                <ImageUploader
                  label="Select or Upload Image"
                  value={newItem.image_url}
                  onChange={(url) => setNewItem(prev => ({ ...prev, image_url: url }))}
                  altValue={newItem.alt_text}
                  onAltChange={(alt) => setNewItem(prev => ({ ...prev, alt_text: alt }))}
                  titleSuggestion={newItem.title}
                  recommendedSize="1200x800px or higher resolution"
                />
              </div>

              {/* Right Column: Title, Alt Text, Category, Order */}
              <div className="space-y-4">
                {/* 1. Image Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewItem(prev => ({
                        ...prev,
                        title: val,
                        // If alt text is empty or matched previous title, suggest it
                        alt_text: prev.alt_text ? prev.alt_text : val
                      }));
                    }}
                    placeholder="e.g. Makrana White Marble Wall Feature"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Internal and client-facing title displayed on lightbox and image labels.
                  </p>
                </div>

                {/* 2. Alt Text (SEO & Accessibility) */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>Alt Text (SEO & Google Image Search)</span>
                      <span className="text-[10px] font-bold bg-[#0A4E9B] text-white px-1.5 py-0.2 rounded">
                        Recommended
                      </span>
                    </label>
                    {newItem.title && newItem.alt_text !== newItem.title && (
                      <button
                        type="button"
                        onClick={() => setNewItem(prev => ({ ...prev, alt_text: prev.title }))}
                        className="text-[11px] text-[#0A4E9B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Use Title</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={newItem.alt_text}
                    onChange={(e) => setNewItem(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="e.g. Polished Makrana White marble feature wall in luxury living room"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4E9B]/20 text-slate-900"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>Describes the stone texture/installation for Google search and screen readers.</span>
                    <span className={newItem.alt_text.length > 125 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                      {newItem.alt_text.length}/125 chars
                    </span>
                  </div>
                </div>

                {/* 3. Category & Display Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.display_order}
                      onChange={(e) => setNewItem(prev => ({ ...prev, display_order: Number(e.target.value) || 1 }))}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Publishing Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="published">Published (Visible on Website)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !newItem.image_url || !newItem.title}
                className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save to Gallery</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          EDIT EXISTING IMAGE MODAL
          ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Edit Gallery Image (ID: #{editingItem.id})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update the image file, title, category, display order, or SEO Alt Text.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              
              {/* Image Uploader & Preview */}
              <div>
                <ImageUploader
                  label="Image Source (Upload or Change URL)"
                  value={editingItem.image_url}
                  onChange={(url) => setEditingItem(prev => ({ ...prev, image_url: url }))}
                  altValue={editingItem.alt_text}
                  onAltChange={(alt) => setEditingItem(prev => ({ ...prev, alt_text: alt }))}
                  titleSuggestion={editingItem.title}
                  recommendedSize="Replace file or edit relative path"
                />
              </div>

              {/* Title & Alt Text Fields */}
              <div className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Makrana White Marble Wall Feature"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] text-slate-900 font-medium"
                  />
                </div>

                {/* Alt Text (SEO & Accessibility) */}
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>Alt Text (SEO & Accessibility)</span>
                      <span className="text-[10px] font-bold bg-[#0A4E9B] text-white px-1.5 py-0.2 rounded">
                        SEO
                      </span>
                    </label>

                    {editingItem.title && editingItem.alt_text !== editingItem.title && (
                      <button
                        type="button"
                        onClick={() => setEditingItem(prev => ({ ...prev, alt_text: prev.title }))}
                        className="text-[11px] text-[#0A4E9B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        title="Copy image title into alt text"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Use Title</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={editingItem.alt_text || ''}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="e.g. Polished Makrana White marble feature wall in luxury living room"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A4E9B]/20 text-slate-900"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>Helps search engines rank this image and assists screen readers.</span>
                    <span className={(editingItem.alt_text || '').length > 125 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                      {(editingItem.alt_text || '').length}/125 chars
                    </span>
                  </div>
                </div>

                {/* Category & Display Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category Tag
                    </label>
                    <select
                      value={editingItem.category || 'Architecture'}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editingItem.display_order || 1}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, display_order: Number(e.target.value) || 1 }))}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={editingItem.status || 'published'}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="published">Published (Visible on Website)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !editingItem.image_url || !editingItem.title}
                  className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          FILTER, SEARCH & SORT CONTROLS BAR
          ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, Alt text, or file path..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none text-slate-700 py-1"
            >
              <option value="all">All Categories ({gallery.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({gallery.filter(i => i.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Alt Text Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={altFilter}
              onChange={(e) => setAltFilter(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none text-slate-700 py-1"
            >
              <option value="all">All Alt Texts</option>
              <option value="has_alt">Has Alt Text ({gallery.length - missingAltCount})</option>
              <option value="missing_alt">Missing Alt Text ({missingAltCount})</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none text-slate-700 py-1"
            >
              <option value="order_asc">Sort: Display Order</option>
              <option value="newest">Sort: Newest Added</option>
              <option value="title_asc">Sort: Title A-Z</option>
            </select>
          </div>

        </div>

      </div>

      {/* =========================================================================
          GALLERY IMAGES GRID
          ========================================================================= */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Loader2 className="w-8 h-8 text-[#0A4E9B] animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading media library...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-600">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No images matched the filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all' || altFilter !== 'all'
              ? 'Try resetting your search query or filters to view all photos.'
              : 'Your media gallery is currently empty. Click "Add New Image" above to upload your first stone photo.'}
          </p>
          {(searchQuery || selectedCategory !== 'all' || altFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setAltFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGallery.map((item) => (
            <div 
              key={item.id}
              className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#0A4E9B]/50 transition-all duration-200 flex flex-col justify-between"
            >
              {/* Image Preview & Category Badge */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.alt_text || item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = '/logo.png'; }}
                  loading="lazy"
                />

                {/* Category Badge */}
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs">
                  {item.category || 'Architecture'}
                </span>

                {/* Display Order & Status Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  {item.status === 'draft' && (
                    <span className="bg-amber-500/90 backdrop-blur-md text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                      Draft
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-md text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs">
                    #{item.display_order || item.id}
                  </span>
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={item.title}>
                    {item.title}
                  </h4>
                  
                  {/* Alt Text SEO Badge */}
                  <div className="mt-1.5">
                    {item.alt_text ? (
                      <div 
                        className="p-1.5 bg-slate-50 hover:bg-blue-50/60 rounded-lg border border-slate-200/70 transition cursor-pointer"
                        onClick={() => setEditingItem(item)}
                        title="Click to edit Alt Text"
                      >
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#0A4E9B]">
                          <Globe className="w-2.5 h-2.5 shrink-0" />
                          <span>Alt Text (SEO):</span>
                        </div>
                        <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5 italic">
                          "{item.alt_text}"
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="w-full text-left p-1.5 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-amber-800 transition cursor-pointer flex items-center gap-1"
                        title="Click to add SEO Alt Text"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="text-[10px] font-bold">Missing Alt Text (Click to Add)</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono truncate mt-2" title={item.image_url}>
                    {item.image_url}
                  </p>
                </div>

                {/* Card Action Buttons (Copy URL, Edit Image, Delete) */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                  
                  {/* Copy URL */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.image_url)}
                    className="text-[11px] text-slate-600 hover:text-[#0A4E9B] hover:bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1 font-semibold transition cursor-pointer"
                    title="Copy image URL"
                  >
                    {copiedUrl === item.image_url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* EDIT IMAGE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#0A4E9B] hover:bg-blue-50 rounded-md transition flex items-center gap-1 cursor-pointer"
                      title="Edit Image, Title, or Alt Text"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Image from Gallery"
        message="Are you sure you want to permanently remove this image from the media gallery?"
        loading={isSaving}
      />

    </div>
  );
}
