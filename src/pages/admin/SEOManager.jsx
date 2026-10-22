import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, Globe, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

export default function SEOManager() {
  const [seoList, setSeoList] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('/');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const loadSEO = async () => {
    try {
      const [res, servRes] = await Promise.all([
        authFetch('/api/admin/seo'),
        authFetch('/api/admin/services')
      ]);

      if (res && res.ok) {
        const json = await res.json();
        if (json.success) setSeoList(json.data);
      }

      if (servRes && servRes.ok) {
        const servJson = await servRes.json();
        if (servJson.success) setServices(servJson.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSEO();
  }, []);

  const activeRecord = seoList.find(s => s.page_route === selectedRoute) || {
    page_route: selectedRoute,
    meta_title: 'ARPRAN Industries | Premium Natural Stone',
    meta_description: 'Direct quarry exporter of Indian Granite, Makrana Marble & Veneers.',
    meta_keywords: 'natural stone, granite slabs, makrana marble',
    og_title: 'ARPRAN Industries | Premium Natural Stone',
    og_description: 'Direct quarry exporter of Indian Granite, Makrana Marble & Veneers.',
    og_image: '/logo.png'
  };

  const handleFieldChange = (field, val) => {
    setSeoList(prev => {
      const exists = prev.some(s => s.page_route === selectedRoute);
      if (exists) {
        return prev.map(s => s.page_route === selectedRoute ? { ...s, [field]: val } : s);
      } else {
        return [...prev, { ...activeRecord, [field]: val, page_route: selectedRoute }];
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/seo', {
        method: 'PUT',
        body: activeRecord
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save SEO configuration');
      }

      setMessage({ type: 'success', text: `SEO for route "${selectedRoute}" updated successfully!` });
      refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading SEO configurations...</div>;
  }

  const coreRoutes = [
    { route: '/', label: 'Home Page (/)' },
    { route: '/about', label: 'About Us (/about)' },
    { route: '/products', label: 'Products Catalog (/products)' },
    { route: '/finishes', label: 'Stone Finishes (/finishes)' },
    { route: '/blog', label: 'Stone Journal (/blog)' },
    { route: '/contact', label: 'Contact Us (/contact)' }
  ];

  const serviceRoutes = services.map(s => ({
    route: `/products/${s.slug}`,
    label: `${s.title} (/products/${s.slug})`
  }));

  const routes = [...coreRoutes, ...serviceRoutes];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            SEO & Social Meta Tags
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Optimize Google search previews, OpenGraph titles, meta descriptions, and keywords for all {routes.length} pages.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <a
            href="/admin/urls"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span>URLs & Slugs Directory</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Page SEO</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Route Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {routes.map(r => (
          <button
            key={r.route}
            type="button"
            onClick={() => { setSelectedRoute(r.route); setMessage({ type: '', text: '' }); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${selectedRoute === r.route
                ? 'bg-[#0A4E9B] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Form & Google SERP Preview Card */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Metadata Fields for {selectedRoute}
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Page Title (&lt;title&gt;)
            </label>
            <input
              type="text"
              required
              value={activeRecord.meta_title || ''}
              onChange={(e) => handleFieldChange('meta_title', e.target.value)}
              placeholder="Primary SEO Title"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {(activeRecord.meta_title || '').length} / 60 characters recommended
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meta Description
            </label>
            <textarea
              rows="3"
              required
              value={activeRecord.meta_description || ''}
              onChange={(e) => handleFieldChange('meta_description', e.target.value)}
              placeholder="Concise overview summarizing page content..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {(activeRecord.meta_description || '').length} / 160 characters recommended
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meta Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={activeRecord.meta_keywords || ''}
              onChange={(e) => handleFieldChange('meta_keywords', e.target.value)}
              placeholder="natural stone, granite supplier, marble exports"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              OpenGraph Preview Image URL
            </label>
            <input
              type="text"
              value={activeRecord.og_image || ''}
              onChange={(e) => handleFieldChange('og_image', e.target.value)}
              placeholder="/logo.png"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>
        </div>

        {/* Live Search Preview */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Google Search Preview
          </h2>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px]">G</span>
              <span className="truncate">https://arpranindustries.com{selectedRoute}</span>
            </div>
            <h3 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
              {activeRecord.meta_title} | ARPRAN Industries
            </h3>
            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {activeRecord.meta_description}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-[#0A3D78] space-y-1">
            <p className="font-bold">✓ Automated Dynamic Injection</p>
            <p className="text-[11px] leading-relaxed">
              When a visitor navigates to this route, our lightweight frontend SEO engine immediately mounts these exact tags to <code>&lt;head&gt;</code> and updates browser window title.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
