import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Loader2, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCat, setDeleteCat] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const fetchCategories = async () => {
    try {
      const res = await authFetch('/api/admin/categories');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setCategories(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateNew = () => {
    setEditingCategory({
      id: null,
      name: '',
      catalog_category: '',
      description: '',
      image: '/images/products/alaska_white.jpg',
      display_order: categories.length + 1,
      status: 'published'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !editingCategory.id;
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${editingCategory.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await authFetch(url, {
        method,
        body: editingCategory
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save category');
      }

      setMessage({ type: 'success', text: `Category "${editingCategory.name}" saved successfully!` });
      setEditingCategory(null);
      fetchCategories();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/admin/categories/${deleteCat.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: `Deleted "${deleteCat.name}" successfully.` });
        fetchCategories();
        if (refreshCMS) await refreshCMS();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Error deleting category' });
    } finally {
      setDeleteCat(null);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Stone Categories ({categories.length} Collections)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the primary architectural stone categories (Granite, Marble, Sandstone, Veneers, etc.)
          </p>
        </div>

        {!editingCategory && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
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

      {/* Form View */}
      {editingCategory ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-900">
              {editingCategory.id ? `Edit: ${editingCategory.name}` : 'Create New Stone Category'}
            </h2>
            <button
              onClick={() => setEditingCategory(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <ImageUploader
                  label="Category Cover Image"
                  value={editingCategory.image}
                  onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="e.g. Granite Slabs & Tiles"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Brochure Category Name (for catalog mapping)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.catalog_category || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, catalog_category: e.target.value })}
                    placeholder="e.g. Granite Series"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    URL Slug (Live Route)
                  </label>
                  <div className="flex items-center">
                    <span className="px-3.5 py-2 bg-slate-100 border border-slate-300 rounded-l-xl font-mono text-xs text-slate-500 border-r-0 select-none">
                      /products/
                    </span>
                    <input
                      type="text"
                      required
                      value={editingCategory.slug || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      placeholder="granite-series"
                      className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-r-xl font-mono font-bold text-slate-800 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Short Category Description
                  </label>
                  <textarea
                    rows="3"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    placeholder="Brief description for category cards..."
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
                      value={editingCategory.display_order}
                      onChange={(e) => setEditingCategory({ ...editingCategory, display_order: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Publish Status
                    </label>
                    <select
                      value={editingCategory.status}
                      onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value })}
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
                onClick={() => setEditingCategory(null)}
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
                <span>Save Category</span>
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={cat.image || '/logo.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/logo.png'; }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    #{cat.display_order} • {cat.status === 'published' ? '🟢 Published' : '⚪ Draft'}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-serif font-bold text-base text-slate-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {cat.description || cat.catalog_category}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[130px]">
                  Slug: {cat.slug}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-slate-600 hover:text-[#0A4E9B] hover:bg-white rounded-lg transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCat(cat)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={handleDelete}
        title={`Delete Category "${deleteCat?.name}"?`}
        message="Are you sure you want to remove this category? Products linked to this category will remain preserved."
        loading={isSaving}
      />

    </div>
  );
}
