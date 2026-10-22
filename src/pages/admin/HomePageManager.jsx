import React, { useState, useEffect } from 'react';
import {
  Save, CheckCircle2, AlertCircle, Loader2, Sparkles,
  Layers, Building, HelpCircle, Eye, ArrowRight, Grid, Award, Plus, Trash2,
  Compass, Box, Package, Check, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';

const DEFAULT_CATEGORY_CARDS = {
  'Granite Series': {
    slug: 'granite-series',
    image: '/images/hero/granite-series-hero.jpg',
    specBadge: 'Multi-Wire Gangsaw Slabs',
    desc: 'Computerized diamond gangsaw slabs (20mm/30mm) in Black Galaxy, Viscon White & Tan Brown for commercial towers and countertops.'
  },
  'Marble Series': {
    slug: 'marble-series',
    image: '/images/hero/marble-series-hero.jpg',
    specBadge: 'Makrana & Calcite Slabs',
    desc: 'Pristine Makrana white marble, Fantasy Brown, and exotic veined calcite slabs sliced with diamond gangsaw precision for luxury villas.'
  },
  'Rough Blocks': {
    slug: 'rough-blocks',
    image: '/images/hero/rough-blocks-hero.jpg',
    specBadge: 'Quarry Monoliths (6-9 cbm)',
    desc: 'Direct quarry extraction rights, dressed 6-sided gangsaw blocks with ultrasonic crack inspection for international stone factories.'
  },
  'Quartzite Series': {
    slug: 'quartzite-series',
    image: '/images/hero/quartzite-series-hero.jpg',
    specBadge: 'Mohs Hardness 7 Slabs',
    desc: 'Exotic crystalline metamorphic slabs (Silver Shine, Copper) with zero acid etching and diamond durability for focal feature walls.'
  },
  'Sandstone Series': {
    slug: 'sandstone-series',
    image: '/images/hero/sandstone-series-hero.jpg',
    specBadge: 'CE Certified Paving',
    desc: 'Natural cleft Kandla Grey & Raj Green patio packs, sawn smooth paving slabs, and bullnose pool copings with R11 non-slip rating.'
  },
  'Slate Stone': {
    slug: 'slate-stone',
    image: '/images/hero/slate-stone-hero.jpg',
    specBadge: 'Natural Cleft Tiles',
    desc: 'Foliated non-slip floor tiles, interlocking Z-cladding panels & rustic copper hearth stones with low water absorption.'
  },
  'Stone Veneer': {
    slug: 'stone-veneer',
    image: '/images/hero/stone-veneer-hero.jpg',
    specBadge: 'Ultra-Thin 2mm Flexible',
    desc: 'Revolutionary real stone sheets with fiberglass flexibility for curved columns, lightweight ceilings, and translucent backlit bars.'
  },
  'Limestone Series': {
    slug: 'limestone-series',
    image: '/images/hero/limestone-series-hero.jpg',
    specBadge: 'High-Traffic Architectural Limestone',
    desc: 'Premium Kadappa Black, Tandur & Jaisalmer limestones offering superior wear resistance and cool-foot properties for civic concourses.'
  },
  'Landscaping & Furniture': {
    slug: 'landscaping-and-furniture',
    image: '/images/hero/bright-landscaping-paving.jpg',
    specBadge: 'Solid Carved Monoliths',
    desc: 'Hand-sculpted granite benches, tiered sandstone water fountains, planters, stepping stones, and radial cobblestones for civic parks.'
  }
};

export default function HomePageManager() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('hero_card');
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  useEffect(() => {
    async function loadHomePage() {
      try {
        const res = await authFetch('/api/admin/pages/home');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const loaded = json.data;
            if (loaded.content?.about_preview) {
              const ap = loaded.content.about_preview;
              if (!ap.heading || ap.heading.includes('Architectural Mastery')) {
                ap.heading = "Arpran Industries Offers Premium Natural Stone for Modern Architecture & Landscaping";
              }
              if (!ap.description || ap.description.includes('stone capital of India')) {
                ap.description = "Discover premium natural stone crafted to bring timeless beauty, durability, and character to modern architecture and landscaping. Arpran Industries offers a carefully selected range of natural stones, ideal for creating elegant interiors, striking exteriors, and exceptional outdoor spaces.";
              }
            }
            setPageData(loaded);
          }
        }
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomePage();
  }, [authFetch]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/pages/home', {
        method: 'PUT',
        body: pageData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update Home page sections');
      }

      await refreshCMS();
      setMessage({ type: 'success', text: 'Home page sections updated successfully! Changes are live on the website.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
        Loading Home Page section editors...
      </div>
    );
  }

  const content = pageData?.content || {};
  const heroCard = content.hero_card || {};
  const aboutPreview = content.about_preview || {};
  const collectionsPreview = content.collections_preview || {};
  const finishesPreview = content.finishes_preview || {};
  const blogPreview = content.blog_preview || {};
  const whyChoose = content.why_choose || {};
  const sampleBox = whyChoose.sample_box || {};

  const updateContent = (sectionKey, updatedSection) => {
    setPageData({
      ...pageData,
      content: {
        ...content,
        [sectionKey]: updatedSection
      }
    });
  };

  const tabs = [
    { id: 'hero_card', label: '1. Highlight Story & Quick Stats', icon: Sparkles },
    { id: 'about_preview', label: '2. About Preview & 4 Pillars', icon: Building },
    { id: 'collections_preview', label: '3. Collections Showcase Cards', icon: Grid },
    { id: 'finishes_preview', label: '4. Surface Finishes Preview', icon: Layers },
    { id: 'why_choose', label: '5. Why Choose Us (Pillars)', icon: Compass },
    { id: 'sample_box', label: '6. Sample Box & Studio Kit', icon: Box },
    { id: 'blog_preview', label: '7. Blog & Journal Preview', icon: Award }
  ];

  const categoryCardsMap = collectionsPreview.category_cards || DEFAULT_CATEGORY_CARDS;

  return (
    <div className="space-y-6">

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Home Page Content & Sections Editor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage every section on the homepage: hero information card, counter stats, about preview, pillars, collections cards, finishes showcase, Why Choose Us, sample box callout, and blog preview.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Live Changes</span>
        </button>
      </div>

      {/* Notification */}
      {message.text && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${message.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${isActive
                  ? 'bg-[#0A4E9B] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: HERO CARD & QUICK STATS */}
      {/* ============================================================== */}
      {activeTab === 'hero_card' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
              <span>Hero Overlay Highlight Story & Metric Counters</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Controls the floating summary card and 4 quick operational counters shown on the main hero slider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={heroCard.badge || ''}
                onChange={(e) => updateContent('hero_card', { ...heroCard, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={heroCard.title || ''}
                onChange={(e) => updateContent('hero_card', { ...heroCard, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={heroCard.subtitle || ''}
                onChange={(e) => updateContent('hero_card', { ...heroCard, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Motto / Slogan
              </label>
              <input
                type="text"
                value={heroCard.motto || ''}
                onChange={(e) => updateContent('hero_card', { ...heroCard, motto: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Summary Description Paragraph
            </label>
            <textarea
              rows="3"
              value={heroCard.description || ''}
              onChange={(e) => updateContent('hero_card', { ...heroCard, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>

          {/* 4 Counter Metrics */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              The 4 Quick Counters / Stats
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(heroCard.metrics || [
                { value: "12", label: "Collections" },
                { value: "250+", label: "Varieties" },
                { value: "10+ Yrs", label: "Heritage" },
                { value: "International", label: "Export" }
              ]).map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Metric {idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Value (e.g. 250+)"
                    value={m.value || ''}
                    onChange={(e) => {
                      const newMetrics = [...(heroCard.metrics || [])];
                      newMetrics[idx] = { ...newMetrics[idx], value: e.target.value };
                      updateContent('hero_card', { ...heroCard, metrics: newMetrics });
                    }}
                    className="w-full px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Varieties)"
                    value={m.label || ''}
                    onChange={(e) => {
                      const newMetrics = [...(heroCard.metrics || [])];
                      newMetrics[idx] = { ...newMetrics[idx], label: e.target.value };
                      updateContent('hero_card', { ...heroCard, metrics: newMetrics });
                    }}
                    className="w-full px-2 py-1 text-[11px] bg-white border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ABOUT PREVIEW & 4 PILLARS */}
      {/* ============================================================== */}
      {activeTab === 'about_preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0A4E9B]" />
              <span>About Section Preview, Trust Badges & 4 Pillars</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Displayed right under the hero slider on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={aboutPreview.badge || ''}
                onChange={(e) => updateContent('about_preview', { ...aboutPreview, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={aboutPreview.heading || ''}
                onChange={(e) => updateContent('about_preview', { ...aboutPreview, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Main Description Paragraph
            </label>
            <textarea
              rows="3"
              value={aboutPreview.description || ''}
              onChange={(e) => updateContent('about_preview', { ...aboutPreview, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Read Story CTA Link Text
              </label>
              <input
                type="text"
                value={aboutPreview.link_text || ''}
                onChange={(e) => updateContent('about_preview', { ...aboutPreview, link_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Trust Strip Items (comma-separated)
              </label>
              <input
                type="text"
                value={(aboutPreview.trust_strip || ['']).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  updateContent('about_preview', { ...aboutPreview, trust_strip: arr });
                }}
                placeholder="10+ Yrs Quarrying, 25+ Nations"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          {/* 4 Pillars */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              The 4 Core Quarry & Processing Pillars
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(aboutPreview.pillars || [
                { num: "01", title: "Direct Quarry Sourcing", text: "Source premium natural stone directly from trusted quarries, ensuring better material selection, consistent quality, and reliable supply for every project." },
                { num: "02", title: "Zero-Deviation Slabs", text: "Precision natural stone slabs with controlled thickness and accurate dimensions, making fabrication and installation faster and more efficient." },
                { num: "03", title: "Dry-Lay & Vein Matching", text: "Every slab is carefully inspected, dry-laid, and book matched to create seamless patterns and visually balanced surfaces across luxury spaces." },
                { num: "04", title: "Expert Worthy Packaging", text: "Secure, export-ready packaging designed to protect premium marble and natural stone slabs during handling, transportation, and international delivery." }
              ]).map((p, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#0A4E9B] text-white text-[10px] font-bold flex items-center justify-center">
                      {p.num || `0${idx + 1}`}
                    </span>
                    <input
                      type="text"
                      placeholder="Pillar Title"
                      value={p.title || ''}
                      onChange={(e) => {
                        const newPillars = [...(aboutPreview.pillars || [])];
                        newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                        updateContent('about_preview', { ...aboutPreview, pillars: newPillars });
                      }}
                      className="flex-1 px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <textarea
                    rows="2"
                    placeholder="Pillar Description"
                    value={p.text || ''}
                    onChange={(e) => {
                      const newPillars = [...(aboutPreview.pillars || [])];
                      newPillars[idx] = { ...newPillars[idx], text: e.target.value };
                      updateContent('about_preview', { ...aboutPreview, pillars: newPillars });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: COLLECTIONS SHOWCASE PREVIEW & CARDS */}
      {/* ============================================================== */}
      {activeTab === 'collections_preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#0A4E9B]" />
              <span>Collections Showcase Section & Category Cards</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure the header banner and customized descriptions, badges, and cover images for each of the 9 stone collection cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge
              </label>
              <input
                type="text"
                value={collectionsPreview.badge || ''}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={collectionsPreview.heading || ''}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Subtitle
            </label>
            <textarea
              rows="2"
              value={collectionsPreview.description || ''}
              onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Top CTA Button Text
              </label>
              <input
                type="text"
                value={collectionsPreview.cta_text || ''}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, cta_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Top CTA Button Link
              </label>
              <input
                type="text"
                value={collectionsPreview.cta_link || ''}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, cta_link: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Bottom Full Inventory Button Text
              </label>
              <input
                type="text"
                value={collectionsPreview.bottom_cta_text || 'Explore Complete 250+ Stone Inventory in Main Catalog'}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, bottom_cta_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Bottom Full Inventory Button Link
              </label>
              <input
                type="text"
                value={collectionsPreview.bottom_cta_link || '/products'}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, bottom_cta_link: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* 9 Category Showcase Cards Editors */}
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0A4E9B]" />
              <span>Customize 9 Collection Showcase Cards</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(DEFAULT_CATEGORY_CARDS).map((catName) => {
                const card = categoryCardsMap[catName] || DEFAULT_CATEGORY_CARDS[catName];
                return (
                  <div key={catName} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-slate-900 block truncate">{catName}</span>
                    
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Badge</label>
                      <input
                        type="text"
                        value={card.specBadge || ''}
                        onChange={(e) => {
                          const updated = {
                            ...categoryCardsMap,
                            [catName]: { ...card, specBadge: e.target.value }
                          };
                          updateContent('collections_preview', { ...collectionsPreview, category_cards: updated });
                        }}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
                      <textarea
                        rows="2"
                        value={card.desc || ''}
                        onChange={(e) => {
                          const updated = {
                            ...categoryCardsMap,
                            [catName]: { ...card, desc: e.target.value }
                          };
                          updateContent('collections_preview', { ...collectionsPreview, category_cards: updated });
                        }}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>

                    <ImageUploader
                      label="Card Image"
                      value={card.image || ''}
                      onChange={(url) => {
                        const updated = {
                          ...categoryCardsMap,
                          [catName]: { ...card, image: url }
                        };
                        updateContent('collections_preview', { ...collectionsPreview, category_cards: updated });
                      }}
                      recommendedSize="600x400px"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SURFACE FINISHES PREVIEW */}
      {/* ============================================================== */}
      {activeTab === 'finishes_preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0A4E9B]" />
              <span>Surface Finishes Section Preview</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Highlights 3 premier finishes (e.g. Polished, Flamed, Honed) on the home page with quick links to the full Finishes Guide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Badge
              </label>
              <input
                type="text"
                value={finishesPreview.badge || ''}
                onChange={(e) => updateContent('finishes_preview', { ...finishesPreview, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={finishesPreview.heading || ''}
                onChange={(e) => updateContent('finishes_preview', { ...finishesPreview, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Subtitle
            </label>
            <textarea
              rows="2"
              value={finishesPreview.description || ''}
              onChange={(e) => updateContent('finishes_preview', { ...finishesPreview, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={finishesPreview.cta_text || ''}
                onChange={(e) => updateContent('finishes_preview', { ...finishesPreview, cta_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={finishesPreview.cta_link || ''}
                onChange={(e) => updateContent('finishes_preview', { ...finishesPreview, cta_link: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* 3 Showcase Finishes */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              The 3 Featured Stone Finishes Cards
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(finishesPreview.items || [
                { title: "Polished Finish", tag: "High Gloss (85° - 95°)", image: "/images/finish-polished.jpg", description: "Diamond abrasive polishing lines produce a mirror-like high reflective luster.", category: "Flooring, Walls & Slabs", link: "/finishes" },
                { title: "Flamed / Thermal Finish", tag: "High Traction Non-Slip", image: "/images/finish-flamed.jpg", description: "High-temperature torching bursts surface quartz grains.", category: "Paving, Pathways & Decks", link: "/finishes" },
                { title: "Honed Finish", tag: "Smooth Velvet Matte", image: "/images/finish-honed.jpg", description: "Satin-smooth matte grinding delivers an understated surface.", category: "Bathrooms & Modern Interiors", link: "/finishes" }
              ]).map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#0A4E9B]">Finish {idx + 1}</span>
                    <input
                      type="text"
                      placeholder="Tag"
                      value={item.tag || ''}
                      onChange={(e) => {
                        const newItems = [...(finishesPreview.items || [])];
                        newItems[idx] = { ...newItems[idx], tag: e.target.value };
                        updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                      }}
                      className="px-2 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-right"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Finish Title"
                    value={item.title || ''}
                    onChange={(e) => {
                      const newItems = [...(finishesPreview.items || [])];
                      newItems[idx] = { ...newItems[idx], title: e.target.value };
                      updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                    }}
                    className="w-full px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded"
                  />

                  <textarea
                    rows="2"
                    placeholder="Finish Description"
                    value={item.description || ''}
                    onChange={(e) => {
                      const newItems = [...(finishesPreview.items || [])];
                      newItems[idx] = { ...newItems[idx], description: e.target.value };
                      updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                  />

                  <ImageUploader
                    label="Finish Cover Photo"
                    value={item.image}
                    onChange={(url) => {
                      const newItems = [...(finishesPreview.items || [])];
                      newItems[idx] = { ...newItems[idx], image: url };
                      updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                    }}
                    recommendedSize="600x400px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: WHY CHOOSE ARPRAN (4 CORE PILLARS) */}
      {/* ============================================================== */}
      {activeTab === 'why_choose' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0A4E9B]" />
              <span>Section 5: Why Leading Architects & Builders Trust ARPRAN</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure the 4 core capability pillars (Direct Quarry Ownership, Zero-Deviation Gangsaw, Dry-Lay Vein Matching, ISPM-15 Crating).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={whyChoose.badge || 'Architectural Partnership & Advantage'}
                onChange={(e) => updateContent('why_choose', { ...whyChoose, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label>
                Section Heading
              </label>
              <input
                type="text"
                value={whyChoose.heading || 'Why Leading Architects & Builders Trust ARPRAN'}
                onChange={(e) => updateContent('why_choose', { ...whyChoose, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Paragraph
            </label>
            <textarea
              rows="2"
              value={whyChoose.description || ''}
              onChange={(e) => updateContent('why_choose', { ...whyChoose, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          {/* 4 Pillars */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              The 4 Architectural Trust Pillars
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(whyChoose.pillars || [
                { num: "01", title: "Direct Quarry Ownership", badge: "Direct Origin", description: "Private mining leases across Makrana, Rajsamand, Jodhpur & Southern granite belts guarantee genuine color continuity, zero broker markups, and monolithic block integrity.", checkpoints: ["100% Traceable Quarry Sourcing", "Consistent Veining & Texture"] },
                { num: "02", title: "Zero-Deviation Gangsaw", badge: "±1mm Tolerance", description: "Computerized diamond multi-wire gangsaws slice calibrated slabs to exact millimeter specs. Zero thickness deviation prevents uneven floor lips and ensures flush facade cladding.", checkpoints: ["Calibrated 18mm / 20mm / 30mm", "Diamond Polish Up to 95° Gloss"] },
                { num: "03", title: "Dry-Lay & Vein Matching", badge: "Pre-Inspection", description: "Every sequence is dry-laid in our Jaipur inspection facility before dispatch. Slabs are bookmatched, numbered sequentially, and high-res video proof is shared for client sign-off.", checkpoints: ["Bookmatched Sequence Numbering", "Zero Hairline Crack Guarantee"] },
                { num: "04", title: "ISPM-15 Seaworthy Crating", badge: "Port Dispatch", description: "Heavy-duty pine A-frames, fumigation certified, waterproof plastic shrink-wrap, and steel banding safeguard slabs for transit from Mundra Port to job sites across 25+ countries.", checkpoints: ["Fumigated Seaworthy Packaging", "Direct Mundra / Nhava Sheva Ports"] }
              ]).map((p, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#B89047] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {p.num || `0${idx + 1}`}
                    </span>
                    <input
                      type="text"
                      placeholder="Title"
                      value={p.title || ''}
                      onChange={(e) => {
                        const newPillars = [...(whyChoose.pillars || [])];
                        newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                        updateContent('why_choose', { ...whyChoose, pillars: newPillars });
                      }}
                      className="flex-1 px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Badge"
                      value={p.badge || ''}
                      onChange={(e) => {
                        const newPillars = [...(whyChoose.pillars || [])];
                        newPillars[idx] = { ...newPillars[idx], badge: e.target.value };
                        updateContent('why_choose', { ...whyChoose, pillars: newPillars });
                      }}
                      className="w-24 px-2 py-1 text-[10px] bg-white border border-slate-300 rounded text-right"
                    />
                  </div>

                  <textarea
                    rows="2"
                    placeholder="Pillar Description"
                    value={p.description || ''}
                    onChange={(e) => {
                      const newPillars = [...(whyChoose.pillars || [])];
                      newPillars[idx] = { ...newPillars[idx], description: e.target.value };
                      updateContent('why_choose', { ...whyChoose, pillars: newPillars });
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                  />

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Checklist Items (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(p.checkpoints || []).join(', ')}
                      onChange={(e) => {
                        const newPillars = [...(whyChoose.pillars || [])];
                        newPillars[idx] = {
                          ...newPillars[idx],
                          checkpoints: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        };
                        updateContent('why_choose', { ...whyChoose, pillars: newPillars });
                      }}
                      className="w-full px-2 py-1 text-[11px] bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: ARCHITECTURAL SAMPLE BOX & STUDIO KIT */}
      {/* ============================================================== */}
      {activeTab === 'sample_box' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#0A4E9B]" />
              <span>Architectural Stone Sample Box & Studio Kit Callout</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure the luxury sample box callout, bullet benefits, CTA buttons, and the 4 specimen stone swatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge
              </label>
              <input
                type="text"
                value={sampleBox.badge || 'Architect & Builder Exclusive Service'}
                onChange={(e) => updateContent('why_choose', {
                  ...whyChoose,
                  sample_box: { ...sampleBox, badge: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Title Heading
              </label>
              <input
                type="text"
                value={sampleBox.title || 'Request an Architectural Stone Sample Box'}
                onChange={(e) => updateContent('why_choose', {
                  ...whyChoose,
                  sample_box: { ...sampleBox, title: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Paragraph
            </label>
            <textarea
              rows="3"
              value={sampleBox.description || ''}
              onChange={(e) => updateContent('why_choose', {
                ...whyChoose,
                sample_box: { ...sampleBox, description: e.target.value }
              })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              4 Bullet Benefits (one per line)
            </label>
            <textarea
              rows="4"
              value={(sampleBox.bullets || [
                'Real quarried slab cuts (150×150×20mm)',
                'Side-by-side surface finish comparison',
                'Physical ASTM / CE technical test reports',
                'Express international courier delivery'
              ]).join('\n')}
              onChange={(e) => updateContent('why_choose', {
                ...whyChoose,
                sample_box: {
                  ...sampleBox,
                  bullets: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                }
              })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sample Request Button Text
              </label>
              <input
                type="text"
                value={sampleBox.cta_button_text || 'Request Free Sample Box'}
                onChange={(e) => updateContent('why_choose', {
                  ...whyChoose,
                  sample_box: { ...sampleBox, cta_button_text: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sample Request Button Link
              </label>
              <input
                type="text"
                value={sampleBox.cta_button_link || '/contact?subject=Sample+Box+Request'}
                onChange={(e) => updateContent('why_choose', {
                  ...whyChoose,
                  sample_box: { ...sampleBox, cta_button_link: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Catalogue Download Button Text
              </label>
              <input
                type="text"
                value={sampleBox.catalogue_button_text || 'Download E-Catalogue (PDF)'}
                onChange={(e) => updateContent('why_choose', {
                  ...whyChoose,
                  sample_box: { ...sampleBox, catalogue_button_text: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Catalogue Download Link / File
              </label>
              <input
                type="text"
                value={sampleBox.catalogue_button_link || '/brochure.pdf'}
                onChange={(e) => updateContent('why_choose', {
                  ...whyChoose,
                  sample_box: { ...sampleBox, catalogue_button_link: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Studio Kit Box Right Card Details */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Studio Kit Preview Card & 4 Sample Swatches
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Kit Title</label>
                <input
                  type="text"
                  value={sampleBox.studio_kit_title || 'ARPRAN Studio Kit'}
                  onChange={(e) => updateContent('why_choose', {
                    ...whyChoose,
                    sample_box: { ...sampleBox, studio_kit_title: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Dimensions Subtitle</label>
                <input
                  type="text"
                  value={sampleBox.studio_kit_subtitle || 'Specimen Dimensions: 150×150mm'}
                  onChange={(e) => updateContent('why_choose', {
                    ...whyChoose,
                    sample_box: { ...sampleBox, studio_kit_subtitle: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Footer Note</label>
                <input
                  type="text"
                  value={sampleBox.studio_kit_badge || 'Includes ASTM Physical Test Data Sheets'}
                  onChange={(e) => updateContent('why_choose', {
                    ...whyChoose,
                    sample_box: { ...sampleBox, studio_kit_badge: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Footer Badge</label>
                <input
                  type="text"
                  value={sampleBox.studio_kit_highlight || '100% Free for Architects'}
                  onChange={(e) => updateContent('why_choose', {
                    ...whyChoose,
                    sample_box: { ...sampleBox, studio_kit_highlight: e.target.value }
                  })}
                  className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                />
              </div>
            </div>

            {/* 4 Swatches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {(sampleBox.swatches || [
                { name: 'Makrana White', tag: 'High Gloss', subtitle: 'Mirror Polish 90°+', image: '/images/finish-polished.jpg' },
                { name: 'Black Galaxy', tag: 'Non-Slip R11', subtitle: 'Thermal Flamed', image: '/images/finish-flamed.jpg' },
                { name: 'Kandla Grey', tag: 'Velvet Matte', subtitle: 'Satin Honed', image: '/images/finish-honed.jpg' },
                { name: 'Tan Brown', tag: 'Tactile', subtitle: 'Leather Touch', image: '/images/blog-granite.jpg' }
              ]).map((swatch, sidx) => (
                <div key={sidx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Swatch {sidx + 1}</span>
                  <input
                    type="text"
                    placeholder="Stone Name"
                    value={swatch.name || ''}
                    onChange={(e) => {
                      const newSwatches = [...(sampleBox.swatches || [])];
                      newSwatches[sidx] = { ...newSwatches[sidx], name: e.target.value };
                      updateContent('why_choose', {
                        ...whyChoose,
                        sample_box: { ...sampleBox, swatches: newSwatches }
                      });
                    }}
                    className="w-full px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Tag (e.g. High Gloss)"
                    value={swatch.tag || ''}
                    onChange={(e) => {
                      const newSwatches = [...(sampleBox.swatches || [])];
                      newSwatches[sidx] = { ...newSwatches[sidx], tag: e.target.value };
                      updateContent('why_choose', {
                        ...whyChoose,
                        sample_box: { ...sampleBox, swatches: newSwatches }
                      });
                    }}
                    className="w-full px-2 py-1 text-[11px] bg-white border border-slate-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={swatch.subtitle || ''}
                    onChange={(e) => {
                      const newSwatches = [...(sampleBox.swatches || [])];
                      newSwatches[sidx] = { ...newSwatches[sidx], subtitle: e.target.value };
                      updateContent('why_choose', {
                        ...whyChoose,
                        sample_box: { ...sampleBox, swatches: newSwatches }
                      });
                    }}
                    className="w-full px-2 py-1 text-[11px] bg-white border border-slate-300 rounded"
                  />
                  <ImageUploader
                    label="Swatch Image"
                    value={swatch.image}
                    onChange={(url) => {
                      const newSwatches = [...(sampleBox.swatches || [])];
                      newSwatches[sidx] = { ...newSwatches[sidx], image: url };
                      updateContent('why_choose', {
                        ...whyChoose,
                        sample_box: { ...sampleBox, swatches: newSwatches }
                      });
                    }}
                    recommendedSize="200x200px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: BLOG & JOURNAL PREVIEW */}
      {/* ============================================================== */}
      {activeTab === 'blog_preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0A4E9B]" />
              <span>Architectural Stone Journal Preview Section</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Controls the title, subtitle, and CTA link above the latest articles shown on the home page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge
              </label>
              <input
                type="text"
                value={blogPreview.badge || ''}
                onChange={(e) => updateContent('blog_preview', { ...blogPreview, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={blogPreview.heading || ''}
                onChange={(e) => updateContent('blog_preview', { ...blogPreview, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Subtitle
            </label>
            <textarea
              rows="2"
              value={blogPreview.description || ''}
              onChange={(e) => updateContent('blog_preview', { ...blogPreview, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={blogPreview.cta_text || ''}
                onChange={(e) => updateContent('blog_preview', { ...blogPreview, cta_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={blogPreview.cta_link || ''}
                onChange={(e) => updateContent('blog_preview', { ...blogPreview, cta_link: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes to Home Page</span>
        </button>
      </div>

    </div>
  );
}
