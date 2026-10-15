import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Phone, Mail, Search, Download, ChevronDown,
  Menu, X, FileText, Sparkles, MessageSquare, ArrowRight,
  User, LogIn, LogOut
} from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';
import CATALOG_DATA from '../data/catalog.json';
import { ArpranLogo } from './ArpranLogo';
import { useCMS } from '../context/CMSContext';
import { useAuth } from '../context/AuthContext';

// 8 authentic natural stone collections requested
const BASE_COLLECTIONS = [
  { name: 'Granite Series', catalogKey: 'Granite Series', slug: 'granite-series' },
  { name: 'Marble Series', catalogKey: 'Marble Series', slug: 'marble-series' },
  { name: 'Rough Blocks', catalogKey: 'Rough Blocks', slug: 'rough-blocks', isHighlight: true, badge: 'Raw Blocks' },
  { name: 'Quartzite Series', catalogKey: 'Quartzite Series', slug: 'quartzite-series' },
  { name: 'Sandstone Series', catalogKey: 'Sandstone Series', slug: 'sandstone-series' },
  { name: 'Slate Stone', catalogKey: 'Slate Stone', slug: 'slate-stone' },
  { name: 'Stone Veneer', catalogKey: 'Stone Veneer', slug: 'stone-veneer' },
  { name: 'Limestone Series', catalogKey: 'Limestone Series', slug: 'limestone-series' },
  { name: 'Landscaping & Furniture', catalogKey: 'Landscaping & Furniture', slug: 'landscaping-and-furniture' }
];

export default function Navbar() {
  const { settings } = useCMS();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const phone = settings?.phone || COMPANY_INFO?.contact?.phone || '+91-94140 68933';
  const email = settings?.email || COMPANY_INFO?.contact?.email || 'info@arpranindustries.com';
  const whatsapp = settings?.whatsapp || COMPANY_INFO?.contact?.whatsapp || '919414068933';

  // Build clean 8 collections list with exact names requested
  const navCategories = React.useMemo(() => {
    return BASE_COLLECTIONS.map(item => ({
      name: item.name,
      slug: item.slug,
      catalogKey: item.catalogKey,
      isHighlight: item.isHighlight,
      badge: item.badge
    }));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-all duration-200 py-1 border-b-2 ${isActive
      ? 'text-amber-400 border-amber-400 font-bold'
      : 'text-slate-200 hover:text-amber-300 border-transparent hover:border-amber-400/50'
    }`;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Main Luxury Navigation Bar with Deep Obsidian Sapphire & Warm Gold Accents */}
      <div
        className="text-white border-b border-amber-500/20 shadow-lg relative z-50"
        style={{ backgroundColor: '#0B1528' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Logo Left */}
          <Link to="/" className="flex items-center py-2 transition hover:opacity-95 shrink-0">
            <ArpranLogo light={true} className="h-10 sm:h-12" />
          </Link>

          {/* Right-Aligned Navigation Links directly next to Search and Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5 ml-auto">

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 pr-2">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>

              {/* Product with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
              >
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-sm font-semibold transition-all duration-200 py-1 border-b-2 ${isActive
                      ? 'text-amber-400 border-amber-400 font-bold'
                      : 'text-slate-200 hover:text-amber-300 border-transparent hover:border-amber-400/50'
                    }`
                  }
                >
                  <span>Product</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${isProductsDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </NavLink>

                {/* Dropdown Menu - 100% Solid Opaque Obsidian & Gold Luxury Theme */}
                {isProductsDropdownOpen && (
                  <div
                    className="absolute top-full -left-28 sm:-left-36 lg:-left-44 w-[600px] border-2 border-amber-500/40 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{ backgroundColor: '#0B1528' }}
                  >
                    <div className="px-1 pb-3 mb-3 border-b border-slate-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">Natural Stone Collections</span>
                      </div>
                      <Link
                        to="/products"
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>View All Products</span>
                        <span>→</span>
                      </Link>
                    </div>

                    {/* 2-Column Grid of 8 Curated Collections - No Numbering */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {navCategories.map(cat => {
                        const isRough = cat.slug === 'rough-blocks';
                        return (
                          <Link
                            key={cat.slug}
                            to={`/products/${cat.slug}`}
                            onClick={() => setIsProductsDropdownOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 group border ${isRough
                              ? 'bg-gradient-to-r from-amber-500/25 to-slate-900 border-amber-400/60 text-amber-200 hover:border-amber-300 hover:bg-amber-500/35'
                              : 'bg-[#101F3B] hover:bg-[#182F57] border-slate-700/60 hover:border-amber-400/50 text-white hover:text-amber-300 shadow-xs'
                              }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${isRough ? 'bg-amber-400 animate-pulse' : 'bg-amber-400 group-hover:bg-amber-300'}`} />
                              <span className={`font-semibold text-xs truncate ${isRough ? 'text-amber-200 font-bold' : 'text-slate-100 group-hover:text-white'}`}>
                                {cat.name}
                              </span>
                              {isRough && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 ml-1 shrink-0">
                                  Raw Blocks
                                </span>
                              )}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                          </Link>
                        );
                      })}
                    </div>

                    {/* Direct Featured Rough Blocks Highlight Ribbon at Bottom */}
                    <div className="mt-3 pt-3 border-t border-slate-700/80 bg-[#070E1C] rounded-xl p-3 flex items-center justify-between text-xs border border-amber-500/20">
                      <div className="flex items-center gap-2.5 text-slate-200 min-w-0">
                        <span className="text-xl shrink-0">🏗️</span>
                        <div className="truncate">
                          <p className="font-bold text-white text-xs truncate">Direct Quarry Rough Blocks</p>
                          <p className="text-[10px] text-slate-400 truncate">Gangsaw boulders in Viscon White, Tan Brown, Black Galaxy & more</p>
                        </div>
                      </div>
                      <Link
                        to="/products/rough-blocks"
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition shrink-0 ml-2 shadow"
                      >
                        View Blocks →
                      </Link>
                    </div>
                  </div>
                )}
              </div>



              <NavLink to="/blog" className={navLinkClass}>
                Blog
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                Contact Us
              </NavLink>
            </nav>

            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-200 hover:text-amber-400 hover:bg-white/10 rounded-full transition"
              title="Search 250+ Stone Varieties"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Official E-Catalogue Download Button */}
            <a
              href="/brochure.pdf"
              download="ARPRAN_E-Catalogue.pdf"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl transition shadow-md shadow-amber-500/10"
              title="Download Arpran Natural Stone E-Catalogue (PDF)"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>E-Catalogue</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-lg transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0B1528] border-t border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 text-sm font-semibold ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 text-sm font-semibold ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}
            >
              About Us
            </NavLink>

            {/* Mobile Products Expandable */}
            <div className="py-2.5 border-y border-slate-800 my-1">
              <div className="flex items-center justify-between mb-2">
                <NavLink
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-wider text-amber-400"
                >
                  Natural Stone Collections
                </NavLink>
                <Link
                  to="/products/rough-blocks"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40"
                >
                  🏗️ Rough Blocks
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pl-1 text-xs text-slate-300">
                {navCategories.map(cat => {
                  const isRough = cat.slug === 'rough-blocks';
                  return (
                    <Link
                      key={cat.slug}
                      to={`/products/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-1.5 px-2 rounded transition truncate flex items-center justify-between ${isRough
                        ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-400/40'
                        : 'hover:text-amber-300 hover:bg-slate-800/60'
                        }`}
                    >
                      <span className="truncate">• {cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <NavLink
              to="/finishes"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 text-sm font-semibold ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}
            >
              Stone Finishes
            </NavLink>

            <NavLink
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 text-sm font-semibold ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}
            >
              Blog
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 text-sm font-semibold ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}
            >
              Contact Us
            </NavLink>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/brochure.pdf"
                download="ARPRAN_E-Catalogue.pdf"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-800/80 text-white text-sm font-semibold border border-slate-700"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" /> E-catalogue (PDF)
                </span>
                <Download className="w-4 h-4 text-amber-400" />
              </a>

              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-sm font-bold uppercase tracking-wider shadow-md"
              >
                <Sparkles className="w-4 h-4 text-slate-950" /> Request Stone Quotation
              </Link>
            </div>
          </div>
        )}

        {/* Global Search Bar Overlay */}
        {isSearchOpen && (
          <div className="border-t border-slate-800 bg-[#070E1C] px-4 py-3 text-white">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search across all 250 stones (e.g. Alaska White, Makrana, Copper Veneer, Cobble, Bench)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs uppercase tracking-wider text-slate-300 hover:text-white border border-slate-700 px-2.5 py-1 rounded"
              >
                Close
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
