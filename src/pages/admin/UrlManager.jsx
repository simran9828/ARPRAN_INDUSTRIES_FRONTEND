import React, { useState, useEffect } from 'react';
import {
  Globe, Link2, ExternalLink, Copy, Check, Plus, Trash2,
  Edit3, ArrowRight, Search, ShieldCheck, CheckCircle2,
  AlertCircle, Loader2, Save, FileText, CornerDownRight, RefreshCw, X,
  Sparkles, SlidersHorizontal, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

export default function UrlManager() {
  const [activeTab, setActiveTab] = useState('directory');
  const [redirects, setRedirects] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [copiedUrl, setCopiedUrl] = useState('');

  // Edit Page URL & SEO Modal State
  const [editingPage, setEditingPage] = useState(null);
  // Structure:
  // {
  //   title,
  //   scope,
  //   originalPath,
  //   currentPath,
  //   metaTitle,
  //   metaDescription,
  //   metaKeywords,
  //   canonicalUrl,
  //   createRedirect: true
  // }

  // Form for New/Editing Redirect Rule
  const [editingRedirect, setEditingRedirect] = useState(null);
  const [newRedirect, setNewRedirect] = useState({
    source_path: '',
    target_url: '',
    redirect_type: 301,
    notes: '',
    status: 'active'
  });

  const { authFetch } = useAuth();
  const { cms, refreshCMS } = useCMS();

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [redirRes, settRes, servRes, seoRes] = await Promise.all([
        authFetch('/api/admin/redirects'),
        authFetch('/api/admin/settings'),
        authFetch('/api/admin/services'),
        authFetch('/api/admin/seo')
      ]);

      if (redirRes && redirRes.ok) {
        const redirJson = await redirRes.json();
        if (redirJson.success) setRedirects(redirJson.data || []);
      }

      if (settRes && settRes.ok) {
        const settJson = await settRes.json();
        if (settJson.success) setSettings(settJson.data || {});
      }

      if (servRes && servRes.ok) {
        const servJson = await servRes.json();
        if (servJson.success) setServices(servJson.data || []);
      }

      if (seoRes && seoRes.ok) {
        const seoJson = await seoRes.json();
        if (seoJson.success) setSeoList(seoJson.data || []);
      }
    } catch (err) {
      console.error('Failed to load URL & SEO manager data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (path) => {
    const fullUrl = `${window.location.origin}${path.startsWith('http') ? '' : ''}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(path);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  // Open Edit URL & SEO Modal
  const handleOpenEditPage = (item) => {
    setEditingPage({
      title: item.title,
      scope: item.type,
      originalPath: item.path,
      currentPath: item.path,
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || '',
      metaKeywords: item.metaKeywords || '',
      canonicalUrl: item.canonicalUrl || '',
      createRedirect: true
    });
  };

  // Save Page URL & SEO
  const handleSavePageUrlAndSeo = async (e) => {
    e.preventDefault();
    if (!editingPage) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/urls/page-seo', {
        method: 'PUT',
        body: {
          current_path: editingPage.originalPath,
          new_path: editingPage.currentPath,
          title: editingPage.title,
          meta_title: editingPage.metaTitle,
          meta_description: editingPage.metaDescription,
          meta_keywords: editingPage.metaKeywords,
          canonical_url: editingPage.canonicalUrl,
          create_redirect: editingPage.createRedirect
        }
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update URL and SEO');
      }

      setEditingPage(null);
      await loadData();
      await refreshCMS();
      setMessage({
        type: 'success',
        text: `Successfully updated URL & SEO meta settings for "${editingPage.title}"!`
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Save Global Action Links
  const handleSaveActionLinks = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        body: settings
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save action link settings');
      }

      await refreshCMS();
      setMessage({ type: 'success', text: 'Global action URLs & CTA links saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Create Redirect
  const handleCreateRedirect = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/redirects', {
        method: 'POST',
        body: newRedirect
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create redirect');
      }

      setNewRedirect({
        source_path: '',
        target_url: '',
        redirect_type: 301,
        notes: '',
        status: 'active'
      });
      await loadData();
      await refreshCMS();
      setMessage({ type: 'success', text: 'URL redirect rule created successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Update Redirect
  const handleUpdateRedirect = async (e) => {
    e.preventDefault();
    if (!editingRedirect) return;
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch(`/api/admin/redirects/${editingRedirect.id}`, {
        method: 'PUT',
        body: editingRedirect
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update redirect');
      }

      setEditingRedirect(null);
      await loadData();
      await refreshCMS();
      setMessage({ type: 'success', text: 'URL redirect rule updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Redirect
  const handleDeleteRedirect = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL redirect?')) return;
    try {
      const res = await authFetch(`/api/admin/redirects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'URL redirect deleted successfully' });
        await loadData();
        await refreshCMS();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete redirect' });
    }
  };

  // Core Website Pages
  const corePages = [
    {
      title: 'Home Page',
      path: '/',
      type: 'core',
      desc: 'Main landing page, hero sliders & stone showcase',
      defaultTitle: 'Luxury Natural Stone, Granite & Marble Exporter | ARPRAN',
      defaultDesc: "Arpran Industries Pvt. Ltd. — Bringing Nature's Elegance to Life. Direct quarry supply of Indian Granite, Makrana White Marble, Sandstone, and Flexible Stone Veneer from Jaipur to global projects."
    },
    {
      title: 'About Us & Heritage',
      path: '/about',
      type: 'core',
      desc: 'Company history, 4 pillars & quarry heritage',
      defaultTitle: 'About Our Heritage, Quarries & Global Infrastructure | ARPRAN',
      defaultDesc: 'Learn about ARPRAN Industries Pvt. Ltd. — over a decade of natural stone quarrying in Rajasthan, state-of-the-art gangsaw processing in Jaipur, and direct ocean export logistics worldwide.'
    },
    {
      title: 'Products Catalog Pavilion',
      path: '/products',
      type: 'core',
      desc: 'All 250+ natural stone varieties & filters',
      defaultTitle: '250+ Architectural Natural Stones & 12 Collections | ARPRAN',
      defaultDesc: 'Explore 12 comprehensive stone collections and 250+ varieties by ARPRAN Industries. Gangsaw granite slabs, Makrana white marble, flexible veneers, sandstone paving, and custom tiles.'
    },
    {
      title: 'Surface Finishes & Textures',
      path: '/finishes',
      type: 'core',
      desc: 'Polished, flamed, honed, leather finishes',
      defaultTitle: 'Architectural Stone Finishes | Polish, Flamed, Honed, Leather',
      defaultDesc: 'Discover available architectural stone surface finishes from ARPRAN Industries. Compare mirror-luster polished slabs, high-traction flamed exterior pavers, and smooth velvet honed textures.'
    },
    {
      title: 'Stone Architecture Journal',
      path: '/blog',
      type: 'core',
      desc: 'Technical stone articles & export trends',
      defaultTitle: 'Architectural Stone Journal & Material Insights | ARPRAN',
      defaultDesc: 'Explore technical stone articles, architectural trend forecasts, and surface finishing guides by ARPRAN Industries. Written for architects, contractors, and luxury homebuilders.'
    },
    {
      title: 'Contact & RFQ Quotation',
      path: '/contact',
      type: 'core',
      desc: 'Jaipur headquarters, RFQ forms, map',
      defaultTitle: 'Contact Us & Request Natural Stone Quotation | ARPRAN',
      defaultDesc: 'Contact ARPRAN Industries Pvt. Ltd. in Jaipur, Rajasthan. Request factory-direct container export prices, gangsaw slab photos, and custom cut-to-size stone estimates.'
    }
  ];

  // Dynamic stone category URLs from database
  const defaultCategoryUrls = [
    { title: 'Indian Granite Series', slug: 'granite-series', path: '/products/granite-series', type: 'category', alias: '/services/granite-series', desc: 'Alaska White, Black Galaxy, Tan Brown slabs' },
    { title: 'Makrana & Exotic Marble', slug: 'marble-series', path: '/products/marble-series', type: 'category', alias: '/services/marble-series', desc: 'Pristine white marble, Statuario & Calacatta' },
    { title: 'Sandstone Series', slug: 'sandstone-series', path: '/products/sandstone-series', type: 'category', alias: '/services/sandstone-series', desc: 'Teakwood, Rainbow, Kandla Grey paving' },
    { title: 'Limestone Series', slug: 'limestone-series', path: '/products/limestone-series', type: 'category', alias: '/services/limestone-series', desc: 'Kadappa Black, Tandur Yellow, Calibrated tiles' },
    { title: 'Quartzite Series', slug: 'quartzite-series', path: '/products/quartzite-series', type: 'category', alias: '/services/quartzite-series', desc: 'Himachal White, Copper Quartzite paving' },
    { title: 'Slate Stone Series', slug: 'slate-stone', path: '/products/slate-stone', type: 'category', alias: '/services/slate-stone', desc: 'Silver Grey, Kund Multi, Rustic cleft walling' },
    { title: 'Ultra-Thin Stone Veneer', slug: 'stone-veneer', path: '/products/stone-veneer', type: 'category', alias: '/services/stone-veneer', desc: '2mm flexible & translucent backlit stone sheets' },
    { title: 'Landscaping & Furniture', slug: 'landscaping-and-furniture', path: '/products/landscaping-and-furniture', type: 'category', alias: '/services/landscaping-and-furniture', desc: 'Cobbles, pebbles, granite garden benches' },
    { title: 'Rough Blocks & Monoliths', slug: 'rough-blocks', path: '/products/rough-blocks', type: 'category', alias: '/services/rough-blocks', desc: 'Gang-saw grade rough blocks for processing' }
  ];

  const categoryUrls = services.length > 0
    ? services.map(s => ({
      title: s.title,
      slug: s.slug,
      path: `/products/${s.slug}`,
      type: 'category',
      alias: `/services/${s.slug}`,
      desc: s.hero_description || s.tagline || `${s.title} specifications & global export supply`,
      defaultTitle: `${s.h1 || s.title} | Premium Indian Natural Stone Exporter`,
      defaultDesc: s.hero_description || `Direct quarry exporter of ${s.title} (${s.catalog_category}) from Jaipur, India to global projects.`
    }))
    : defaultCategoryUrls.map(c => ({
      ...c,
      defaultTitle: `${c.title} | ARPRAN Industries`,
      defaultDesc: `Direct quarry supply and gangsaw processing of ${c.title} from Jaipur, India.`
    }));

  // Combine and hydrate all pages with their SEO database records
  const allDirectoryUrls = [...corePages, ...categoryUrls].map(page => {
    const seoRecord = seoList.find(s =>
      s.page_route === page.path ||
      (page.path === '/' && (s.page_route === '/' || s.page_route === 'home')) ||
      (page.alias && s.page_route === page.alias)
    );

    return {
      ...page,
      metaTitle: seoRecord?.meta_title || page.defaultTitle,
      metaDescription: seoRecord?.meta_description || page.defaultDesc,
      metaKeywords: seoRecord?.meta_keywords || '',
      canonicalUrl: seoRecord?.canonical_url || '',
      hasCustomSeo: !!seoRecord
    };
  });

  const filteredUrls = allDirectoryUrls.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q) ||
      (item.metaTitle && item.metaTitle.toLowerCase().includes(q)) ||
      (item.metaDescription && item.metaDescription.toLowerCase().includes(q)) ||
      (item.metaKeywords && item.metaKeywords.toLowerCase().includes(q)) ||
      (item.alias && item.alias.toLowerCase().includes(q));

    if (typeFilter === 'all') return matchesSearch;
    return matchesSearch && item.type === typeFilter;
  });

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#0A4E9B]" />
        <span>Loading Site URLs, Slugs & SEO Meta Directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-[#0A4E9B]" />
            <span>Site URLs, Slugs & SEO Meta Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit public URLs, category slugs, Google Meta Titles, Meta Descriptions, and manage 301 redirects for all website pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={() => { setActiveTab('redirects'); setEditingRedirect(null); }}
            className="px-4 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Redirect Rule</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'directory'
              ? 'border-[#0A4E9B] text-[#0A4E9B]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <Globe className="w-4 h-4" />
          <span>1. Website URLs & SEO Directory ({allDirectoryUrls.length} Pages)</span>
        </button>

        <button
          onClick={() => setActiveTab('action_links')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'action_links'
              ? 'border-[#0A4E9B] text-[#0A4E9B]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <Link2 className="w-4 h-4" />
          <span>2. Global CTA Button Links</span>
        </button>

        <button
          onClick={() => setActiveTab('redirects')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${activeTab === 'redirects'
              ? 'border-[#0A4E9B] text-[#0A4E9B]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <CornerDownRight className="w-4 h-4" />
          <span>3. 301 / 302 URL Redirects ({redirects.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ALL WEBSITE URLS & SEO META DIRECTORY
          ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page URL, Meta Title, Description, or Keywords..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
              {[
                { id: 'all', label: `All Pages (${allDirectoryUrls.length})` },
                { id: 'core', label: `Core Pages (${corePages.length})` },
                { id: 'category', label: `Stone Series (${categoryUrls.length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTypeFilter(f.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${typeFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A4E9B] shrink-0" />
              <span>
                <strong>SEO Meta Titles & Descriptions:</strong> Click <strong>"Edit URL & SEO"</strong> on any page row below to change its URL slug, Google search title, meta description, and keywords.
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-100 text-[#0A4E9B] text-[10px] font-bold rounded-md uppercase tracking-wider shrink-0">
              Instant Sync
            </span>
          </div>

          {/* URLs & SEO Meta Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 w-64">Page & Scope</th>
                    <th className="px-5 py-3.5 w-48">Live URL Path</th>
                    <th className="px-5 py-3.5">Google Search SERP / Meta Preview</th>
                    <th className="px-5 py-3.5 text-right w-44">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUrls.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">

                      {/* 1. Page Title & Scope */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{item.title}</span>
                          {item.type === 'core' ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Core
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Series
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                        {item.alias && (
                          <div className="text-[10px] text-blue-600 font-mono mt-1 flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3 shrink-0" />
                            <span>Alias: {item.alias}</span>
                          </div>
                        )}
                      </td>

                      {/* 2. Live URL Path */}
                      <td className="px-5 py-4 align-top font-mono">
                        <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 text-slate-800 font-bold block truncate max-w-[180px]">
                          {item.path}
                        </span>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                            <Check className="w-3 h-3" /> Live 200 OK
                          </span>
                        </div>
                      </td>

                      {/* 3. Google SERP & Meta Title / Description Preview */}
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1.5 max-w-xl">

                          {/* Meta Title */}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#1a0dab] hover:underline cursor-pointer text-xs font-serif" onClick={() => handleOpenEditPage(item)}>
                              {item.metaTitle || item.title}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0 ${(item.metaTitle?.length >= 40 && item.metaTitle?.length <= 65)
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                              }`}>
                              {item.metaTitle?.length || 0} chars
                            </span>
                          </div>

                          {/* Meta Description */}
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {item.metaDescription || <span className="italic text-slate-400">No meta description specified. Click "Edit URL & SEO" to add one.</span>}
                          </p>

                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] font-mono text-slate-400">
                              Desc: {item.metaDescription?.length || 0} chars
                            </span>
                            {item.metaKeywords && (
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-xs">
                                Keywords: {item.metaKeywords}
                              </span>
                            )}
                          </div>

                        </div>
                      </td>

                      {/* 4. Action Buttons */}
                      <td className="px-5 py-4 text-right align-top">
                        <div className="flex items-center justify-end gap-1.5">

                          {/* PRIMARY EDIT URL & SEO BUTTON */}
                          <button
                            onClick={() => handleOpenEditPage(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit URL & SEO</span>
                          </button>

                          {/* Copy URL */}
                          <button
                            onClick={() => handleCopy(item.path)}
                            title="Copy full URL to clipboard"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          >
                            {copiedUrl === item.path ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Open Live Page */}
                          <a
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open live page in new tab"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================================================================
              EDIT PAGE URL & SEO META MODAL (POPUP)
              ========================================================================= */}
          {editingPage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] overflow-y-auto">

                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-[#0A4E9B]" />
                      <span>Edit URL & SEO Meta Tags</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configuring page: <strong className="text-slate-900">{editingPage.title}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePageUrlAndSeo} className="space-y-5">

                  {/* SECTION 1: URL PATH & 301 REDIRECT */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>1. Page Route & Slug</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Current Live URL
                        </label>
                        <input
                          type="text"
                          disabled
                          value={editingPage.originalPath}
                          className="w-full px-3 py-2 text-xs bg-slate-200/70 border border-slate-300 rounded-lg font-mono text-slate-600 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          New URL Path / Slug
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPage.currentPath}
                          onChange={(e) => setEditingPage({ ...editingPage, currentPath: e.target.value })}
                          placeholder="/products/indian-granite"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50/70 rounded-lg p-2.5 border border-blue-200/70">
                      <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPage.createRedirect}
                          onChange={(e) => setEditingPage({ ...editingPage, createRedirect: e.target.checked })}
                          className="mt-0.5 rounded text-[#0A4E9B] focus:ring-[#0A4E9B]"
                        />
                        <span>
                          <strong>Preserve SEO (Auto 301 Redirect):</strong> If URL changes, redirect traffic from <code className="font-mono text-[11px] text-blue-900">{editingPage.originalPath}</code> so customer bookmarks, WhatsApp shares, and Google index never break.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* SECTION 2: GOOGLE SEARCH META TAGS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <Search className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>2. Google Search (SERP) Meta Tags</span>
                    </h4>

                    {/* Meta Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Page Meta Title (&lt;title&gt;)
                        </label>
                        <span className={`text-[10px] font-mono font-bold ${editingPage.metaTitle.length > 60
                            ? 'text-amber-600'
                            : editingPage.metaTitle.length >= 45
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                          }`}>
                          {editingPage.metaTitle.length} / 60 chars (Recommended: 50-60)
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        value={editingPage.metaTitle}
                        onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                        placeholder="e.g. Indian Granite Slabs & Tiles Exporter | ARPRAN Industries"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] font-medium text-slate-900"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        This is the prominent clickable headline shown in Google search results and browser tab.
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Meta Description (&lt;meta name="description"&gt;)
                        </label>
                        <span className={`text-[10px] font-mono font-bold ${editingPage.metaDescription.length > 160
                            ? 'text-amber-600'
                            : editingPage.metaDescription.length >= 120
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                          }`}>
                          {editingPage.metaDescription.length} / 160 chars (Recommended: 140-160)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={editingPage.metaDescription}
                        onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                        placeholder="e.g. Direct quarry supply of Indian gangsaw granite slabs, tiles, and cut-to-size from Jaipur to global projects."
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] text-slate-800 leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        A concise summary of the page content that encourages searchers to click through.
                      </p>
                    </div>

                    {/* Meta Keywords & Canonical URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Meta Keywords (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingPage.metaKeywords}
                          onChange={(e) => setEditingPage({ ...editingPage, metaKeywords: e.target.value })}
                          placeholder="granite slabs, natural stone, Makrana marble"
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Custom Canonical URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={editingPage.canonicalUrl}
                          onChange={(e) => setEditingPage({ ...editingPage, canonicalUrl: e.target.value })}
                          placeholder="https://arpran.com/products/..."
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: LIVE GOOGLE SEARCH SERP PREVIEW */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#0A4E9B]" />
                        <span>Live Google Search Snippet Preview</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Simulated SERP</span>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-700">
                          A
                        </div>
                        <span className="font-medium text-slate-800">ARPRAN Industries</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-500 text-[10px] truncate">
                          {window.location.origin}{editingPage.currentPath}
                        </span>
                      </div>

                      {/* SERP Headline */}
                      <h4 className="text-[#1a0dab] font-medium text-sm hover:underline cursor-pointer font-serif line-clamp-1 pt-0.5">
                        {editingPage.metaTitle || `${editingPage.title} | ARPRAN Industries`}
                      </h4>

                      {/* SERP Description Snippet */}
                      <p className="text-[11px] text-[#4d5156] leading-relaxed line-clamp-2">
                        {editingPage.metaDescription || 'No description provided. Add one above to enhance Google ranking and user clicks.'}
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPage(null)}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Save URL & SEO Meta</span>
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 2: GLOBAL CTA BUTTON LINKS
          ========================================================================= */}
      {activeTab === 'action_links' && (
        <form onSubmit={handleSaveActionLinks} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Global Call-To-Action (CTA) Destinations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure default target URLs for major buttons and direct communication links across the website.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Action Links</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Main Stone Catalog / Pavilion URL
              </label>
              <input
                type="text"
                value={settings.cta_catalog_url || '/products'}
                onChange={(e) => setSettings({ ...settings, cta_catalog_url: e.target.value })}
                placeholder="/products"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Where "Explore All Collections" and "Stone Pavilion" buttons redirect.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp RFQ Direct Chat URL
              </label>
              <input
                type="text"
                value={settings.cta_whatsapp_url || 'https://wa.me/919414068933'}
                onChange={(e) => setSettings({ ...settings, cta_whatsapp_url: e.target.value })}
                placeholder="https://wa.me/919414068933"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Target link for floating WhatsApp button and quotation cards.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                E-Catalogue / Master Brochure PDF Download URL
              </label>
              <input
                type="text"
                value={settings.cta_brochure_url || '/downloads/arpran-stone-catalogue-2026.pdf'}
                onChange={(e) => setSettings({ ...settings, cta_brochure_url: e.target.value })}
                placeholder="/uploads/arpran-brochure.pdf"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Direct downloadable brochure PDF for international architects and buyers.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact & RFQ Page URL
              </label>
              <input
                type="text"
                value={settings.cta_rfq_url || '/contact'}
                onChange={(e) => setSettings({ ...settings, cta_rfq_url: e.target.value })}
                placeholder="/contact"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Primary destination for "Request FOB/CIF Quote" header actions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Google Maps Location URL (Jaipur Headquarters)
              </label>
              <input
                type="text"
                value={settings.cta_google_maps_url || 'https://maps.google.com/?q=Jaipur,Rajasthan,India'}
                onChange={(e) => setSettings({ ...settings, cta_google_maps_url: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Virtual Quarry & Showroom 360 Tour URL
              </label>
              <input
                type="text"
                value={settings.cta_virtual_tour_url || ''}
                onChange={(e) => setSettings({ ...settings, cta_virtual_tour_url: e.target.value })}
                placeholder="https://my.matterport.com/show/?m=..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Action Links</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 3: 301 / 302 URL REDIRECTS
          ========================================================================= */}
      {activeTab === 'redirects' && (
        <div className="space-y-6">

          {/* Create / Edit Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingRedirect ? `Edit Redirect Rule #${editingRedirect.id}` : 'Create New URL Redirect Rule'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Map short aliases, outdated marketing links, or campaign URLs directly to active site destinations.
            </p>

            <form onSubmit={editingRedirect ? handleUpdateRedirect : handleCreateRedirect} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Source Path (Incoming)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRedirect ? editingRedirect.source_path : newRedirect.source_path}
                    onChange={(e) => editingRedirect
                      ? setEditingRedirect({ ...editingRedirect, source_path: e.target.value })
                      : setNewRedirect({ ...newRedirect, source_path: e.target.value })
                    }
                    placeholder="/granite or /brochure"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Destination URL
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRedirect ? editingRedirect.target_url : newRedirect.target_url}
                    onChange={(e) => editingRedirect
                      ? setEditingRedirect({ ...editingRedirect, target_url: e.target.value })
                      : setNewRedirect({ ...newRedirect, target_url: e.target.value })
                    }
                    placeholder="/products/granite-series"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    HTTP Redirect Type
                  </label>
                  <select
                    value={editingRedirect ? editingRedirect.redirect_type : newRedirect.redirect_type}
                    onChange={(e) => editingRedirect
                      ? setEditingRedirect({ ...editingRedirect, redirect_type: Number(e.target.value) })
                      : setNewRedirect({ ...newRedirect, redirect_type: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value={301}>301 - Permanent Redirect (SEO)</option>
                    <option value={302}>302 - Temporary Redirect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingRedirect ? editingRedirect.status : newRedirect.status}
                    onChange={(e) => editingRedirect
                      ? setEditingRedirect({ ...editingRedirect, status: e.target.value })
                      : setNewRedirect({ ...newRedirect, status: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="active">Active (Redirecting)</option>
                    <option value="disabled">Disabled (Inactive)</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Notes / Marketing Purpose (Internal)
                </label>
                <input
                  type="text"
                  value={editingRedirect ? (editingRedirect.notes || '') : (newRedirect.notes || '')}
                  onChange={(e) => editingRedirect
                    ? setEditingRedirect({ ...editingRedirect, notes: e.target.value })
                    : setNewRedirect({ ...newRedirect, notes: e.target.value })
                  }
                  placeholder="e.g. Short link for print brochure or WhatsApp flyer"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingRedirect ? 'Update Rule' : 'Save Redirect Rule'}</span>
                </button>

                {editingRedirect && (
                  <button
                    type="button"
                    onClick={() => setEditingRedirect(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Redirects List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Active Redirect Rules ({redirects.length})
              </h3>
            </div>

            {redirects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No custom redirect rules found. Add one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Source Incoming Path</th>
                      <th className="px-5 py-3">Destination Target</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Purpose / Notes</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {redirects.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                          {r.source_path}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[#0A4E9B]">
                          {r.target_url}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            HTTP {r.redirect_type}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {r.notes || '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                            }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingRedirect(r)}
                              title="Edit Redirect Rule"
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRedirect(r.id)}
                              title="Delete Redirect Rule"
                              className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
