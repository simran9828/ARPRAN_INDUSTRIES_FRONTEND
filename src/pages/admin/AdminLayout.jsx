import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, Building, Package, Layers, Image as ImageIcon,
  FileText, Calendar, Phone, Share2, Globe, Settings, KeyRound,
  Database, LogOut, ExternalLink, Menu, X, ShieldCheck, Link2, PanelBottom
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ArpranLogo } from '../../components/ArpranLogo';

// CMS Views
import DashboardOverview from './DashboardOverview';
import HomePageManager from './HomePageManager';
import HeroManager from './HeroManager';
import AboutManager from './AboutManager';
import FinishesManager from './FinishesManager';
import ServicePageManager from './ServicePageManager';
import BlogManager from './BlogManager';
import ProductManager from './ProductManager';
import CategoryManager from './CategoryManager';
import GalleryManager from './GalleryManager';
import DocumentManager from './DocumentManager';
import EventManager from './EventManager';
import ContactManager from './ContactManager';
import SocialManager from './SocialManager';
import SEOManager from './SEOManager';
import SiteSettingsManager from './SiteSettingsManager';
import AdminProfile from './AdminProfile';
import BackupManager from './BackupManager';
import UrlManager from './UrlManager';
import PageImagesManager from './PageImagesManager';
import FooterManager from './FooterManager';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const getTabFromPath = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'admin') {
      return parts[1];
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);

  useEffect(() => {
    const tab = getTabFromPath();
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(tabId === 'dashboard' ? '/admin' : `/admin/${tabId}`);
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Website Pages & Content',
      items: [
        { id: 'home', label: 'Home Page Sections', icon: Sparkles },
        { id: 'page-images', label: 'Page Images (Add/Edit)', icon: ImageIcon },
        { id: 'hero', label: 'Hero Slides / Banners', icon: Sparkles },
        { id: 'about', label: 'About Us & Heritage', icon: Building },
        { id: 'services', label: 'Service / Category Pages', icon: Layers },
        { id: 'finishes', label: 'Surface Finishes Page', icon: Layers },
        { id: 'blogs', label: 'Architectural Articles', icon: FileText },
        { id: 'footer', label: 'Footer Manager', icon: PanelBottom },
        { id: 'contact', label: 'Contact & RFQ Page', icon: Phone },
        { id: 'urls', label: 'Site URLs & Redirects', icon: Link2 }
      ]
    },
    {
      group: 'Catalog & Inventory',
      items: [
        { id: 'products', label: 'Stone Products', icon: Package },
        { id: 'categories', label: 'Stone Categories', icon: Layers }
      ]
    },
    {
      group: 'Media & Documents',
      items: [
        { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
        { id: 'documents', label: 'E-Catalogues & PDFs', icon: FileText },
        { id: 'events', label: 'Exhibitions & Events', icon: Calendar }
      ]
    },
    {
      group: 'Settings & Security',
      items: [
        { id: 'profile', label: 'Admin Email & Password', icon: ShieldCheck },
        { id: 'site_settings', label: 'Site Settings', icon: Settings },
        { id: 'social', label: 'Social Media', icon: Share2 },
        { id: 'seo', label: 'SEO Settings', icon: Globe },
        { id: 'backup', label: 'Database Backup', icon: Database }
      ]
    }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onNavigateTab={(tab) => setActiveTab(tab)} />;
      case 'home':
        return <HomePageManager />;
      case 'page-images':
        return <PageImagesManager />;
      case 'hero':
        return <HeroManager />;
      case 'about':
        return <AboutManager />;
      case 'services':
        return <ServicePageManager />;
      case 'finishes':
        return <FinishesManager />;
      case 'blogs':
        return <BlogManager />;
      case 'footer':
        return <FooterManager />;
      case 'products':
        return <ProductManager />;
      case 'categories':
        return <CategoryManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'documents':
        return <DocumentManager />;
      case 'events':
        return <EventManager />;
      case 'contact':
        return <ContactManager />;
      case 'social':
        return <SocialManager />;
      case 'seo':
        return <SEOManager />;
      case 'site_settings':
        return <SiteSettingsManager />;
      case 'profile':
        return <AdminProfile />;
      case 'backup':
        return <BackupManager />;
      case 'urls':
        return <UrlManager />;
      default:
        return <DashboardOverview onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#041738] border-b border-blue-900/60 text-white shadow-md">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <ArpranLogo light={true} className="h-8" />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-blue-400/30">
                CMS Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
            </a>

            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <button
                onClick={() => handleTabChange('profile')}
                className="hidden md:block text-right hover:opacity-80 transition cursor-pointer text-left"
                title="Change Admin Email & Password"
              >
                <p className="text-xs font-bold text-white truncate max-w-[160px]">{admin?.email || 'admin'}</p>
                <p className="text-[10px] text-cyan-300 flex items-center justify-end gap-1">
                  <span>Change Email / Password</span>
                  <span>âš™ï¸</span>
                </p>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-rose-600/80 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Sign out of Admin Session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 shrink-0 p-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                {group.group}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${isActive
                        ? 'bg-[#0A4E9B] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Mobile Slide-over Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full p-4 overflow-y-auto space-y-6 z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Navigation Menu</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                    {group.group}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${isActive
                            ? 'bg-[#0A4E9B] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>

      </div>

    </div>
  );
}
