import React, { useState, useEffect } from 'react';
import {
  Save, CheckCircle2, AlertCircle, Loader2, Sparkles,
  Layers, Building, HelpCircle, Eye, ArrowRight, Grid, Award, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';

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
    { id: 'hero_card', label: '1. Highlight Story & Quick Stats Section', icon: Sparkles },
    { id: 'about_preview', label: '2. About Preview & 4 Pillars', icon: Building },
    { id: 'collections_preview', label: '3. Collections Showcase', icon: Grid },
    { id: 'finishes_preview', label: '4. Surface Finishes Preview', icon: Layers },
    { id: 'blog_preview', label: '5. Blog & Journal Preview', icon: Award }
  ];

  return (
    <div className="space-y-6">

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Home Page Content & Sections Editor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage every section on the homepage: hero information card, counter stats, about preview, pillars, collections banner, finishes showcase, and blog preview.
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
      {/* TAB 1: HERO RIGHT CARD & STATS */}
      {/* ============================================================== */}
      {activeTab === 'hero_card' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
              <span>Hero Right Overlay Card & Quick Metrics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              This is the high-luxury glass card floating over the hero slider, plus the 4 quick counter metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Badge Pill Text
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
                Card Main Title
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
                Card Subtitle / Category
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
                Brand Motto
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
              Description Text
            </label>
            <textarea
              rows="3"
              value={heroCard.description || ''}
              onChange={(e) => updateContent('hero_card', { ...heroCard, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary Button Text
              </label>
              <input
                type="text"
                value={heroCard.button_text || ''}
                onChange={(e) => updateContent('hero_card', { ...heroCard, button_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary Button Link
              </label>
              <input
                type="text"
                value={heroCard.button_link || ''}
                onChange={(e) => updateContent('hero_card', { ...heroCard, button_link: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4 Floating Stats / Metrics
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(heroCard.metrics || [
                { value: "12", label: "Collections" },
                { value: "250+", label: "Varieties" },
                { value: "10+ Yrs", label: "Heritage" },
                { value: "Global", label: "Export" }
              ]).map((m, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
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
              <span>About Section Preview & 4 Pillars of Excellence</span>
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

          {/* 4 Pillars */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              The 4 Core Quarry & Processing Pillars
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(aboutPreview.pillars || [
                { num: "01", title: "Quarry Direct Control", text: "Direct extraction rights across Makrana, Rajsamand, Jodhpur, and South Indian granite belts." },
                { num: "02", title: "Diamond Gangsaw Precision", text: "Calibrated slabs sliced with computerized wire and diamond blades for zero thickness deviation." },
                { num: "03", title: "Strict Quality Inspection", text: "Every slab is dry-inspected for hairline fractures, natural veining consistency, and gloss caliber." },
                { num: "04", title: "Seaworthy Export Crating", text: "Fumigated wooden A-frames and plastic wrapped bundles dispatched directly to Mundra Port." }
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
      {/* TAB 3: COLLECTIONS SHOWCASE PREVIEW */}
      {/* ============================================================== */}
      {activeTab === 'collections_preview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#0A4E9B]" />
              <span>12 Collections Showcase Banner</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Controls the title, subtitle, and CTA button above the 12 stone collections grid on the home page.
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
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
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
              value={collectionsPreview.description || ''}
              onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, description: e.target.value })}
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
                value={collectionsPreview.cta_text || ''}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, cta_text: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={collectionsPreview.cta_link || ''}
                onChange={(e) => updateContent('collections_preview', { ...collectionsPreview, cta_link: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
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
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
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
              value={finishesPreview.description || ''}
              onChange={(e) => updateContent('finishes_preview', { ...finishesPreview, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>

          {/* 3 Featured Finish Cards */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3 Featured Finish Cards
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(finishesPreview.items || [
                {
                  title: "Polished Finish",
                  tag: "High Gloss (85° - 95°)",
                  image: "/images/finish-polished.jpg",
                  description: "Diamond abrasive polishing lines produce a mirror-like high reflective luster that intensifies natural veining and rich mineral coloration.",
                  category: "Flooring, Walls & Slabs",
                  link: "/finishes"
                },
                {
                  title: "Flamed / Thermal Finish",
                  tag: "High Traction Non-Slip",
                  image: "/images/finish-flamed.jpg",
                  description: "High-temperature oxy-acetylene torching bursts surface quartz grains, creating a rugged tactile slip-resistant exterior texture.",
                  category: "Paving, Pathways & Decks",
                  link: "/finishes"
                },
                {
                  title: "Honed Finish",
                  tag: "Smooth Velvet Matte",
                  image: "/images/finish-honed.jpg",
                  description: "Satin-smooth matte grinding delivers an understated contemporary surface with zero glare and exceptional tactile warmth.",
                  category: "Bathrooms & Modern Interiors",
                  link: "/finishes"
                }
              ]).map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="h-28 rounded-lg overflow-hidden bg-slate-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Image URL</label>
                    <input
                      type="text"
                      value={item.image || ''}
                      onChange={(e) => {
                        const newItems = [...(finishesPreview.items || [])];
                        newItems[idx] = { ...newItems[idx], image: e.target.value };
                        updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                      }}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...(finishesPreview.items || [])];
                        newItems[idx] = { ...newItems[idx], title: e.target.value };
                        updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                      }}
                      className="w-full px-2 py-1 text-xs font-bold bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Tag</label>
                    <input
                      type="text"
                      value={item.tag || ''}
                      onChange={(e) => {
                        const newItems = [...(finishesPreview.items || [])];
                        newItems[idx] = { ...newItems[idx], tag: e.target.value };
                        updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                      }}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Description</label>
                    <textarea
                      rows="2"
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...(finishesPreview.items || [])];
                        newItems[idx] = { ...newItems[idx], description: e.target.value };
                        updateContent('finishes_preview', { ...finishesPreview, items: newItems });
                      }}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: BLOG & JOURNAL PREVIEW */}
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
