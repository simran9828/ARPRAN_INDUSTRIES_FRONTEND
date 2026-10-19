import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, Filter, X, ChevronRight, MessageSquare,
  Sparkles, CheckCircle2, Download, Eye, ArrowUpRight
} from 'lucide-react';
import CATALOG_DATA from '../data/catalog.json';
import { COMPANY_INFO } from '../data/stoneData';
import SEO from '../components/SEO';
import { useCMS } from '../context/CMSContext';

const COLOR_SHADES = [
  { id: 'all', label: 'All Shades', dot: 'bg-gradient-to-r from-slate-400 to-slate-700' },
  { id: 'white', label: 'White & Light', dot: 'bg-slate-200 border border-slate-300', keywords: ['white', 'ivory', 'statuario', 'alaska', 'calacatta', 'makrana', 'ice', 'snow', 'kashmir', 'bhama', 'viscon'] },
  { id: 'black', label: 'Black & Dark', dot: 'bg-slate-900', keywords: ['black', 'dark', 'galaxy', 'absolute', 'coin', 'pebble', 'carbon'] },
  { id: 'grey', label: 'Grey & Silver', dot: 'bg-slate-400', keywords: ['grey', 'gray', 'silver', 'steel', 'sira', 'paradiso', 'lavender'] },
  { id: 'gold', label: 'Gold & Yellow', dot: 'bg-amber-400', keywords: ['gold', 'yellow', 'crystal', 'imperial', 'amber', 'tiger', 'sahara'] },
  { id: 'red', label: 'Red & Pink', dot: 'bg-rose-400', keywords: ['red', 'pink', 'lakha', 'chima', 'ruby', 'rosy', 'bala', 'jhansi', 'classic pink'] },
  { id: 'exotic', label: 'Green & Exotic', dot: 'bg-emerald-500', keywords: ['green', 'spider', 'rainforest', 'emerald', 'copper', 'tropical', 'blue', 'teak'] }
];

export default function ProductsPage({ onOpenProduct }) {
  const { catalogMap, pages } = useCMS();
  const productsPageData = pages?.products;
  const pageContent = productsPageData?.content || {};
  const headerBadge = pageContent.badge || "Architectural Stone Catalog";
  const headerTitle = productsPageData?.h1 || pageContent.h1 || "Comprehensive Architectural Stone Collections";
  const headerSubtitle = productsPageData?.tagline || pageContent.tagline || "Over 250 hand-selected stone varieties spanning 12 distinct categories. Calibrated gangsaw slabs, dimensional tiles, and ultra-thin flexible veneers processed directly in Rajasthan.";

  const [searchParams, setSearchParams] = useSearchParams();
  const currentCatalog = catalogMap || CATALOG_DATA;
  const categoriesList = useMemo(() => {
    return Object.keys(currentCatalog).filter(cat => {
      const lower = cat.toLowerCase();
      return (
        lower !== 'quartz series' &&
        lower !== 'wall cladding' &&
        !lower.includes('semi-precious') &&
        !lower.includes('semi precious')
      );
    });
  }, [currentCatalog]);

  const paramCategory = searchParams.get('category');
  const paramSearch = searchParams.get('search');

  const [activeTab, setActiveTab] = useState(paramCategory || categoriesList[0] || 'Granite Series');
  const [searchTerm, setSearchTerm] = useState(paramSearch || '');
  const [selectedColorFilter, setSelectedColorFilter] = useState('all');
  const [visibleItemsCount, setVisibleItemsCount] = useState(16);

  // Sync with URL parameters if changed from navbar
  useEffect(() => {
    if (paramCategory && categoriesList.includes(paramCategory)) {
      setActiveTab(paramCategory);
      setVisibleItemsCount(16);
    }
    if (paramSearch !== null) {
      setSearchTerm(paramSearch);
      setVisibleItemsCount(16);
    }
  }, [paramCategory, paramSearch, categoriesList]);

  // Flatten all products across all categories for universal search
  const allProducts = useMemo(() => {
    const list = [];
    Object.entries(currentCatalog).forEach(([catName, items]) => {
      items.forEach((it) => {
        list.push({ ...it, categoryName: catName });
      });
    });
    return list;
  }, [currentCatalog]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let pool = searchTerm ? allProducts : (currentCatalog[activeTab] || []).map(it => ({ ...it, categoryName: activeTab }));

    if (term) {
      pool = pool.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(term))
      );
    }

    if (selectedColorFilter !== 'all') {
      const activeColorObj = COLOR_SHADES.find(c => c.id === selectedColorFilter);
      if (activeColorObj && activeColorObj.keywords) {
        pool = pool.filter(p => {
          const nameLower = p.name.toLowerCase();
          return activeColorObj.keywords.some(k => nameLower.includes(k));
        });
      }
    }

    return pool;
  }, [searchTerm, activeTab, selectedColorFilter, allProducts]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleItemsCount);
  }, [filteredProducts, visibleItemsCount]);

  const handleCategorySelect = (cat) => {
    setActiveTab(cat);
    setSearchTerm('');
    setSelectedColorFilter('all');
    setVisibleItemsCount(16);
    setSearchParams({ category: cat });
  };

  return (
    <div>
      <SEO
        title={`${searchTerm ? `Search: "${searchTerm}"` : activeTab} | Natural Stone Collections`}
        description={`Explore ${activeTab} and 250+ architectural natural stones by ARPRAN Industries. Gangsaw granite slabs, Makrana white marble, flexible stone veneers, sandstone paving, and custom cut tiles from Jaipur quarries.`}
        keywords={`${activeTab}, Indian natural stone catalog, granite gangsaw slabs, marble varieties India, sandstone cladding, ARPRAN stones`}
        canonicalPath="/products"
      />

      {/* 1. Header Banner — Blog Style Luxury Dark Background */}
      <section className="bg-gradient-to-b from-[#070E1C] via-[#0B1528] to-[#0E1A32] text-white py-10 sm:py-14 border-b border-slate-800 relative overflow-hidden">
        {/* Ambient Subtle Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-amber-400/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -top-24 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{headerBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-[1.2]">
            {headerTitle}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 max-w-3xl font-normal leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Stone Navigation Pavilion (Bright Edition with Royal Blue Accents) */}
      <section className="bg-slate-50 text-slate-800 py-7 sm:py-8 border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#0A4E9B]">
                {categoriesList.length} Stone Collections (Brochure Caliber)
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-slate-900 mt-1">
                Select Stone Classification
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="bg-blue-50 text-[#0A4E9B] px-3.5 py-1.5 rounded-full border border-blue-200 font-semibold shadow-2xs">
                {filteredProducts.length} Varieties Available
              </span>
            </div>
          </div>

          {/* Category Selector Pills (Bright Clean Boxes with Royal Blue Active State) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {categoriesList.map(cat => {
              const count = CATALOG_DATA[cat]?.length || 0;
              const isActive = activeTab === cat && !searchTerm;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${isActive
                      ? 'bg-gradient-to-r from-[#0A4E9B] to-[#0D5DB8] text-white font-bold shadow-md border-[#0A4E9B] ring-2 ring-blue-200'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-300 hover:shadow-xs'
                    }`}
                >
                  <span className="text-xs font-bold leading-snug line-clamp-1">{cat}</span>
                  <div className={`mt-2 flex items-center justify-between text-[11px] font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    <span>{count} stones</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-cyan-300"></span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dedicated Category Page Link Banner */}
          {!searchTerm && (
            <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 border border-blue-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0A4E9B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#0A4E9B]" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-slate-900 text-base">
                    Dedicated {activeTab} Specifications & Quotation
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    Inspect laboratory technical metrics, 'What is {activeTab}', manufacturing capabilities, gangsaw slabs, FAQs, and submit a direct project quotation.
                  </p>
                </div>
              </div>
              <Link
                to={`/products/${activeTab.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                className="px-5 py-2.5 rounded-xl bg-[#0A4E9B] hover:bg-[#083E7A] text-white font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 shadow-md group/slink"
              >
                <span>Open Dedicated {activeTab} Page</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover/slink:translate-x-1" />
              </Link>
            </div>
          )}

          {/* Search & Color Shade Filter Toolbar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Color Shade Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                Tone:
              </span>
              {COLOR_SHADES.map(cs => (
                <button
                  key={cs.id}
                  onClick={() => setSelectedColorFilter(cs.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${selectedColorFilter === cs.id
                      ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-bold'
                      : 'bg-[#031433] text-slate-300 border-blue-900 hover:border-blue-700'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cs.dot}`}></span>
                  <span>{cs.label}</span>
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="w-full lg:w-80 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stone name (e.g. Makrana, Galaxy)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#031433] border border-blue-900 text-white rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-cyan-400 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 3. Product Gallery Grid (Clean White / Slate-50) */}
      <section className="py-14 bg-slate-50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {searchTerm && (
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-[#0A4E9B]">
              <span>Showing search results for: <strong>"{searchTerm}"</strong> across all 12 stone collections</span>
              <button
                onClick={() => setSearchTerm('')}
                className="underline font-bold"
              >
                Clear Search
              </button>
            </div>
          )}

          {visibleProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-serif font-bold text-slate-800">No stones matched your criteria</h3>
              <p className="text-xs text-slate-500 mt-2">Try clearing your search keyword or switching color tone filters.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedColorFilter('all'); }}
                className="mt-4 px-4 py-2 bg-[#0A4E9B] text-white text-xs font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleProducts.map((stone, idx) => (
                <div
                  key={`${stone.name}-${idx}`}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image Container with Zoom Button */}
                  <div
                    onClick={() => onOpenProduct && onOpenProduct(stone)}
                    className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={`${stone.image}?v=4`}
                      alt={stone.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => { e.target.src = '/logo.png'; }}
                    />

                    <div className="absolute top-2.5 left-2.5 bg-white/92 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-xs backdrop-blur-sm">
                      {stone.categoryName || activeTab}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProduct && onOpenProduct(stone);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                      title="Quick View Specifications"
                    >
                      <Eye className="w-4 h-4 text-[#0A4E9B]" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#0A4E9B] transition line-clamp-1">
                        {stone.name}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenProduct && onOpenProduct(stone)}
                        className="text-xs font-bold text-[#0A4E9B] hover:underline"
                      >
                        Specs ›
                      </button>

                      <a
                        href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Arpran%20Industries,%20please%20send%20slab%20photos%20and%20quotation%20for%20${encodeURIComponent(stone.name)}%20(${encodeURIComponent(stone.categoryName || activeTab)}).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleItemsCount < filteredProducts.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleItemsCount(prev => prev + 16)}
                className="px-8 py-3 bg-[#0A4E9B] hover:bg-[#073b77] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
              >
                Load More Stones ({filteredProducts.length - visibleItemsCount} remaining)
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
