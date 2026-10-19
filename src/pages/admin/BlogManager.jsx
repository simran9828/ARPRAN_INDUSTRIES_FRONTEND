import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Search, CheckCircle2, AlertCircle, 
  Loader2, X, BookOpen, Calendar, Clock, Image as ImageIcon, 
  Globe, Sparkles, AlertTriangle, Eye, Link2, Filter,
  HelpCircle, ListPlus, Heading, AlignLeft, Layers, CheckSquare,
  HelpCircle as FaqIcon, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmModal from '../../components/admin/ConfirmModal';

const CATEGORIES = [
  'Architecture & Trends',
  'Technical Guide',
  'Heritage & Materials',
  'Innovation & Cladding',
  'Landscaping & Urban Design'
];
import FormattedArticleContent from '../../components/FormattedArticleContent';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editorTab, setEditorTab] = useState('write'); // 'write' or 'preview'

  // Textarea cursor stabilization refs
  const textareaRef = useRef(null);
  const cursorPosRef = useRef(null);

  const [mainTab, setMainTab] = useState('articles'); // 'articles' | 'banner'
  const [blogPage, setBlogPage] = useState({
    title: 'Architectural Stone Journal & Material Insights',
    h1: 'Architectural Stone Journal & Material Guides',
    tagline: 'Insights on natural stone geology, diamond gangsaw fabrication, slip-resistance standards, and innovative surface treatments from our technical team.',
    content: {
      badge: 'Architectural Insights & Journal'
    }
  });
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const [resBlogs, resPage] = await Promise.all([
        authFetch('/api/admin/blogs'),
        authFetch('/api/admin/pages/blogs')
      ]);

      if (resBlogs.ok) {
        const json = await resBlogs.json();
        if (json.success && json.data) {
          setBlogs(json.data);
        }
      }

      if (resPage.ok) {
        const pageJson = await resPage.json();
        if (pageJson.success && pageJson.data) {
          setBlogPage(prev => ({
            ...prev,
            ...pageJson.data,
            content: {
              ...prev.content,
              ...(pageJson.data.content || {})
            }
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load blogs or page:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanner = async (e) => {
    if (e) e.preventDefault();
    setIsSavingBanner(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/pages/blogs', {
        method: 'PUT',
        body: blogPage
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update blog page banner');
      }

      setMessage({ type: 'success', text: 'Blog page banner updated successfully!' });
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSavingBanner(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditorTab('write');
    setEditingBlog({
      id: null,
      title: '',
      slug: '',
      category: 'Architecture & Trends',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      read_time: '4 min read',
      image: '/images/blog-granite.jpg',
      alt_text: '',
      excerpt: '',
      content: `Indian natural stone quarried from certified belts in Rajasthan offers unparalleled compressive strength and aesthetic elegance for global architectural projects.

## Petrographic Density & Gangsaw Calibration Tolerances
Unlike softer sedimentary stones, Indian granites and marbles are sawn on computerized diamond gangsaws, maintaining strict ±1mm dimensional calibration to eliminate lippage during installation.

### High Compressive Strength Standards
Plutonic igneous rock formations withstand compressive loads exceeding 180 MPa with low water absorption (<0.2%).

• Direct quarry mining across Rajasthan and South Indian belts
• Calibrated uniform 20mm and 30mm gangsaw slab thickness
• High-traction flamed, mirror polished, and velvet honed finishes
• Seaworthy fumigated hardwood A-frame container packaging

### Frequently Asked Questions
**Q: What is the recommended slab thickness for commercial flooring?**
A: For high footfall commercial floors, 20mm calibrated slabs are standard. For mechanically anchored facades, 30mm or custom 40mm slabs are recommended.

**Q: Can this stone withstand freeze-thaw cycles?**
A: Yes, low water absorption (<0.2%) guarantees extreme resilience against frost wedging and spalling.`,
      status: 'published',
      display_order: (blogs.length || 0) + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditorTab('write');
    setEditingBlog({ 
      ...blog,
      alt_text: blog.alt_text || blog.title || '',
      content: blog.content || ''
    });
    setIsModalOpen(true);
  };

  // Maintain exact cursor position across typing and state updates
  useLayoutEffect(() => {
    if (cursorPosRef.current && textareaRef.current && document.activeElement === textareaRef.current) {
      const { start, end } = cursorPosRef.current;
      if (typeof start === 'number' && typeof end === 'number') {
        if (textareaRef.current.selectionStart !== start || textareaRef.current.selectionEnd !== end) {
          textareaRef.current.setSelectionRange(start, end);
        }
      }
    }
  }, [editingBlog?.content]);

  // Track selection whenever cursor moves
  const handleCursorTrack = (e) => {
    if (e && e.target) {
      cursorPosRef.current = {
        start: e.target.selectionStart,
        end: e.target.selectionEnd
      };
    }
  };

  // Helper to insert formatting templates into the main blog textarea with zero cursor jumping
  const insertFormatting = (type) => {
    const textarea = textareaRef.current || document.getElementById('blog-content-textarea');
    const current = editingBlog?.content || '';

    if (!textarea) {
      let fallbackText = '';
      if (type === 'h2') fallbackText = '\n\n## Section Heading\nDetailed specifications here...\n';
      else if (type === 'h3') fallbackText = '\n\n### Subheading\nDetailed notes here...\n';
      else if (type === 'bold') fallbackText = '**Bold Text**';
      else if (type === 'quote') fallbackText = '\n\n> "Built by Nature. Perfected by Arpran. Delivered Worldwide."\n';
      else if (type === 'points') fallbackText = '\n\n• Key Point 1: Direct quarry extraction across Rajasthan\n• Key Point 2: Diamond multi-wire gangsaw processing\n';
      else if (type === 'faqs') fallbackText = '\n\n### Frequently Asked Questions\n**Q: What is the recommended slab thickness?**\nA: 20mm or 30mm calibrated gangsaw slabs.\n';
      else fallbackText = type;
      setEditingBlog(prev => ({ ...prev, content: (prev.content ? prev.content + '\n' : '') + fallbackText }));
      return;
    }

    textarea.focus();
    const start = typeof textarea.selectionStart === 'number' ? textarea.selectionStart : (cursorPosRef.current?.start ?? current.length);
    const end = typeof textarea.selectionEnd === 'number' ? textarea.selectionEnd : (cursorPosRef.current?.end ?? start);

    const before = current.substring(0, start);
    const selected = current.substring(start, end);
    const after = current.substring(end);

    const needsLeadingNewline = start > 0 && !before.endsWith('\n');
    const lead = needsLeadingNewline ? '\n\n' : (start > 0 && !before.endsWith('\n\n') ? '\n' : '');

    let inserted = '';
    let selectOffsetStart = 0;
    let selectOffsetEnd = 0;

    switch (type) {
      case 'h2': {
        const heading = selected || 'Section Heading (H2)';
        inserted = `${lead}## ${heading}\n`;
        selectOffsetStart = lead.length + 3;
        selectOffsetEnd = selectOffsetStart + heading.length;
        break;
      }
      case 'h3': {
        const heading = selected || 'Subheading (H3)';
        inserted = `${lead}### ${heading}\n`;
        selectOffsetStart = lead.length + 4;
        selectOffsetEnd = selectOffsetStart + heading.length;
        break;
      }
      case 'bold': {
        const text = selected || 'Bold Text';
        inserted = `**${text}**`;
        selectOffsetStart = 2;
        selectOffsetEnd = 2 + text.length;
        break;
      }
      case 'quote': {
        const text = selected || 'Built by Nature. Perfected by Arpran. Delivered Worldwide.';
        inserted = `${lead}> "${text}"\n`;
        selectOffsetStart = lead.length + 3;
        selectOffsetEnd = selectOffsetStart + text.length;
        break;
      }
      case 'points': {
        if (selected) {
          const lines = selected.split('\n').filter(Boolean);
          const bulleted = lines.map(l => /^[•\-\*]\s+/.test(l) ? l : `• ${l}`).join('\n');
          inserted = `${lead}${bulleted}\n`;
          selectOffsetStart = lead.length;
          selectOffsetEnd = lead.length + bulleted.length;
        } else {
          inserted = `${lead}• Key Point 1: Direct quarry extraction across Rajasthan\n• Key Point 2: Diamond multi-wire gangsaw processing with ±1mm calibration\n• Key Point 3: Seaworthy fumigated A-frame export crating\n`;
          selectOffsetStart = lead.length + 2;
          selectOffsetEnd = lead.length + 13;
        }
        break;
      }
      case 'faqs': {
        if (selected) {
          inserted = `${lead}**Q: ${selected}**\nA: Provide architectural answer here.\n`;
          selectOffsetStart = inserted.indexOf('Provide');
          selectOffsetEnd = selectOffsetStart + 'Provide architectural answer here.'.length;
        } else {
          inserted = `${lead}### Frequently Asked Questions\n**Q: What is the recommended slab thickness?**\nA: For commercial flooring and exterior facades, 20mm or 30mm calibrated gangsaw slabs are standard.\n\n**Q: How does this natural stone perform in extreme climates?**\nA: Dense igneous crystalline bonding and low water absorption (<0.2%) prevent freeze-thaw damage.\n`;
          selectOffsetStart = lead.length + 4;
          selectOffsetEnd = selectOffsetStart + 30;
        }
        break;
      }
      default:
        inserted = type;
        selectOffsetStart = inserted.length;
        selectOffsetEnd = inserted.length;
    }

    const updated = before + inserted + after;
    const newStart = start + selectOffsetStart;
    const newEnd = start + selectOffsetEnd;

    cursorPosRef.current = { start: newStart, end: newEnd };
    setEditingBlog(prev => ({ ...prev, content: updated }));

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newStart, newEnd);
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/admin/blogs/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete article');

      setMessage({ type: 'success', text: 'Article deleted successfully.' });
      setDeleteId(null);
      await loadBlogs();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingBlog.title || !editingBlog.image) {
      setMessage({ type: 'error', text: 'Article title and cover image are required.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const isNew = !editingBlog.id;
      const url = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${editingBlog.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...editingBlog,
        alt_text: editingBlog.alt_text || editingBlog.title,
        slug: editingBlog.slug || editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      const res = await authFetch(url, {
        method,
        body: payload
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save article');

      setMessage({ 
        type: 'success', 
        text: isNew ? 'New architectural article published successfully!' : `Article "${editingBlog.title}" updated successfully!` 
      });
      setIsModalOpen(false);
      await loadBlogs();
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        b.title.toLowerCase().includes(q) || 
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.alt_text && b.alt_text.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [blogs, search, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Architectural Journal & Stone Articles
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Publish technical stone guides, quarry heritage tutorials, and architectural trends.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{blogs.length} Total Articles</span>
            <span>•</span>
            <span>{blogs.filter(b => b.status === 'published').length} Published</span>
            <span>•</span>
            <span>{blogs.filter(b => b.status === 'draft').length} Drafts</span>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm hover:shadow flex items-center justify-center gap-2 self-start cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Notifications */}
      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setMainTab('articles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            mainTab === 'articles'
              ? 'bg-[#0A4E9B] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Journal Articles ({blogs.length})</span>
        </button>

        <button
          onClick={() => setMainTab('banner')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
            mainTab === 'banner'
              ? 'bg-[#0A4E9B] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Blog Page Banner & SEO</span>
        </button>
      </div>

      {/* Banner & SEO Editor View */}
      {mainTab === 'banner' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
                <span>Blog & Journal Page Banner Headlines</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Configure the dark banner headline, badge, and SEO description for the public /blog page.</p>
            </div>

            <button
              onClick={handleSaveBanner}
              disabled={isSavingBanner}
              className="px-5 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={blogPage.content?.badge || ''}
                onChange={(e) => setBlogPage({
                  ...blogPage,
                  content: { ...blogPage.content, badge: e.target.value }
                })}
                placeholder="Architectural Insights & Journal"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Page Title (Browser Tag)
              </label>
              <input
                type="text"
                value={blogPage.title || ''}
                onChange={(e) => setBlogPage({ ...blogPage, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Main H1 Heading
            </label>
            <input
              type="text"
              value={blogPage.h1 || ''}
              onChange={(e) => setBlogPage({
                ...blogPage,
                h1: e.target.value,
                content: { ...blogPage.content, h1: e.target.value }
              })}
              placeholder="Architectural Stone Journal & Material Guides"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Subtitle / Description
            </label>
            <textarea
              rows="3"
              value={blogPage.tagline || ''}
              onChange={(e) => setBlogPage({
                ...blogPage,
                tagline: e.target.value,
                content: { ...blogPage.content, tagline: e.target.value }
              })}
              placeholder="Insights on natural stone geology, diamond gangsaw fabrication..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Articles Tab Content */}
      {mainTab === 'articles' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search articles by title, Alt text, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none text-slate-700 py-1"
            >
              <option value="All">All Categories ({blogs.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({blogs.filter(b => b.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-none text-slate-700 py-1"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center">
          <Loader2 className="w-8 h-8 text-[#0A4E9B] animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No articles found</h3>
          <p className="max-w-sm mx-auto text-slate-400">
            {search || selectedCategory !== 'All' || selectedStatus !== 'All' 
              ? 'Try resetting your search query or filters to view all articles.' 
              : 'You have not written any articles yet. Click "Write New Article" above to create your first article.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#0A4E9B]/50 transition flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image & Category / Status Badges */}
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.alt_text || blog.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = '/images/finish-polished.jpg'; }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm shadow-xs">
                    {blog.category}
                  </div>
                  <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                    blog.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
                  }`}>
                    {blog.status}
                  </div>
                </div>

                {/* Article Info Body */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.read_time}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0A4E9B] transition-colors">
                    {blog.title}
                  </h3>

                  {/* Alt Text Badge */}
                  <div className="pt-1">
                    {blog.alt_text ? (
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/70 text-[10px] text-slate-600 line-clamp-1">
                        <span className="font-bold text-[#0A4E9B] mr-1">Alt:</span>
                        "{blog.alt_text}"
                      </div>
                    ) : (
                      <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-800 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Missing Image Alt Text</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
                    {blog.excerpt || 'No summary provided.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  /{blog.slug}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0A4E9B] rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="Edit article"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => setDeleteId(blog.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete article"
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

      {/* =========================================================================
          ADD / EDIT ARTICLE MODAL
          ========================================================================= */}
      {isModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center font-bold">
                  {editingBlog.id ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {editingBlog.id ? `Edit Article (ID: #${editingBlog.id})` : 'Write New Architectural Article'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish stone engineering articles, selection guides, and architectural case studies.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* 1. Article Title & Slug */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Top Indian Granites Trending in Global Luxury Architecture"
                    value={editingBlog.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditingBlog(prev => ({ 
                        ...prev, 
                        title, 
                        slug: prev.slug && prev.slug !== prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ? prev.slug : slug,
                        alt_text: prev.alt_text ? prev.alt_text : title
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Article URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 text-xs bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 font-mono">
                      /journal/
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. top-indian-granites-global-architecture"
                      value={editingBlog.slug}
                      onChange={(e) => setEditingBlog(prev => ({ 
                        ...prev, 
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') 
                      }))}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-r-xl focus:bg-white font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Category, Date, Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date String
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 2026"
                    value={editingBlog.date}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={editingBlog.read_time}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, read_time: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* 3. Cover Image & Alt Text via Enhanced ImageUploader */}
              <div className="space-y-3">
                <ImageUploader
                  label="Article Cover Photo (Upload File or Enter URL)"
                  value={editingBlog.image}
                  onChange={(url) => setEditingBlog(prev => ({ ...prev, image: url }))}
                  altValue={editingBlog.alt_text}
                  onAltChange={(alt) => setEditingBlog(prev => ({ ...prev, alt_text: alt }))}
                  titleSuggestion={editingBlog.title}
                  recommendedSize="Recommended: 1200x800px or 16:9 Landscape"
                />

                {/* Explicit Alt Text Input */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>Cover Image Alt Text (SEO & Google Image Ranking)</span>
                      <span className="text-[10px] font-bold bg-[#0A4E9B] text-white px-1.5 py-0.2 rounded">
                        SEO
                      </span>
                    </label>
                    {editingBlog.title && editingBlog.alt_text !== editingBlog.title && (
                      <button
                        type="button"
                        onClick={() => setEditingBlog(prev => ({ ...prev, alt_text: prev.title }))}
                        className="text-[11px] text-[#0A4E9B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Use Title as Alt</span>
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingBlog.alt_text || ''}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, alt_text: e.target.value }))}
                    placeholder="e.g. Modern luxury villa featuring polished Indian granite and translucent stone veneer"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A4E9B] text-slate-800"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>Critical for image indexation and visual accessibility</span>
                    <span className={(editingBlog.alt_text || '').length > 125 ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                      {(editingBlog.alt_text || '').length}/125 chars
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Excerpt / Short Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Article Excerpt / Meta Summary
                </label>
                <textarea
                  rows="2"
                  placeholder="Short introductory summary shown on card previews and search snippets..."
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              {/* 5. Unified Full Article Body Content with H2, H3, Points, and FAQs Toolbar */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#0A4E9B]" />
                      <span>Full Article Body Content</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Write your complete blog post here. Use the action buttons to insert H2, H3, Points, and FAQs directly inside your article.
                    </p>
                  </div>

                  {/* Write vs Preview Mode Toggle */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditorTab('write')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        editorTab === 'write'
                          ? 'bg-white text-[#0A4E9B] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Write / Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        editorTab === 'preview'
                          ? 'bg-white text-[#0A4E9B] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Formatting Action Toolbar */}
                {editorTab === 'write' && (
                  <div className="p-2.5 bg-slate-100/80 rounded-xl border border-slate-200/90 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
                      Insert:
                    </span>

                    {/* H2 Heading Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertFormatting('h2')}
                      className="px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:border-[#0A4E9B] hover:text-[#0A4E9B] text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Insert H2 Section Heading"
                    >
                      <span className="px-1 py-0.2 bg-blue-100 text-[#0A4E9B] rounded text-[10px] font-mono">H2</span>
                      <span>Heading</span>
                    </button>

                    {/* H3 Subheading Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertFormatting('h3')}
                      className="px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:border-[#0A4E9B] hover:text-[#0A4E9B] text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Insert H3 Subheading"
                    >
                      <span className="px-1 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">H3</span>
                      <span>Subheading</span>
                    </button>

                    {/* Bullet Points Section Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertFormatting('points')}
                      className="px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:border-[#0A4E9B] hover:text-[#0A4E9B] text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Insert Bullet Points Section"
                    >
                      <ListPlus className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>Points / List</span>
                    </button>

                    {/* FAQs Section Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertFormatting('faqs')}
                      className="px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:border-[#0A4E9B] hover:text-[#0A4E9B] text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                      title="Insert Frequently Asked Questions (FAQs)"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#0A4E9B]" />
                      <span>FAQs Section</span>
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

                    {/* Bold Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertFormatting('bold')}
                      className="px-2 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition shadow-2xs cursor-pointer"
                      title="Bold Text"
                    >
                      B
                    </button>

                    {/* Pull Quote Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => insertFormatting('quote')}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-serif italic border border-slate-200 transition shadow-2xs cursor-pointer"
                      title="Pull Quote"
                    >
                      “ Quote ”
                    </button>
                  </div>
                )}

                {/* Editor Content Textarea */}
                {editorTab === 'write' ? (
                  <div>
                    <textarea
                      ref={textareaRef}
                      id="blog-content-textarea"
                      rows="14"
                      placeholder={`Write your complete architectural article here...

You can easily structure it with:
## H2 Section Headings
Paragraph text explaining geological properties...

### H3 Subheadings
Detailed notes...

• Point 1: Key specification takeaway
• Point 2: Moisture resistance rating
• Point 3: Gangsaw calibration standard

### Frequently Asked Questions
**Q: Question text here?**
A: Clear answer text here.`}
                      value={editingBlog.content || ''}
                      onChange={(e) => {
                        const target = e.target;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;
                        cursorPosRef.current = { start, end };
                        setEditingBlog(prev => ({ ...prev, content: target.value }));
                      }}
                      onSelect={handleCursorTrack}
                      onClick={handleCursorTrack}
                      onKeyUp={handleCursorTrack}
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A4E9B]/20 focus:border-[#0A4E9B] leading-relaxed font-sans text-slate-900"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                      <span>Pro-tip: Click buttons above to insert H2, H3, Points, and FAQs anywhere in your article.</span>
                      <span>{(editingBlog.content || '').length} characters</span>
                    </div>
                  </div>
                ) : (
                  /* Live Article Preview Box */
                  <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl max-h-[460px] overflow-y-auto space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Live Formatted Preview:
                      </span>
                      <span className="text-[11px] font-semibold text-[#0A4E9B] bg-blue-50 px-2 py-0.5 rounded">
                        As Readers Will See
                      </span>
                    </div>
                    {editingBlog.content ? (
                      <FormattedArticleContent content={editingBlog.content} />
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-8">
                        No content written yet. Switch to "Write / Edit" tab and add text.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 6. Visibility Status & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Visibility Status
                  </label>
                  <select
                    value={editingBlog.status}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingBlog.display_order}
                    onChange={(e) => setEditingBlog(prev => ({ ...prev, display_order: Number(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !editingBlog.title || !editingBlog.image}
                  className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingBlog.id ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Article Confirmation"
        message="Are you sure you want to permanently delete this architectural article? This action cannot be undone."
        loading={isSaving}
      />

    </div>
  );
}
