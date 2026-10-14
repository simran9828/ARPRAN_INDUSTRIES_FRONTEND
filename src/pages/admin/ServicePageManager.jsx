import React, { useState, useEffect } from 'react';
import {
  Save, CheckCircle2, AlertCircle, Loader2, Sparkles,
  Layers, ExternalLink, HelpCircle, Plus, Trash2, ShieldCheck,
  Check, Factory, Award, ChevronDown, Globe, Link2, Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

export default function ServicePageManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState('granite-series');
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copiedUrl, setCopiedUrl] = useState('');

  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/services');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setServices(json.data);
          if (json.data.length > 0 && !selectedSlug) {
            setSelectedSlug(json.data[0].slug);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const activeService = services.find(s => s.slug === selectedSlug) || services[0] || null;

  const updateActiveField = (field, value) => {
    if (!activeService) return;
    setServices(services.map(s => {
      if (s.slug === activeService.slug) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const updateActiveContent = (contentKey, value) => {
    if (!activeService) return;
    const currentContent = activeService.content || {};
    const updatedContent = { ...currentContent, [contentKey]: value };
    updateActiveField('content', updatedContent);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!activeService) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch(`/api/admin/services/${activeService.slug}`, {
        method: 'PUT',
        body: activeService
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save service detail page');
      }

      await refreshCMS();
      setMessage({ type: 'success', text: `Saved "${activeService.title}" page! Live on website.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
        Loading Stone Category & Service Pages...
      </div>
    );
  }

  if (!activeService) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
        No service detail pages found in database.
      </div>
    );
  }

  const content = activeService.content || {};
  const trustBadges = content.trustBadges || [];
  const whatIs = content.whatIs || {};
  const whatWeProvide = content.whatWeProvide || {};
  const faqs = content.faqs || [];

  const editorTabs = [
    { id: 'hero', label: '1. Hero & Badges', icon: Sparkles },
    { id: 'whatIs', label: '2. "What Is" & Specs', icon: Layers },
    { id: 'capabilities', label: '3. What We Provide', icon: Factory },
    { id: 'faqs', label: `4. Architectural FAQs (${faqs.length})`, icon: HelpCircle }
  ];

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Category & Service Detail Pages Editor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the rich architectural guides, technical laboratory parameters, manufacturing capabilities, and FAQs for all 12 stone collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/products/${activeService.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#0A4E9B]" />
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Live Changes</span>
          </button>
        </div>
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

      {/* Stone Category Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
          Select Stone Category To Edit:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {services.map((s) => {
            const isSelected = s.slug === activeService.slug;
            return (
              <button
                key={s.slug}
                onClick={() => { setSelectedSlug(s.slug); setMessage({ type: '', text: '' }); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${isSelected
                    ? 'bg-[#0A4E9B] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <span>{s.title}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {editorTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: HERO & BADGES */}
      {/* ============================================================== */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
              <span>Hero Header Banner & Trust Badges ({activeService.title})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top showcase banner displayed at the head of the service detail page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category Title
              </label>
              <input
                type="text"
                value={activeService.title || ''}
                onChange={(e) => updateActiveField('title', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Main Architectural H1 Heading
              </label>
              <input
                type="text"
                value={activeService.h1 || ''}
                onChange={(e) => updateActiveField('h1', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={activeService.tagline || ''}
              onChange={(e) => updateActiveField('tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Hero Introduction Paragraph
            </label>
            <textarea
              rows="3"
              value={activeService.hero_description || activeService.heroDescription || ''}
              onChange={(e) => {
                updateActiveField('hero_description', e.target.value);
                updateActiveField('heroDescription', e.target.value);
              }}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          {/* 4 Trust Badges */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4 Architectural Trust Badges
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#0A4E9B] shrink-0" />
                  <input
                    type="text"
                    placeholder={`Badge ${idx + 1}`}
                    value={trustBadges[idx] || ''}
                    onChange={(e) => {
                      const newBadges = [...trustBadges];
                      newBadges[idx] = e.target.value;
                      updateActiveContent('trustBadges', newBadges);
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: WHAT IS NATURAL STONE & SPECS */}
      {/* ============================================================== */}
      {activeTab === 'whatIs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0A4E9B]" />
              <span>"What is" Section & Physical Laboratory Specifications</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Geological formation breakdown and physical ASTM/EN test thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={whatIs.title || ''}
                onChange={(e) => updateActiveContent('whatIs', { ...whatIs, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={whatIs.subtitle || ''}
                onChange={(e) => updateActiveContent('whatIs', { ...whatIs, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Material Story Paragraphs
            </label>
            {(whatIs.paragraphs || ['', '', '']).map((para, idx) => (
              <div key={idx}>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Paragraph {idx + 1}</span>
                <textarea
                  rows="3"
                  value={para}
                  onChange={(e) => {
                    const newParas = [...(whatIs.paragraphs || [])];
                    newParas[idx] = e.target.value;
                    updateActiveContent('whatIs', { ...whatIs, paragraphs: newParas });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            ))}
          </div>

          {/* 4 Laboratory Specs */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4 Physical Testing Parameters (ASTM / EN Standards)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(whatIs.specs || [
                { label: "Compressive Strength", value: "180 - 240 MPa" },
                { label: "Water Absorption", value: "< 0.15% by weight" },
                { label: "Mohs Hardness", value: "6.0 - 7.0" },
                { label: "Density", value: "2.65 - 2.85 g/cm³" }
              ]).map((spec, sIdx) => (
                <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <input
                    type="text"
                    placeholder="Parameter (e.g. Density)"
                    value={spec.label || ''}
                    onChange={(e) => {
                      const newSpecs = [...(whatIs.specs || [])];
                      newSpecs[sIdx] = { ...newSpecs[sIdx], label: e.target.value };
                      updateActiveContent('whatIs', { ...whatIs, specs: newSpecs });
                    }}
                    className="w-full px-2 py-1 text-[11px] font-bold bg-white border border-slate-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 2.65 g/cm³)"
                    value={spec.value || ''}
                    onChange={(e) => {
                      const newSpecs = [...(whatIs.specs || [])];
                      newSpecs[sIdx] = { ...newSpecs[sIdx], value: e.target.value };
                      updateActiveContent('whatIs', { ...whatIs, specs: newSpecs });
                    }}
                    className="w-full px-2 py-1 text-xs text-[#0A4E9B] font-bold bg-white border border-slate-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: WHAT WE PROVIDE (CAPABILITIES) */}
      {/* ============================================================== */}
      {activeTab === 'capabilities' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#0A4E9B]" />
              <span>Manufacturing & Export Capabilities</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              The 6 specific capabilities (e.g. Gangsaw slicing, custom cut-to-size, dry lay, packaging).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={whatWeProvide.title || ''}
                onChange={(e) => updateActiveContent('whatWeProvide', { ...whatWeProvide, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Subtitle
              </label>
              <input
                type="text"
                value={whatWeProvide.subtitle || ''}
                onChange={(e) => updateActiveContent('whatWeProvide', { ...whatWeProvide, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* 6 Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {(whatWeProvide.items || []).map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#0A4E9B]">
                  Capability {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder="Capability Title"
                  value={item.title || ''}
                  onChange={(e) => {
                    const newItems = [...(whatWeProvide.items || [])];
                    newItems[idx] = { ...newItems[idx], title: e.target.value };
                    updateActiveContent('whatWeProvide', { ...whatWeProvide, items: newItems });
                  }}
                  className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                />
                <textarea
                  rows="2"
                  placeholder="Capability Description"
                  value={item.description || ''}
                  onChange={(e) => {
                    const newItems = [...(whatWeProvide.items || [])];
                    newItems[idx] = { ...newItems[idx], description: e.target.value };
                    updateActiveContent('whatWeProvide', { ...whatWeProvide, items: newItems });
                  }}
                  className="w-full px-2.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ARCHITECTURAL & EXPORT FAQS */}
      {/* ============================================================== */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0A4E9B]" />
                <span>Technical & Export FAQs ({faqs.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Frequently asked questions for architects, specifiers, and container importers.
              </p>
            </div>

            <button
              onClick={() => {
                const newFaqs = [...faqs, { question: 'New Question?', answer: 'Answer details...' }];
                updateActiveContent('faqs', newFaqs);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Q{idx + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newFaqs = faqs.filter((_, i) => i !== idx);
                      updateActiveContent('faqs', newFaqs);
                    }}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                    title="Remove FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question || ''}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx] = { ...newFaqs[idx], question: e.target.value };
                    updateActiveContent('faqs', newFaqs);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg"
                />
                <textarea
                  rows="3"
                  placeholder="Answer"
                  value={faq.answer || ''}
                  onChange={(e) => {
                    const newFaqs = [...faqs];
                    newFaqs[idx] = { ...newFaqs[idx], answer: e.target.value };
                    updateActiveContent('faqs', newFaqs);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg leading-relaxed text-slate-700"
                />
              </div>
            ))}
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
          <span>Save Changes to {activeService.title}</span>
        </button>
      </div>

    </div>
  );
}
