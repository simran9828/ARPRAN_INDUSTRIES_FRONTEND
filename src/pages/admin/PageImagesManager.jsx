import React, { useState, useEffect } from 'react';
import {
  Images, Plus, Search, Edit2, Trash2, Eye, ExternalLink,
  Upload, Check, AlertCircle, RefreshCw, Filter, Layers, Copy, CheckCircle2, ImagePlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

const PAGE_OPTIONS = [
  { slug: 'all', label: 'All Pages' },
  { slug: 'home', label: 'Home Page' },
  { slug: 'about', label: 'About Us' },
  { slug: 'products', label: 'Products / Catalog' },
  { slug: 'finishes', label: 'Surface Finishes' },
  { slug: 'blog', label: 'Architectural Blog' },
  { slug: 'gallery', label: 'Media Gallery' },
  { slug: 'contact', label: 'Contact Us' }
];

export default function PageImagesManager() {
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [quickReplacingId, setQuickReplacingId] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    page_slug: 'home',
    section: 'Hero Slider',
    title: '',
    alt_text: '',
    image_url: '',
    caption: '',
    link_url: '',
    display_order: 0,
    status: 'published'
  });

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const url = selectedPage === 'all'
        ? '/api/admin/page-images'
        : `/api/admin/page-images?page=${selectedPage}`;

      let res = await authFetch(url);

      // If 401 or auth fails, gracefully fallback to public endpoint so images always display
      if (!res || !res.ok) {
        const publicUrl = selectedPage === 'all'
          ? '/api/public/page-images'
          : `/api/public/page-images?page=${selectedPage}`;
        res = await fetch(publicUrl);
      }

      const data = await res.json();
      if (data.success) {
        setImages(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      try {
        const res = await fetch(`/api/public/page-images${selectedPage !== 'all' ? `?page=${selectedPage}` : ''}`);
        const data = await res.json();
        if (data.success) setImages(data.data || []);
      } catch (e) {
        console.error('Public fallback error:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [selectedPage]);

  const handleOpenAdd = () => {
    setEditingImage(null);
    setFormData({
      page_slug: selectedPage === 'all' ? 'home' : selectedPage,
      section: 'Hero Slider',
      title: '',
      alt_text: '',
      image_url: '',
      caption: '',
      link_url: '',
      display_order: images.length + 1,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (img) => {
    setEditingImage(img);
    setFormData({
      page_slug: img.page_slug || 'home',
      section: img.section || 'General',
      title: img.title || '',
      alt_text: img.alt_text || '',
      image_url: img.image_url || '',
      caption: img.caption || '',
      link_url: img.link_url || '',
      display_order: img.display_order || 0,
      status: img.status || 'published'
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await authFetch('/api/admin/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.success && data.file_url) {
        setFormData(prev => ({
          ...prev,
          image_url: data.file_url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image file');
    } finally {
      setUploadProgress(false);
    }
  };

  // Quick 1-click photo replacement directly from the card
  const handleQuickReplace = async (img, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQuickReplacingId(img.id);
    const body = new FormData();
    body.append('file', file);

    try {
      setStatusMessage({ type: 'info', text: `Uploading new photo for "${img.title}"...` });
      const uploadRes = await authFetch('/api/admin/upload', {
        method: 'POST',
        body
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.file_url) {
        const updateRes = await authFetch(`/api/admin/page-images/${img.id}`, {
          method: 'PUT',
          body: {
            ...img,
            image_url: uploadData.file_url
          }
        });
        const updateData = await updateRes.json();
        if (updateData.success) {
          setStatusMessage({ type: 'success', text: `Photo replaced successfully for "${img.title}"!` });
          setTimeout(() => setStatusMessage(null), 3000);
          await fetchImages();
          if (refreshCMS) await refreshCMS();
        } else {
          setStatusMessage({ type: 'error', text: updateData.error || 'Failed to update image record' });
        }
      } else {
        setStatusMessage({ type: 'error', text: 'Upload failed' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Photo replacement failed: ' + err.message });
    } finally {
      setQuickReplacingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      alert('Please provide image Title and Image URL / File');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingImage
        ? `/api/admin/page-images/${editingImage.id}`
        : '/api/admin/page-images';
      const method = editingImage ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: formData
      });
      const result = await res.json();

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: editingImage ? 'Image details updated successfully!' : 'New image added successfully!'
        });
        setTimeout(() => setStatusMessage(null), 4000);
        setIsModalOpen(false);
        fetchImages();
        if (refreshCMS) await refreshCMS();
      } else {
        alert(result.error || 'Failed to save image');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Network error while saving image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/api/admin/page-images/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setDeleteConfirmId(null);
        setStatusMessage({ type: 'success', text: 'Image removed successfully' });
        setTimeout(() => setStatusMessage(null), 3000);
        fetchImages();
        if (refreshCMS) await refreshCMS();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = images.filter(img => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (img.title || '').toLowerCase().includes(q);
    const sectionMatch = (img.section || '').toLowerCase().includes(q);
    const altMatch = (img.alt_text || '').toLowerCase().includes(q);
    const pageMatch = (img.page_slug || '').toLowerCase().includes(q);
    return titleMatch || sectionMatch || altMatch || pageMatch;
  });

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A4E9B] text-xs font-bold uppercase tracking-wider mb-2">
            <Images className="w-3.5 h-3.5" />
            <span>Visual Content CMS</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Page Images & Media Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Har page ke according images add aur edit karein (Hero Slides, About, Products, Finishes, Blogs, Showroom & Alt Text).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchImages}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Image</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 ${statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter Tabs by Page */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PAGE_OPTIONS.map(p => {
            const isActive = selectedPage === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => setSelectedPage(p.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${isActive
                    ? 'bg-[#0A4E9B] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by image title, section (e.g. Hero Slider, Finishes), or Alt Text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4E9B]"
          />
        </div>
      </div>

      {/* Images Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0A4E9B]" />
          <p className="text-sm">Loading page images...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <Images className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No images found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {selectedPage !== 'all'
              ? `No images configured for "${selectedPage}" page yet.`
              : 'Start by clicking Add New Image.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-[#0A4E9B] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Image</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
            >
              {/* Image Preview Container */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={img.image_url}
                  alt={img.alt_text || img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                />

                {/* Clickable Hover Overlay to Edit */}
                <div
                  onClick={() => handleOpenEdit(img)}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer p-4"
                >
                  <span className="px-3.5 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition">
                    <Edit2 className="w-3.5 h-3.5 text-[#0A4E9B]" />
                    <span>Edit Image Details</span>
                  </span>
                </div>

                {/* Page Badge */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {img.page_slug?.toUpperCase()}
                  </span>
                  {img.section && (
                    <span className="px-2.5 py-1 rounded-md bg-[#0A4E9B]/90 backdrop-blur-md text-white text-[10px] font-bold">
                      {img.section}
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="absolute top-3 right-3 pointer-events-none">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${img.status === 'published'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-white'
                    }`}>
                    {img.status === 'published' ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Meta & Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-slate-900 text-sm line-clamp-1" title={img.title}>
                    {img.title}
                  </h3>

                  {/* Alt Text Highlight */}
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-[#0A4E9B] block text-[10px] uppercase tracking-wider">
                      SEO Alt Text:
                    </span>
                    <p className="line-clamp-2 italic text-slate-700">
                      "{img.alt_text || 'No alt text set'}"
                    </p>
                  </div>

                  {img.caption && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {img.caption}
                    </p>
                  )}
                </div>

                {/* Actions Bar - Clear, Prominent Edit & Replace Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Big Primary Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(img)}
                      className="flex-1 py-2 px-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      title="Edit Title, Page, Alt Text & Image URL"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Image</span>
                    </button>

                    {/* Quick 1-Click Replace Photo */}
                    <label
                      className={`py-2 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#0A4E9B] border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${quickReplacingId === img.id ? 'opacity-50 cursor-wait' : ''
                        }`}
                      title="Quickly replace photo file from device"
                    >
                      <Upload className={`w-3.5 h-3.5 ${quickReplacingId === img.id ? 'animate-bounce' : ''}`} />
                      <span>{quickReplacingId === img.id ? 'Saving...' : 'Replace'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={quickReplacingId === img.id}
                        onChange={(e) => handleQuickReplace(img, e)}
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => handleCopyUrl(img.image_url, img.id)}
                      className="p-1.5 text-slate-500 hover:text-[#0A4E9B] hover:bg-blue-50 rounded-lg transition flex items-center gap-1 text-[11px]"
                      title="Copy URL"
                    >
                      {copiedId === img.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(img.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 text-[11px]"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A4E9B] bg-blue-50 px-2 py-0.5 rounded">
                  {editingImage ? `Editing Image #${editingImage.id}` : 'Create New Image'}
                </span>
                <h2 className="text-lg font-serif font-bold text-slate-900 mt-1">
                  {editingImage ? `Edit Image Details` : 'Add New Page Image'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Page & Section Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Page *
                  </label>
                  <select
                    value={formData.page_slug}
                    onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  >
                    <option value="home">Home Page (/)</option>
                    <option value="about">About Us (/about)</option>
                    <option value="products">Products / Catalog (/products)</option>
                    <option value="finishes">Surface Finishes (/finishes)</option>
                    <option value="blog">Architectural Blog (/blog)</option>
                    <option value="gallery">Media Gallery (/gallery)</option>
                    <option value="contact">Contact Us (/contact)</option>
                    <option value="global">Global Shared Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Section / Category *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hero Slider, Finishes, Factory"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image Title / Heading *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opulent White Marble Pavilion"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                />
              </div>

              {/* Image URL or Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Image Source *
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="/images/hero/slide-1.jpg or upload below"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  />

                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadProgress ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.image_url && (
                  <div className="mt-2 rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200 relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">
                      Live Preview
                    </span>
                  </div>
                )}
              </div>

              {/* SEO Alt Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SEO Alt Text (Google Image Ranking) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Polished Makrana Calcite & Bookmatched Calacatta Marble Grand Pavilion"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Descriptive Alt Text improves search accessibility and ranking on Google Images.
                </span>
              </div>

              {/* Caption & Link URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Caption / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="Short description"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Link URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /products or /contact"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  />
                </div>
              </div>

              {/* Display Order & Status */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : editingImage ? 'Update Image' : 'Save Image'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Delete Image?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this image from the page image manager?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
