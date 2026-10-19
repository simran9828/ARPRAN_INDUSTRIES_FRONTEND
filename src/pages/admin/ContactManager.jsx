import React, { useState, useEffect } from 'react';
import {
  Save, CheckCircle2, AlertCircle, Loader2, Phone, Mail,
  MapPin, Clock, Globe2, Sparkles, MessageSquare, HelpCircle,
  FileText, Plus, Trash2, Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

const TABS = [
  { id: 'channels', label: '1. Direct Channels & Social', icon: Phone },
  { id: 'addresses', label: '2. Physical Addresses', icon: MapPin },
  { id: 'page_header', label: '3. Page Header & Hero', icon: Sparkles },
  { id: 'rfq_whatsapp', label: '4. RFQ Form & WhatsApp Callout', icon: MessageSquare },
  { id: 'faqs', label: '5. Export Logistics FAQs', icon: HelpCircle },
];

export default function ContactManager() {
  const [activeTab, setActiveTab] = useState('channels');
  const [settings, setSettings] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    australia_phone: '',
    address_jaipur: '',
    address_melbourne: '',
    address_uae: '',
    google_maps_url: '',
    business_hours: ''
  });

  const [pageData, setPageData] = useState({
    title: 'Contact Us & Request Natural Stone Quotation',
    h1: 'Contact Arpran Industries – Your Natural Stone Partner',
    tagline: 'Looking for premium natural stone slabs, granite, sandstone, quartzite, slate stone, or limestone? Get in touch with Arpran Industries for product enquiries, bulk orders, custom requirements, and international export solutions.',
    content: {
      header: {
        badge: 'Direct Export Division',
        h1: 'Contact Arpran Industries – Your Natural Stone Partner',
        subtitle: 'Looking for premium natural stone slabs, granite, sandstone, quartzite, slate stone, or limestone? Get in touch with Arpran Industries for product enquiries, bulk orders, custom requirements, and international export solutions.'
      },
      offices_section: {
        badge: 'International Presence',
        heading: 'Headquarters & International Office',
        description: 'Direct communication with our quarry directors and logistics specialists.'
      },
      instant_wa: {
        title: 'Instant WhatsApp Quotations',
        description: "Send your project blueprints or required slab quantities directly to our director's desk for instant FOB Mundra / CIF port estimates.",
        button_text: 'Chat With Quarry Director'
      },
      rfq_form: {
        badge: 'Direct Factory Submission',
        title: 'Request Stone Specification Quotation',
        subtitle: 'Fill in your project requirements below. Our commercial department will provide calibrated slab photos, laboratory test reports, and CIF freight pricing.',
        button_text: 'Submit Official Quotation Request',
        trust_badge_1: 'NDA Confidentiality Guaranteed',
        trust_badge_2: '24-Hour Quotation Turnaround'
      },
      faqs_badge: 'Frequently Asked Questions',
      faqs_heading: 'Stone Export & Logistics Information',
      faqs: [
        {
          question: 'What is the standard container capacity for slabs?',
          answer: 'A 20ft heavy-duty ocean container holds approx 400 to 450 sqm of 20mm granite slabs, or approx 300 sqm of 30mm slabs, subject to the weight limits of the discharge port (usually 21 to 27 metric tons).'
        },
        {
          question: 'How are the slabs packaged for export?',
          answer: 'All slabs are loaded on certified ISPM-15 heat-treated fumigated wooden A-frames. Slabs are individually cushioned with foam sheets and strapped with heavy-gauge steel bands to prevent transit movement.'
        },
        {
          question: 'Can we order mixed stone varieties in one container?',
          answer: 'Yes. We frequently pack mixed containers containing granite slabs, marble tiles, and flexible stone veneer crates together to maximize space utilization for project developers.'
        },
        {
          question: 'What is the typical production and shipping lead time?',
          answer: 'Factory gangsaw cutting and finishing takes 10 to 18 days. Transit time from Mundra Port to destination ports is approximately 18 to 24 days.'
        }
      ]
    }
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, pageRes] = await Promise.all([
          authFetch('/api/admin/settings'),
          authFetch('/api/admin/pages/contact')
        ]);

        if (settingsRes.ok) {
          const json = await settingsRes.json();
          if (json.success && json.data) {
            setSettings(prev => ({ ...prev, ...json.data }));
          }
        }

        if (pageRes.ok) {
          const pageJson = await pageRes.json();
          if (pageJson.success && pageJson.data) {
            setPageData(prev => ({
              ...prev,
              ...pageJson.data,
              content: {
                ...prev.content,
                ...(pageJson.data.content || {})
              }
            }));
          }
        }
      } catch (e) {
        console.error('Failed to load contact data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [authFetch]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const [resSettings, resPage] = await Promise.all([
        authFetch('/api/admin/settings', {
          method: 'PUT',
          body: settings
        }),
        authFetch('/api/admin/pages/contact', {
          method: 'PUT',
          body: pageData
        })
      ]);

      const dataSettings = await resSettings.json();
      const dataPage = await resPage.json();

      if (!resSettings.ok || !dataSettings.success) {
        throw new Error(dataSettings.error || 'Failed to update contact settings');
      }
      if (!resPage.ok || !dataPage.success) {
        throw new Error(dataPage.error || 'Failed to update contact page content');
      }

      setMessage({ type: 'success', text: 'Contact info & page content updated successfully!' });
      if (refreshCMS) await refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (key, val) => {
    setPageData(prev => ({
      ...prev,
      content: {
        ...(prev.content || {}),
        [key]: val
      }
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center text-xs text-slate-400">
        Loading contact settings & page copy...
      </div>
    );
  }

  const content = pageData.content || {};
  const header = content.header || {};
  const officesSection = content.offices_section || {};
  const instantWa = content.instant_wa || {};
  const rfqForm = content.rfq_form || {};
  const faqs = Array.isArray(content.faqs) ? content.faqs : [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Contact & Export Inquiries CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage phone numbers, addresses, page banners, instant WhatsApp quotations, RFQ form copy, and export FAQs.
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

      {/* Message */}
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

      {/* TAB 1: Direct Communication Channels */}
      {activeTab === 'channels' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0A4E9B]" />
              <span>Direct Inquiries, Phone & Messaging</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">These numbers and links are displayed on the header, footer, and contact page cards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                India Phone Number (Displays on Header & Footer)
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91-94140 68933"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp Number (Digits only with country code)
              </label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="919414068933"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Powers the floating WhatsApp button and all direct quotation chat links.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="info@arpranindustries.com"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Plant Visiting Hours
              </label>
              <input
                type="text"
                value={settings.business_hours || ''}
                onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                placeholder="Mon - Sat: 9:00 AM - 7:00 PM IST"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Physical Addresses */}
      {activeTab === 'addresses' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0A4E9B]" />
              <span>Plant & Office Locations</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Official physical factory and representative office locations.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Jaipur Corporate HQ & Processing Plant
              </label>
              <textarea
                rows="2"
                value={settings.address_jaipur || ''}
                onChange={(e) => setSettings({ ...settings, address_jaipur: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                International / UAE Liaison Office Address
              </label>
              <textarea
                rows="2"
                value={settings.address_uae || ''}
                onChange={(e) => setSettings({ ...settings, address_uae: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Google Maps Embed / Navigation URL
              </label>
              <input
                type="text"
                value={settings.google_maps_url || ''}
                onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Page Header & Hero Banner */}
      {activeTab === 'page_header' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A4E9B]" />
              <span>Contact Page Header & Offices Section Titles</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Configure the dark banner at the top of the contact page and the office cards section heading.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Header Badge
              </label>
              <input
                type="text"
                value={header.badge || 'Direct Export Division'}
                onChange={(e) => updateContent('header', { ...header, badge: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
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
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Main H1 Heading
            </label>
            <input
              type="text"
              value={pageData.h1 || ''}
              onChange={(e) => {
                setPageData({ ...pageData, h1: e.target.value });
                updateContent('header', { ...header, h1: e.target.value });
              }}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Header Subtitle Paragraph
            </label>
            <textarea
              rows="3"
              value={pageData.tagline || ''}
              onChange={(e) => {
                setPageData({ ...pageData, tagline: e.target.value });
                updateContent('header', { ...header, subtitle: e.target.value });
              }}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A4E9B]">
              Offices Section Heading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={officesSection.badge || 'International Presence'}
                  onChange={(e) => updateContent('offices_section', { ...officesSection, badge: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={officesSection.heading || 'Headquarters & International Office'}
                  onChange={(e) => updateContent('offices_section', { ...officesSection, heading: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Description
              </label>
              <input
                type="text"
                value={officesSection.description || ''}
                onChange={(e) => updateContent('offices_section', { ...officesSection, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RFQ Form & WhatsApp Callout */}
      {activeTab === 'rfq_whatsapp' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0A4E9B]" />
              <span>Quotation RFQ Form & WhatsApp Callout</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Customize form headlines, button callouts, and direct chat cards.</p>
          </div>

          {/* Instant WhatsApp block */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Instant WhatsApp Callout Box
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">Box Title</label>
                <input
                  type="text"
                  value={instantWa.title || 'Instant WhatsApp Quotations'}
                  onChange={(e) => updateContent('instant_wa', { ...instantWa, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">Button CTA Text</label>
                <input
                  type="text"
                  value={instantWa.button_text || 'Chat With Quarry Director'}
                  onChange={(e) => updateContent('instant_wa', { ...instantWa, button_text: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">Description Paragraph</label>
              <textarea
                rows="2"
                value={instantWa.description || ''}
                onChange={(e) => updateContent('instant_wa', { ...instantWa, description: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
              />
            </div>
          </div>

          {/* RFQ Form copy */}
          <div className="space-y-4 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              RFQ Specification Form Copy
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Form Badge</label>
                <input
                  type="text"
                  value={rfqForm.badge || 'Direct Factory Submission'}
                  onChange={(e) => updateContent('rfq_form', { ...rfqForm, badge: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value={rfqForm.title || 'Request Stone Specification Quotation'}
                  onChange={(e) => updateContent('rfq_form', { ...rfqForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Form Subtitle</label>
              <textarea
                rows="2"
                value={rfqForm.subtitle || ''}
                onChange={(e) => updateContent('rfq_form', { ...rfqForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Submit Button Text</label>
                <input
                  type="text"
                  value={rfqForm.button_text || 'Submit Official Quotation Request'}
                  onChange={(e) => updateContent('rfq_form', { ...rfqForm, button_text: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Trust Badge 1</label>
                <input
                  type="text"
                  value={rfqForm.trust_badge_1 || 'NDA Confidentiality Guaranteed'}
                  onChange={(e) => updateContent('rfq_form', { ...rfqForm, trust_badge_1: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Trust Badge 2</label>
                <input
                  type="text"
                  value={rfqForm.trust_badge_2 || '24-Hour Quotation Turnaround'}
                  onChange={(e) => updateContent('rfq_form', { ...rfqForm, trust_badge_2: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FAQs Manager */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0A4E9B]" />
                <span>Frequently Asked Questions (Stone Export & Logistics)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Add, edit, or reorder FAQ items shown at the bottom of the contact page.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newFaqs = [...faqs, { question: 'New Question?', answer: 'Answer details here...' }];
                updateContent('faqs', newFaqs);
              }}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#0A4E9B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                FAQ Section Badge
              </label>
              <input
                type="text"
                value={content.faqs_badge || 'Frequently Asked Questions'}
                onChange={(e) => updateContent('faqs_badge', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                FAQ Section Heading
              </label>
              <input
                type="text"
                value={content.faqs_heading || 'Stone Export & Logistics Information'}
                onChange={(e) => updateContent('faqs_heading', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-[#0A4E9B]">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = faqs.filter((_, i) => i !== idx);
                      updateContent('faqs', updated);
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Question</label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      updateContent('faqs', updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Answer</label>
                  <textarea
                    rows="3"
                    value={faq.answer || ''}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      updateContent('faqs', updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                </div>
              </div>
            ))}
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
          <span>Save Contact Information</span>
        </button>
      </div>

    </div>
  );
}
