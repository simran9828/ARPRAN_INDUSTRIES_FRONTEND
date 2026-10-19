import React, { useState, useEffect } from 'react';
import { 
  PanelBottom, Plus, Edit2, Trash2, RotateCcw, Save, CheckCircle2, 
  MapPin, Phone, Mail, Link as LinkIcon, RefreshCw, AlertCircle, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCMS } from '../../context/CMSContext';

export default function FooterManager() {
  const { authFetch } = useAuth();
  const { refreshCMS } = useCMS();
  const [activeSubTab, setActiveSubTab] = useState('links');
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Link Modal States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteLinkId, setDeleteLinkId] = useState(null);
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    url: '/',
    column_name: 'company',
    display_order: 1,
    status: 'active'
  });

  // Settings Form State
  const [addressData, setAddressData] = useState({
    site_name: 'Arpran Industries Pvt. Ltd.',
    address_jaipur: '',
    address_melbourne: '',
    phone: '',
    whatsapp: '',
    email: '',
    australia_phone: '',
    copyright_text: '',
    footer_tagline: '',
    subtagline: '',
    motto: '',
    newsletter_title: 'Newsletter'
  });

  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      let res = await authFetch('/api/admin/footer');
      if (!res || !res.ok) {
        res = await fetch('/api/public/footer');
      }
      const data = await res.json();
      if (data.success && data.data) {
        setLinks(data.data.links || []);
        const s = data.data.settings || {};
        setSettings(s);
        setAddressData({
          site_name: s.site_name || 'Arpran Industries Pvt. Ltd.',
          address_jaipur: s.address_jaipur || '',
          address_melbourne: s.address_melbourne || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          email: s.email || '',
          australia_phone: s.australia_phone || '',
          copyright_text: s.copyright_text || '',
          footer_tagline: s.footer_tagline || '',
          subtagline: s.subtagline || s.footer_tagline || '',
          motto: s.motto || '',
          newsletter_title: s.newsletter_title || 'Newsletter'
        });
      }
    } catch (err) {
      console.error('Error fetching footer data:', err);
      try {
        const res = await fetch('/api/public/footer');
        const data = await res.json();
        if (data.success && data.data) {
          setLinks(data.data.links || []);
        }
      } catch (e) {}
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const handleOpenAddLink = () => {
    setEditingLink(null);
    setLinkFormData({
      title: '',
      url: '/',
      column_name: 'company',
      display_order: links.length + 1,
      status: 'active'
    });
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (l) => {
    setEditingLink(l);
    setLinkFormData({
      title: l.title || '',
      url: l.url || '/',
      column_name: l.column_name || 'company',
      display_order: l.display_order || 1,
      status: l.status || 'active'
    });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = async (e) => {
    e.preventDefault();
    if (!linkFormData.title || !linkFormData.url) {
      alert('Please provide link title and destination URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingLink 
        ? `/api/admin/footer/links/${editingLink.id}` 
        : '/api/admin/footer/links';
      const method = editingLink ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        body: linkFormData
      });
      const result = await res.json();

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: editingLink ? 'Footer link updated successfully!' : 'Footer link added successfully!'
        });
        setTimeout(() => setStatusMessage(null), 3500);
        setIsLinkModalOpen(false);
        fetchFooterData();
        if (refreshCMS) await refreshCMS();
      } else {
        alert(result.error || 'Failed to save footer link');
      }
    } catch (err) {
      console.error('Save link error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      const res = await authFetch(`/api/admin/footer/links/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setDeleteLinkId(null);
        setStatusMessage({ type: 'success', text: 'Footer link removed' });
        setTimeout(() => setStatusMessage(null), 3000);
        fetchFooterData();
        if (refreshCMS) await refreshCMS();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleResetLinks = async () => {
    if (!window.confirm('Reset all footer links to default navbar sections (Home, About Us, Product, Finishes, Blog, Contact Us)?')) {
      return;
    }

    try {
      const res = await authFetch('/api/admin/footer/links/reset', {
        method: 'POST'
      });
      const result = await res.json();
      if (result.success) {
        setStatusMessage({ type: 'success', text: 'Footer links reset to standard navbar items!' });
        setTimeout(() => setStatusMessage(null), 3500);
        fetchFooterData();
        if (refreshCMS) await refreshCMS();
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await authFetch('/api/admin/footer/settings', {
        method: 'PUT',
        body: addressData
      });
      const result = await res.json();
      if (result.success) {
        setStatusMessage({ type: 'success', text: 'Footer settings and addresses saved successfully!' });
        setTimeout(() => setStatusMessage(null), 4000);
        if (refreshCMS) await refreshCMS();
      } else {
        alert(result.error || 'Failed to update footer settings');
      }
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A4E9B] text-xs font-bold uppercase tracking-wider mb-2">
            <PanelBottom className="w-3.5 h-3.5" />
            <span>Global Layout CMS</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Footer Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Footer ke "THE COMPANY" links, factory & overseas distribution addresses, phone/WhatsApp aur copyright text ko customize karein.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFooterData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('links')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'links' 
              ? 'bg-[#0A4E9B] text-white shadow-xs' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Section 1: The Company Links ({links.length})
        </button>
        <button
          onClick={() => setActiveSubTab('address')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'address' 
              ? 'bg-[#0A4E9B] text-white shadow-xs' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Section 2: Address & Contact Lines
        </button>
        <button
          onClick={() => setActiveSubTab('copyright')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'copyright' 
              ? 'bg-[#0A4E9B] text-white shadow-xs' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Section 3: Copyright & Bottom Strip
        </button>
      </div>

      {/* SUB-TAB 1: LINKS */}
      {activeSubTab === 'links' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-serif font-bold text-slate-900">
                Column 1 Navigation Links
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These links appear under "THE COMPANY" column in the gray footer.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetLinks}
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                title="Reset to default navbar sections"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Navbar Items</span>
              </button>
              <button
                onClick={handleOpenAddLink}
                className="px-4 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Footer Link</span>
              </button>
            </div>
          </div>

          {/* Links Table */}
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">Loading links...</div>
          ) : links.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <LinkIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">No custom footer links configured.</p>
              <button
                onClick={handleResetLinks}
                className="mt-3 px-4 py-1.5 bg-[#0A4E9B] text-white rounded-lg text-xs font-bold"
              >
                Populate Navbar Defaults
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Link Label</th>
                    <th className="py-3 px-4">Target URL / Route</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {links.map((l, idx) => (
                    <tr key={l.id || idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono text-slate-400 text-xs">
                        {l.display_order || idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {l.title}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-[#0A4E9B]">
                        {l.url}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditLink(l)}
                            className="p-1.5 text-slate-600 hover:text-[#0A4E9B] hover:bg-slate-100 rounded-lg transition"
                            title="Edit Link"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteLinkId(l.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* SUB-TAB 2: ADDRESS & CONTACT */}
      {activeSubTab === 'address' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-serif font-bold text-slate-900">
              Column 2 Address & Quarry Distribution Lines
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details render under the "ADDRESS" section in the footer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={addressData.site_name}
                onChange={(e) => setAddressData({ ...addressData, site_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Tagline / Subtitle
              </label>
              <input
                type="text"
                value={addressData.footer_tagline}
                placeholder="Bringing Nature's Elegance to Life"
                onChange={(e) => setAddressData({ ...addressData, footer_tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Jaipur HQ & Quarry Works Address
              </label>
              <textarea
                rows={2}
                value={addressData.address_jaipur}
                onChange={(e) => setAddressData({ ...addressData, address_jaipur: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Phone (India HQ)
              </label>
              <input
                type="text"
                value={addressData.phone}
                onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Direct Number
              </label>
              <input
                type="text"
                value={addressData.whatsapp}
                onChange={(e) => setAddressData({ ...addressData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                value={addressData.email}
                onChange={(e) => setAddressData({ ...addressData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Addresses & Contact'}</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: COPYRIGHT */}
      {activeSubTab === 'copyright' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-serif font-bold text-slate-900">
              Bottom Strip, Motto & Header Subtagline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the logo subtitle, bottom-most copyright notice, and inspirational stone brand motto.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Top Subtagline (Renders Under Centered Footer Logo)
            </label>
            <input
              type="text"
              value={addressData.subtagline || ''}
              placeholder="Architectural Natural Stones & Global Container Exports"
              onChange={(e) => setAddressData({ ...addressData, subtagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Copyright Notice Text
            </label>
            <input
              type="text"
              value={addressData.copyright_text}
              placeholder="© 2026 Arpran Industries Pvt. Ltd. All Right Reserved."
              onChange={(e) => setAddressData({ ...addressData, copyright_text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brand Motto / Quote
            </label>
            <input
              type="text"
              value={addressData.motto || ''}
              placeholder="Built by Nature. Perfected by Arpran. Delivered Worldwide."
              onChange={(e) => setAddressData({ ...addressData, motto: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Copyright Notice'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Add / Edit Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <h2 className="text-base font-serif font-bold text-slate-900">
                {editingLink ? 'Edit Footer Link' : 'Add Footer Link'}
              </h2>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Link Label (Display Text) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Products, Finishes, Contact Us"
                  value={linkFormData.title}
                  onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination URL / Route *
                </label>
                <input
                  type="text"
                  placeholder="e.g. /products, /contact, /about"
                  value={linkFormData.url}
                  onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={linkFormData.display_order}
                  onChange={(e) => setLinkFormData({ ...linkFormData, display_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#0A4E9B]"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : editingLink ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Link Confirmation Modal */}
      {deleteLinkId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Remove Footer Link?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this link from the footer?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteLinkId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLink(deleteLinkId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
