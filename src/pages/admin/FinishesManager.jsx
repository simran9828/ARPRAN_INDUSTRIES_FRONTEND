import React, { useState, useEffect } from 'react';
import { 
  Save, CheckCircle2, AlertCircle, Loader2, Sparkles, 
  Layers, Plus, Trash2, Edit3, X, Image as ImageIcon 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function FinishesManager() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingFinish, setEditingFinish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  useEffect(() => {
    async function loadFinishesPage() {
      try {
        const res = await authFetch('/api/admin/pages/finishes');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setPageData(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load finishes page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFinishesPage();
  }, [authFetch]);

  const handleSavePage = async (updatedPageData) => {
    const dataToSave = updatedPageData || pageData;
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/pages/finishes', {
        method: 'PUT',
        body: dataToSave
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update Finishes page');
      }

      await refreshCMS();
      setMessage({ type: 'success', text: 'Surface Finishes page updated successfully! Live on website.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
        Loading Finishes page editor...
      </div>
    );
  }

  const content = pageData?.content || {};
  const header = content.header || {};
  const finishesList = content.finishes || [];

  const handleOpenAdd = () => {
    setEditingFinish({
      id: `finish_${Date.now()}`,
      title: '',
      tag: '',
      image: '/images/finish-polished.jpg',
      description: '',
      applications: ['Kitchen Countertops & Islands', 'Luxury Interior Flooring'],
      slipRating: 'Moderate slip resistance (P3 / R10)',
      durability: 'High stain and abrasion resistance'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (finish) => {
    setEditingFinish({ ...finish });
    setIsModalOpen(true);
  };

  const handleDeleteFinish = (finishId) => {
    if (!window.confirm('Are you sure you want to remove this surface finish?')) return;
    const updatedFinishes = finishesList.filter(f => f.id !== finishId);
    const updatedPage = {
      ...pageData,
      content: {
        ...content,
        finishes: updatedFinishes
      }
    };
    setPageData(updatedPage);
    handleSavePage(updatedPage);
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    if (!editingFinish.title) {
      alert('Please provide a finish title');
      return;
    }

    const index = finishesList.findIndex(f => f.id === editingFinish.id);
    let updatedFinishes;
    if (index >= 0) {
      updatedFinishes = [...finishesList];
      updatedFinishes[index] = editingFinish;
    } else {
      updatedFinishes = [...finishesList, editingFinish];
    }

    const updatedPage = {
      ...pageData,
      content: {
        ...content,
        finishes: updatedFinishes
      }
    };

    setPageData(updatedPage);
    setIsModalOpen(false);
    handleSavePage(updatedPage);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Surface Finishes & Architectural Treatments Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the finishes page banner, list of stone treatments (Polished, Flamed, Honed, Leathered, etc.), application tags, and safety ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Finish</span>
          </button>

          <button
            onClick={() => handleSavePage()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Page</span>
          </button>
        </div>
      </div>

      {/* Notification */}
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

      {/* Header Banner Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Layers className="w-4 h-4 text-[#0A4E9B]" />
          <span>Page Header Banner Settings</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Banner Main H1 Title
            </label>
            <input
              type="text"
              value={pageData.h1 || header.h1 || ''}
              onChange={(e) => {
                setPageData({
                  ...pageData,
                  h1: e.target.value,
                  content: { ...content, header: { ...header, h1: e.target.value } }
                });
              }}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Browser Meta Title
            </label>
            <input
              type="text"
              value={pageData.title || ''}
              onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Banner Subtitle / Description
          </label>
          <textarea
            rows="2"
            value={pageData.tagline || header.subtitle || ''}
            onChange={(e) => {
              setPageData({
                ...pageData,
                tagline: e.target.value,
                content: { ...content, header: { ...header, subtitle: e.target.value } }
              });
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
          />
        </div>
      </div>

      {/* Finishes List Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Architectural Surface Finishes ({finishesList.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finishesList.map((finish, idx) => (
            <div
              key={finish.id || idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img src={finish.image} alt={finish.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {finish.tag}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {finish.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {finish.description}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div><span className="font-semibold text-slate-700">Slip:</span> {finish.slipRating}</div>
                    <div className="line-clamp-1"><span className="font-semibold text-slate-700">Apps:</span> {(finish.applications || []).join(', ')}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(finish)}
                  className="px-3 py-1.5 bg-blue-50 text-[#0A4E9B] hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteFinish(finish.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Delete finish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingFinish && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {editingFinish.title ? `Edit "${editingFinish.title}"` : 'Add Surface Treatment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Finish Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFinish.title}
                    onChange={(e) => setEditingFinish({ ...editingFinish, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tag / Luster Level *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High Gloss (85° - 95°)"
                    value={editingFinish.tag}
                    onChange={(e) => setEditingFinish({ ...editingFinish, tag: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Finish Cover Photo
                </label>
                <ImageUploader
                  currentImage={editingFinish.image}
                  onImageSelected={(url) => setEditingFinish({ ...editingFinish, image: url })}
                  folder="finishes"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Technical Description
                </label>
                <textarea
                  rows="3"
                  value={editingFinish.description}
                  onChange={(e) => setEditingFinish({ ...editingFinish, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Slip Rating (AS/NZS 4586)
                  </label>
                  <input
                    type="text"
                    value={editingFinish.slipRating || ''}
                    onChange={(e) => setEditingFinish({ ...editingFinish, slipRating: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Durability / Maintenance Note
                  </label>
                  <input
                    type="text"
                    value={editingFinish.durability || ''}
                    onChange={(e) => setEditingFinish({ ...editingFinish, durability: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ideal Applications (Separate with commas)
                </label>
                <input
                  type="text"
                  placeholder="Kitchen Countertops, Bathroom Vanity, Exterior Walkways"
                  value={(editingFinish.applications || []).join(', ')}
                  onChange={(e) => {
                    const apps = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEditingFinish({ ...editingFinish, applications: apps });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow cursor-pointer"
                >
                  Save Finish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
