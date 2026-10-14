import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles, Building, Compass, Factory, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AboutManager() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await authFetch('/api/admin/about');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setPageData(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load about page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, [authFetch]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/about', {
        method: 'PUT',
        body: pageData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update About page');
      }

      if (refreshCMS) await refreshCMS();
      setMessage({ type: 'success', text: 'About Us page content updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
        Loading About Us content...
      </div>
    );
  }

  const content = pageData?.content || {};
  const genesis = content.genesis || {};
  const pillars = content.pillars || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            About Us & Quarry Heritage Editor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit the company genesis story, 4 pillars of excellence, factory details, and mission statement.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
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

      <form onSubmit={handleSave} className="space-y-8">

        {/* Section 1: Hero Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-[#0A4E9B]" />
            <span>1. Page Header & Introduction</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Main H1 Heading
              </label>
              <input
                type="text"
                value={pageData.h1 || ''}
                onChange={(e) => setPageData({ ...pageData, h1: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Page Title (Browser Tag)
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
              Header Subtitle / Tagline
            </label>
            <textarea
              rows="2"
              value={pageData.tagline || ''}
              onChange={(e) => setPageData({ ...pageData, tagline: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
            />
          </div>
        </div>

        {/* Section 2: Genesis & Mission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
            <span>2. Genesis, Mission & Story Details</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={genesis.badge || ''}
                  onChange={(e) => {
                    const newContent = { ...content, genesis: { ...genesis, badge: e.target.value } };
                    setPageData({ ...pageData, content: newContent });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Section Subheading
                </label>
                <input
                  type="text"
                  value={genesis.heading || ''}
                  onChange={(e) => {
                    const newContent = { ...content, genesis: { ...genesis, heading: e.target.value } };
                    setPageData({ ...pageData, content: newContent });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company Story (Paragraph 1)
                </label>
                <textarea
                  rows="3"
                  value={genesis.paragraphs?.[0] || ''}
                  onChange={(e) => {
                    const p = [...(genesis.paragraphs || [])];
                    p[0] = e.target.value;
                    const newContent = { ...content, genesis: { ...genesis, paragraphs: p } };
                    setPageData({ ...pageData, content: newContent });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company Story (Paragraph 2 - Processing & Machinery)
                </label>
                <textarea
                  rows="3"
                  value={genesis.paragraphs?.[1] || ''}
                  onChange={(e) => {
                    const p = [...(genesis.paragraphs || [])];
                    p[1] = e.target.value;
                    const newContent = { ...content, genesis: { ...genesis, paragraphs: p } };
                    setPageData({ ...pageData, content: newContent });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company Story (Paragraph 3 - Melbourne & Global Logistics)
                </label>
                <textarea
                  rows="3"
                  value={genesis.paragraphs?.[2] || ''}
                  onChange={(e) => {
                    const p = [...(genesis.paragraphs || [])];
                    p[2] = e.target.value;
                    const newContent = { ...content, genesis: { ...genesis, paragraphs: p } };
                    setPageData({ ...pageData, content: newContent });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A4E9B]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="About Section Feature Image"
                value={genesis.image || ''}
                onChange={(url) => {
                  const newContent = { ...content, genesis: { ...genesis, image: url } };
                  setPageData({ ...pageData, content: newContent });
                }}
                recommendedSize="1000x800px (Gangsaw Facility)"
              />

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-700 block">Heritage Metrics</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Stat 1</span>
                    <input
                      type="text"
                      value={genesis.stats?.[0]?.number || '10+ Yrs'}
                      onChange={(e) => {
                        const st = [...(genesis.stats || [])];
                        st[0] = { ...st[0], number: e.target.value };
                        setPageData({ ...pageData, content: { ...content, genesis: { ...genesis, stats: st } } });
                      }}
                      className="w-full px-2 py-1 text-xs border rounded bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Stat 2</span>
                    <input
                      type="text"
                      value={genesis.stats?.[1]?.number || '250+'}
                      onChange={(e) => {
                        const st = [...(genesis.stats || [])];
                        st[1] = { ...st[1], number: e.target.value };
                        setPageData({ ...pageData, content: { ...content, genesis: { ...genesis, stats: st } } });
                      }}
                      className="w-full px-2 py-1 text-xs border rounded bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Stat 3</span>
                    <input
                      type="text"
                      value={genesis.stats?.[2]?.number || '100%'}
                      onChange={(e) => {
                        const st = [...(genesis.stats || [])];
                        st[2] = { ...st[2], number: e.target.value };
                        setPageData({ ...pageData, content: { ...content, genesis: { ...genesis, stats: st } } });
                      }}
                      className="w-full px-2 py-1 text-xs border rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: 4 Pillars of Excellence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Factory className="w-4 h-4 text-[#0A4E9B]" />
            <span>3. 4 Pillars of Architectural Precision</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#0A4E9B] tracking-wider">
                  Pillar {idx + 1}
                </span>
                <input
                  type="text"
                  value={pillar.title || ''}
                  onChange={(e) => {
                    const newPillars = [...pillars];
                    newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                    setPageData({ ...pageData, content: { ...content, pillars: newPillars } });
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <textarea
                  rows="3"
                  value={pillar.description || ''}
                  onChange={(e) => {
                    const newPillars = [...pillars];
                    newPillars[idx] = { ...newPillars[idx], description: e.target.value };
                    setPageData({ ...pageData, content: { ...content, pillars: newPillars } });
                  }}
                  className="w-full px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Dual Global Hubs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Compass className="w-4 h-4 text-[#0A4E9B]" />
            <span>4. Manufacturing & Export Hubs (Jaipur & Mundra Port)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Badge
              </label>
              <input
                type="text"
                value={content.hubs?.badge || 'Global Footprint'}
                onChange={(e) => {
                  const newContent = { ...content, hubs: { ...(content.hubs || {}), badge: e.target.value } };
                  setPageData({ ...pageData, content: newContent });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={content.hubs?.heading || 'Integrated Quarry Mining & Ocean Export Logistics'}
                onChange={(e) => {
                  const newContent = { ...content, hubs: { ...(content.hubs || {}), heading: e.target.value } };
                  setPageData({ ...pageData, content: newContent });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Text
            </label>
            <textarea
              rows="2"
              value={content.hubs?.description || ''}
              onChange={(e) => {
                const newContent = { ...content, hubs: { ...(content.hubs || {}), description: e.target.value } };
                setPageData({ ...pageData, content: newContent });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Jaipur Processing Division Functions
              </label>
              <input
                type="text"
                value={content.hubs?.jaipur_functions || 'Block Quarrying, Gangsaw Slicing, Surface Treatments, QC & Container Stuffing'}
                onChange={(e) => {
                  const newContent = { ...content, hubs: { ...(content.hubs || {}), jaipur_functions: e.target.value } };
                  setPageData({ ...pageData, content: newContent });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mundra Port & Global Freight Gateway Functions
              </label>
              <input
                type="text"
                value={content.hubs?.mundra_functions || 'Customs Clearance, Vessel Booking, Seaworthy A-Frame Packaging & Global Port Delivery'}
                onChange={(e) => {
                  const newContent = { ...content, hubs: { ...(content.hubs || {}), mundra_functions: e.target.value } };
                  setPageData({ ...pageData, content: newContent });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Quality Accreditations & Standards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-[#0A4E9B]" />
            <span>5. Quality Accreditations & Standards</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Accreditations Heading
              </label>
              <input
                type="text"
                value={content.accreditations?.heading || 'Quality Accreditations & Standards'}
                onChange={(e) => {
                  const newContent = { ...content, accreditations: { ...(content.accreditations || {}), heading: e.target.value } };
                  setPageData({ ...pageData, content: newContent });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Brochure Download Link
              </label>
              <input
                type="text"
                value={content.accreditations?.brochure_link || '/brochure.pdf'}
                onChange={(e) => {
                  const newContent = { ...content, accreditations: { ...(content.accreditations || {}), brochure_link: e.target.value } };
                  setPageData({ ...pageData, content: newContent });
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Accreditations Description
            </label>
            <textarea
              rows="2"
              value={content.accreditations?.description || ''}
              onChange={(e) => {
                const newContent = { ...content, accreditations: { ...(content.accreditations || {}), description: e.target.value } };
                setPageData({ ...pageData, content: newContent });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save About Page</span>
          </button>
        </div>

      </form>

    </div>
  );
}
