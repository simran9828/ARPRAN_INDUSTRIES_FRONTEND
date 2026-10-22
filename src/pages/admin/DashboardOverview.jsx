import React, { useState, useEffect } from 'react';
import {
  Package, Layers, Image as ImageIcon, FileText, Calendar,
  Sparkles, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Link2, Globe, PanelBottom
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardOverview({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authFetch, admin } = useAuth();

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await authFetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success) setStats(json.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [authFetch]);

  return (
    <div className="space-y-8">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#041738] to-[#0A4E9B] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[11px] font-bold tracking-wider uppercase mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARPRAN Live CMS Control System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Welcome back, {admin?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Manage your public website content, products, hero banners, brochures, and contact information without touching any source code. Changes saved here reflect immediately on the live website.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('home')}
              className="px-4 py-2 bg-white text-[#0A4E9B] hover:bg-blue-50 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow cursor-pointer"
            >
              Edit Home Sections
            </button>
            <button
              onClick={() => onNavigateTab('hero')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/20 cursor-pointer"
            >
              Hero Slides
            </button>
            <button
              onClick={() => onNavigateTab('services')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/20 cursor-pointer"
            >
              Service Detail Pages
            </button>
            <button
              onClick={() => onNavigateTab('finishes')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/20 cursor-pointer"
            >
              Surface Finishes
            </button>
            <button
              onClick={() => onNavigateTab('blogs')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/20 cursor-pointer"
            >
              Stone Articles
            </button>
            <button
              onClick={() => onNavigateTab('urls')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition border border-white/20 cursor-pointer"
            >
              Site URLs & Redirects
            </button>
            <button
              onClick={() => onNavigateTab('profile')}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span>Admin Email & Password</span>
              <span>⚙️</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 rounded-xl text-xs font-bold uppercase tracking-wider transition border border-cyan-400/40"
            >
              View Live Website ↗
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-slate-900">
              {loading ? '...' : stats?.totalProducts || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Total Products</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              {stats?.publishedProducts || 0} Published
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-slate-900">
              {loading ? '...' : stats?.totalCategories || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Stone Categories</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              12 Collections
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-slate-900">
              {loading ? '...' : stats?.totalDocuments || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Catalogues & PDFs</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Ready for Download
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-slate-900">
              {loading ? '...' : stats?.totalEvents || 0}
            </div>
            <div className="text-xs text-slate-500 font-medium">Expos & Events</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              Active Schedules
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Quick Actions & Audit Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Quick Management Cards */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Core CMS Modules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div
              onClick={() => onNavigateTab('products')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <Package className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Products Catalog</h3>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit prices/specs, upload stone photos & manage 250+ varieties.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('hero')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <Sparkles className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Hero Banners</h3>
              <p className="text-xs text-slate-500 mt-1">
                Replace homepage slideshow images, captions, and call-to-action buttons.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('about')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">About Us & Legacy</h3>
              <p className="text-xs text-slate-500 mt-1">
                Edit company story, 4 pillars of precision, quarry origins, and metrics.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('contact')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <Clock className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Contact & WhatsApp</h3>
              <p className="text-xs text-slate-500 mt-1">
                Update phone numbers, WhatsApp, office addresses, and Google maps link.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('services')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <Layers className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Service / Category Pages</h3>
              <p className="text-xs text-slate-500 mt-1">
                Edit geological stories, ASTM lab specs, capabilities & 7 FAQs for all 12 stone collections.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('urls')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <Link2 className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Site URLs & Redirects</h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage website URLs directory, stone slugs, CTA links, and 301/302 redirects.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('page-images')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Page Images (Add/Edit)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit images page-wise (Home, About, Products, Finishes, Blogs) with SEO Alt Text.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab('footer')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0A4E9B] shadow-xs hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition">
                  <PanelBottom className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#0A4E9B] transition" />
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Footer Manager</h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage footer navigation links, corporate addresses, WhatsApp/phone lines, and copyright.
              </p>
            </div>

          </div>
        </div>

        {/* Audit Activity Log */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Admin Activity</h2>
            <span className="text-[11px] text-slate-400 font-semibold">Audit Trail</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading activity trail...</div>
            ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No activity recorded yet.</div>
            ) : (
              stats.recentActivity.map((log) => (
                <div key={log.id} className="p-4 flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#0A4E9B] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{log.action}</p>
                    <p className="text-slate-500 truncate mt-0.5">{log.details}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      {new Date(log.created_at).toLocaleString()} by {log.admin_email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
