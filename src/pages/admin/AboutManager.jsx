import React, { useState, useEffect } from 'react';
import {
  Save, CheckCircle2, AlertCircle, Loader2, Sparkles,
  Building, Compass, Factory, ShieldCheck, Layers, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';

const TABS = [
  { id: 'header', label: '1. Header & Mission', icon: Building },
  { id: 'genesis', label: '2. Story & Heritage', icon: Sparkles },
  { id: 'pillars', label: '3. 4 Pillars', icon: Factory },
  { id: 'process', label: '4. 12-Stage Process', icon: Layers },
  { id: 'hubs', label: '5. Export Hubs', icon: Compass },
  { id: 'accreditations', label: '6. Accreditations', icon: ShieldCheck },
];

export default function AboutManager() {
  const [activeTab, setActiveTab] = useState('header');
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
    if (e) e.preventDefault();
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
  const mission = content.mission || {};
  const pillars = content.pillars || [];
  const workProcess = content.workProcess || [];
  const hubs = content.hubs || {};
  const accreditations = content.accreditations || {};

  const updateContent = (key, val) => {
    setPageData(prev => ({
      ...prev,
      content: {
        ...(prev?.content || {}),
        [key]: val
      }
    }));
  };

  return (
    <div className="space-y-6">

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            About Us & Quarry Heritage CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit company genesis, mission statement, 4 pillars of excellence, 12-stage work process, and export hubs.
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

      {/* Notification banner */}
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

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#0A4E9B] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Header & Mission */}
      {activeTab === 'header' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0A4E9B]" />
              <span>Page SEO Header & Mission Banner</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Configure the main page titles and the dark mission section shown at the top of the About page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Main H1 Tag
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
                Page Title (Browser Window / Tab)
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

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A4E9B]">
              Mission Banner Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mission Heading
                </label>
                <input
                  type="text"
                  value={mission.heading || 'About '}
                  onChange={(e) => updateContent('mission', { ...mission, heading: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mission Statement Paragraph
                </label>
                <textarea
                  rows="3"
                  value={mission.statement || ''}
                  onChange={(e) => updateContent('mission', { ...mission, statement: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Genesis & Heritage */}
      {activeTab === 'genesis' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
              <span>Genesis Story, Paragraphs & Heritage Metrics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Edit the main story copy and stone sample showcase image.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Section Badge
                  </label>
                  <input
                    type="text"
                    value={genesis.badge || ''}
                    onChange={(e) => updateContent('genesis', { ...genesis, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Section Main Heading
                  </label>
                  <input
                    type="text"
                    value={genesis.heading || ''}
                    onChange={(e) => updateContent('genesis', { ...genesis, heading: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Story Paragraph 1 (Introduction & Commitment)
                </label>
                <textarea
                  rows="3"
                  value={genesis.paragraphs?.[0] || ''}
                  onChange={(e) => {
                    const p = [...(genesis.paragraphs || [])];
                    p[0] = e.target.value;
                    updateContent('genesis', { ...genesis, paragraphs: p });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Story Paragraph 2 (Architectural Surfaces & Quality)
                </label>
                <textarea
                  rows="3"
                  value={genesis.paragraphs?.[1] || ''}
                  onChange={(e) => {
                    const p = [...(genesis.paragraphs || [])];
                    p[1] = e.target.value;
                    updateContent('genesis', { ...genesis, paragraphs: p });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Story Paragraph 3 (International Delivery & Applications)
                </label>
                <textarea
                  rows="3"
                  value={genesis.paragraphs?.[2] || ''}
                  onChange={(e) => {
                    const p = [...(genesis.paragraphs || [])];
                    p[2] = e.target.value;
                    updateContent('genesis', { ...genesis, paragraphs: p });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <ImageUploader
                label="Feature Showcase Image"
                value={genesis.image || ''}
                onChange={(url) => updateContent('genesis', { ...genesis, image: url })}
                recommendedSize="1000x800px (Natural Stone Samples)"
              />

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase text-slate-700 block">Heritage Metrics</span>
                <div className="space-y-3">
                  {[0, 1, 2].map((idx) => {
                    const stat = genesis.stats?.[idx] || { number: '', label: '' };
                    return (
                      <div key={idx} className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">Stat {idx + 1} Number</label>
                          <input
                            type="text"
                            value={stat.number || ''}
                            onChange={(e) => {
                              const st = [...(genesis.stats || [])];
                              st[idx] = { ...st[idx], number: e.target.value };
                              updateContent('genesis', { ...genesis, stats: st });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1">Stat {idx + 1} Label</label>
                          <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => {
                              const st = [...(genesis.stats || [])];
                              st[idx] = { ...st[idx], label: e.target.value };
                              updateContent('genesis', { ...genesis, stats: st });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 4 Pillars */}
      {activeTab === 'pillars' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Factory className="w-4 h-4 text-[#0A4E9B]" />
              <span>4 Pillars of Quality Standards</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Configure the section badge, heading, description, and the 4 quality cards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Badge
              </label>
              <input
                type="text"
                value={content.pillars_badge || 'Quality Standards'}
                onChange={(e) => updateContent('pillars_badge', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={content.pillars_heading || 'Our 4 Quality Standards'}
                onChange={(e) => updateContent('pillars_heading', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Description
              </label>
              <input
                type="text"
                value={content.pillars_description || 'Material, Stone Processing, Delivery, and Relationship-Driven Excellence.'}
                onChange={(e) => updateContent('pillars_description', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#0A4E9B] tracking-wider">
                  Pillar {idx + 1}
                </span>
                <input
                  type="text"
                  placeholder="Pillar Title"
                  value={pillar.title || ''}
                  onChange={(e) => {
                    const newPillars = [...pillars];
                    newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                    updateContent('pillars', newPillars);
                  }}
                  className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                />
                <textarea
                  rows="3"
                  placeholder="Pillar Description"
                  value={pillar.description || ''}
                  onChange={(e) => {
                    const newPillars = [...pillars];
                    newPillars[idx] = { ...newPillars[idx], description: e.target.value };
                    updateContent('pillars', newPillars);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: 12-Stage Work Process */}
      {activeTab === 'process' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0A4E9B]" />
              <span>Quarry to Architecture 12-Stage Work Process</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage the 12 steps from stone selection, gangsaw sawing, edge cutting, dry-lay inspection, up to loading and ocean transit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Badge
              </label>
              <input
                type="text"
                value={content.work_process_badge || 'Quarry to Architecture Workflow'}
                onChange={(e) => updateContent('work_process_badge', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={content.work_process_heading || 'Our Work Process'}
                onChange={(e) => updateContent('work_process_heading', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Section Description
            </label>
            <textarea
              rows="2"
              value={content.work_process_description || ''}
              onChange={(e) => updateContent('work_process_description', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Work Process Stages (Total: {workProcess.length})
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workProcess.map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C29B38] text-white">
                      Stage {step.step || String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">#{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Title</label>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={(e) => {
                          const updated = [...workProcess];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          updateContent('workProcess', updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={step.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...workProcess];
                          updated[idx] = { ...updated[idx], subtitle: e.target.value };
                          updateContent('workProcess', updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Description</label>
                    <textarea
                      rows="2"
                      value={step.description || ''}
                      onChange={(e) => {
                        const updated = [...workProcess];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        updateContent('workProcess', updated);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                    />
                  </div>

                  <ImageUploader
                    label="Stage Image"
                    value={step.image || ''}
                    onChange={(url) => {
                      const updated = [...workProcess];
                      updated[idx] = { ...updated[idx], image: url };
                      updateContent('workProcess', updated);
                    }}
                    recommendedSize="800x600px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Export Hubs */}
      {activeTab === 'hubs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0A4E9B]" />
              <span>Stone Processing & Ocean Logistics Hubs</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Information on Jaipur stone processing and Mundra Port ocean freight gateway.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Badge
              </label>
              <input
                type="text"
                value={hubs.badge || 'International Reach'}
                onChange={(e) => updateContent('hubs', { ...hubs, badge: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={hubs.heading || 'Integrated Quarry Mining & Ocean Export Logistics'}
                onChange={(e) => updateContent('hubs', { ...hubs, heading: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description Text
            </label>
            <textarea
              rows="3"
              value={hubs.description || ''}
              onChange={(e) => updateContent('hubs', { ...hubs, description: e.target.value })}
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
                value={hubs.jaipur_functions || ''}
                onChange={(e) => updateContent('hubs', { ...hubs, jaipur_functions: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Mundra Port Gateway Functions
              </label>
              <input
                type="text"
                value={hubs.mundra_functions || ''}
                onChange={(e) => updateContent('hubs', { ...hubs, mundra_functions: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Accreditations */}
      {activeTab === 'accreditations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0A4E9B]" />
              <span>Quality Accreditations & Standards</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">ASTM & EN certification notes and technical brochure download link.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Accreditations Heading
              </label>
              <input
                type="text"
                value={accreditations.heading || 'Quality Accreditations & Standards'}
                onChange={(e) => updateContent('accreditations', { ...accreditations, heading: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Brochure Download Link
              </label>
              <input
                type="text"
                value={accreditations.brochure_link || '/brochure.pdf'}
                onChange={(e) => updateContent('accreditations', { ...accreditations, brochure_link: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Accreditations Description
            </label>
            <textarea
              rows="3"
              value={accreditations.description || ''}
              onChange={(e) => updateContent('accreditations', { ...accreditations, description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save About Page</span>
        </button>
      </div>

    </div>
  );
}
