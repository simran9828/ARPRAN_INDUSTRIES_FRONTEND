import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Loader2, Settings, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';
import ImageUploader from '../../components/admin/ImageUploader';

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState({
    site_name: '',
    tagline: '',
    subtagline: '',
    motto: '',
    logo_url: '/logo.png',
    favicon_url: '/logo.png',
    copyright_text: '',
    maintenance_mode: 'false'
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await authFetch('/api/admin/settings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSettings(prev => ({ ...prev, ...json.data }));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [authFetch]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        body: settings
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Site settings saved successfully!' });
      refreshCMS();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Site Settings & Branding
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure enterprise brand name, motto, tagline, official logo, and copyright notice.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 self-start cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Branding & Logo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Brand Identity & Slogans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Company / Website Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.site_name || ''}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  placeholder="Arpran Industries Pvt. Ltd."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="Bringing Nature's Elegance to Life"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Sub-tagline
                </label>
                <input
                  type="text"
                  value={settings.subtagline || ''}
                  onChange={(e) => setSettings({ ...settings, subtagline: e.target.value })}
                  placeholder="PREMIUM NATURAL STONE, LANDSCAPING STONE & STONE FURNITURE"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official Motto
                </label>
                <input
                  type="text"
                  value={settings.motto || ''}
                  onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                  placeholder="Built by Nature. Perfected by Arpran. Delivered Worldwide."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Official Logo Image"
                value={settings.logo_url}
                onChange={(url) => setSettings({ ...settings, logo_url: url })}
                recommendedSize="Transparent PNG or High-Res JPG"
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Footer Copyright Notice
                </label>
                <input
                  type="text"
                  value={settings.copyright_text || ''}
                  onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                  placeholder="ARPRAN Industries Pvt. Ltd. All rights reserved."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Operational Mode</span>
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Maintenance Mode</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Keep set to "Normal Live Operation" so all visitors can browse collections.
              </p>
            </div>

            <select
              value={settings.maintenance_mode || 'false'}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.value })}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            >
              <option value="false">🟢 Normal Live Operation</option>
              <option value="true">🟡 Maintenance Notice</option>
            </select>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
