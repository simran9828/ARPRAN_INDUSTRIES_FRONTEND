import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut, User, Mail, ShieldCheck, Layers, FileText,
  Compass, ArrowRight, Sparkles, Phone, Download, CheckCircle2,
  Building, ExternalLink, Calendar
} from 'lucide-react';
import { ArpranLogo } from '../components/ArpranLogo';
import SEO from '../components/SEO';

export default function UserDashboardPage() {
  const { user, admin, logout } = useAuth();
  const navigate = useNavigate();

  const activeAccount = user || admin || {
    email: 'client@arpranindustries.com',
    name: 'Valued Client',
    role: 'user'
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SEO
        title="Client Portal & Project Dashboard | ARPRAN Industries"
        description="Private client portal dashboard for ARPRAN natural stone specifications, RFQ orders, and container export tracking."
      />

      {/* Top Header */}
      <header className="bg-[#0B1528] border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
            <ArpranLogo light={true} className="h-10 sm:h-11" />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Account badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold truncate max-w-[180px]">{activeAccount.email}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 ml-1">
                {activeAccount.role || 'Client'}
              </span>
            </div>

            {/* If admin, quick shortcut to Admin CMS */}
            {(activeAccount.role === 'admin' || activeAccount.role === 'superadmin') && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A4E9B] hover:bg-[#073B75] text-white text-xs font-bold transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin CMS</span>
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-100 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              title="Sign Out of Your Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">

        {/* Welcome Hero Card */}
        <div className="bg-gradient-to-br from-[#0B1528] via-[#0E1D38] to-[#041738] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Client Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Welcome, {activeAccount.name || activeAccount.email.split('@')[0]}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              You are signed in to the ARPRAN Industries Architectural & Client Portal. From here you can inspect our live 250+ stone inventory, download certified technical specifications, and submit priority quarry export inquiries.
            </p>
          </div>
        </div>

        {/* 4 Feature Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">250+ Stone Varieties</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Calibrated gangsaw granite, Makrana marble, quartzite, sandstone, and veneers.
            </p>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-[#0A4E9B] hover:underline mt-4">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Priority RFQ Inquiries</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Submit custom project dimensions, gauge tolerances, and destination port requests.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-bold text-[#0A4E9B] hover:underline mt-4">
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Surface Finishes</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Inspect mirror polish, thermal flamed, velvety honed, and antique leathered textures.
            </p>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-bold text-[#0A4E9B] hover:underline mt-4">
              <span>View Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Official Catalog PDF</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Download the comprehensive ARPRAN export brochure and lab technical matrix.
            </p>
            <a href="/brochure.pdf" download className="inline-flex items-center gap-1 text-xs font-bold text-[#0A4E9B] hover:underline mt-4">
              <span>Download PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Profile Details & Account Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Account Profile & Security</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your authenticated account credentials and portal privileges
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Session Authenticated</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Email Address
              </span>
              <p className="font-semibold text-slate-900 text-sm break-all">
                {activeAccount.email}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Account Privilege Role
              </span>
              <p className="font-semibold text-slate-900 text-sm uppercase">
                {activeAccount.role || 'Client (Standard)'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Quarry Desk Contact
              </span>
              <p className="font-semibold text-slate-900 text-sm">
                +91-94140 68933
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Security: End-to-end encrypted session with SHA-256 JWT tokens.</span>
            <button
              onClick={handleLogout}
              className="font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              Sign out from all devices →
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ARPRAN Industries Pvt. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
