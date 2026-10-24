import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ChevronRight, ChevronLeft, MessageSquare, ShieldCheck, Box,
  Globe2, Layers, CheckCircle2, ArrowRight, Download, FileText,
  Compass, Award, Truck, Check, Building2, Package, Users, Gem
} from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';
import CATALOG_DATA from '../data/catalog.json';
import SEO from '../components/SEO';
import { useCMS } from '../context/CMSContext';

// Bright Luxury Architectural Slides for Hero Section
const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero/slide-1.jpg',
    tag: 'Opulent White Marble Architecture',
    subtitle: 'Makrana White, Calacatta & Statuario Series',
    highlight: 'Polished Gangsaw Slabs'
  },
  {
    id: 2,
    image: '/images/hero/slide-2.jpg',
    tag: 'Illuminated Stone Walls & Veneers',
    subtitle: 'Ultra-Thin 2mm Natural & Translucent Stone Veneer',
    highlight: 'Peel & Stick Cladding'
  },
  {
    id: 3,
    image: '/images/hero/bright-landscaping-paving.jpg',
    tag: 'Architectural Landscaping & Paving',
    subtitle: 'Sandstone Paving, Cobbles, Pebbles & Stone Benches',
    highlight: 'Direct Quarry Sourcing'
  },
  {
    id: 4,
    image: '/images/hero/luxury-stone-villa.jpg',
    tag: 'Opulent White Marble Architecture',
    title: 'The World of Natural Stones',
    subtitle: 'Makrana White, Calacatta & Statuario Series',
    highlight: 'Direct Quarry Heritage'
  }
];

export default function HomePage({ onOpenProduct, onOpenBlog }) {
  const { heroSlides, catalogMap, settings, pages, blogs: cmsBlogs } = useCMS();
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const homeData = pages?.home?.content || {};
  const heroCard = homeData.hero_card || {};
  const aboutPrev = homeData.about_preview || {};
  const collPrev = homeData.collections_preview || {};
  const finPrev = homeData.finishes_preview || {};
  const blogPrev = homeData.blog_preview || {};
  const whyChoose = homeData.why_choose || {};
  const categoryCards = collPrev.category_cards || {};
  const bottomCtaText = collPrev.bottom_cta_text || "";
  const bottomCtaLink = collPrev.bottom_cta_link || "/products";
  const aboutTrustStrip = aboutPrev.trust_strip || [];

  const activeSlides = (heroSlides && heroSlides.length > 0) ? heroSlides : HERO_SLIDES;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const rawCategories = Object.keys(catalogMap || CATALOG_DATA);
  const categories = rawCategories.filter(cat => {
    const lower = cat.toLowerCase();
    return (
      lower !== 'quartz series' &&
      lower !== 'wall cladding' &&
      !lower.includes('semi-precious') &&
      !lower.includes('semi precious')
    );
  });
  const currentSlide = activeSlides[currentHeroSlide % activeSlides.length] || activeSlides[0];
  const subtagline = settings?.subtagline || COMPANY_INFO.subtagline;
  const motto = heroCard.motto || settings?.motto || COMPANY_INFO.motto;
  const heroDescription = currentSlide.description || heroCard.description || "Calibrated gangsaw granite slabs, pristine Makrana marble, quartzite, sandstone, slate, natural stone veneers, and handcrafted landscaping exported from India worldwide.";

  // Dynamic metrics from CMS
  const metrics = (heroCard.metrics || [
    { value: "8", label: "Collections" },
    { value: "200+", label: "Varieties" },
    { value: "", label: "" },
    { value: "Worldwide", label: "Export" }
  ]).map(m => m.label?.toLowerCase().includes('collection') ? { ...m, value: String(categories.length || 8) } : m);

  // Dynamic hubs & pillars for about preview
  const rawHubs = aboutPrev.hubs || [
    { title: "Jaipur, India", subtitle: "Gangsaw Processing & Corporate HQ" }
  ];
  const hubs = rawHubs.filter(h => !h.title?.toLowerCase().includes('melbourne') && !h.subtitle?.toLowerCase().includes('melbourne'));

  const targetAboutHeading = "Arpran Industries Offers Premium Natural Stone for Modern Architecture & Landscaping";
  const targetAboutDesc = "Discover premium natural stone crafted to bring timeless beauty, durability, and character to modern architecture and landscaping. Arpran Industries offers a carefully selected range of natural stones, ideal for creating elegant interiors, striking exteriors, and exceptional outdoor spaces.";

  const activeAboutHeading = (aboutPrev.heading && !aboutPrev.heading.toLowerCase().includes("architectural mastery"))
    ? aboutPrev.heading
    : targetAboutHeading;

  const aboutDescription = (aboutPrev.description && !aboutPrev.description.toLowerCase().includes("stone capital of india"))
    ? aboutPrev.description
    : targetAboutDesc;

  const targetPillars = [
    {
      num: "01",
      title: "Direct Quarry Sourcing",
      text: "Source premium natural stone directly from trusted quarries, ensuring better material selection, consistent quality, and reliable supply for every project."
    },
    {
      num: "02",
      title: "Zero-Deviation Slabs",
      text: "Precision natural stone slabs with controlled thickness and accurate dimensions, making fabrication and installation faster and more efficient."
    },
    {
      num: "03",
      title: "Dry-Lay & Vein Matching",
      text: "Every slab is carefully inspected, dry-laid, and book matched to create seamless patterns and visually balanced surfaces across luxury spaces."
    },
    {
      num: "04",
      title: "Secure Stone Packaging",
      text: "Secure, export-ready packaging designed to protect premium marble and natural stone slabs during handling, transportation, and international delivery."
    }
  ];

  const pillars = (aboutPrev.pillars && aboutPrev.pillars.length === 4 && !aboutPrev.pillars[0].title?.includes("Quarry Direct Control"))
    ? aboutPrev.pillars
    : targetPillars;



  // Dynamic finishes preview items
  const finishesItems = finPrev.items || [
    {
      title: "Polished Finish",
      tag: "High Gloss (85° - 95°)",
      image: "/images/finish-polished.jpg",
      description: "Diamond abrasive polishing lines produce a mirror-like high reflective luster that intensifies natural veining and rich mineral coloration.",
      category: "Flooring, Walls & Slabs",
      link: "/finishes"
    },
    {
      title: "Flamed / Thermal Finish",
      tag: "High Traction Non-Slip",
      image: "/images/finish-flamed.jpg",
      description: "High-temperature oxy-acetylene torching bursts surface quartz grains, creating a rugged tactile slip-resistant exterior texture.",
      category: "Paving, Pathways & Decks",
      link: "/finishes"
    },
    {
      title: "Honed Finish",
      tag: "Smooth Velvet Matte",
      image: "/images/finish-honed.jpg",
      description: "Satin-smooth matte grinding delivers an understated contemporary surface with zero glare and exceptional tactile warmth.",
      category: "Bathrooms & Modern Interiors",
      link: "/finishes"
    }
  ];

  // Dynamic blogs for preview
  const displayBlogs = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs.slice(0, 3) : [
    {
      id: 1,
      title: "Top Indian Granites Trending in Luxury Architecture",
      category: "Architecture & Trends",
      image: "/images/blog-granite.jpg",
      excerpt: "From Viscon White to Black Galaxy, discover why Indian granites remain the first choice for architects across Europe, the Middle East, and North America."
    },
    {
      id: 2,
      title: "Polish vs. Flamed vs. Honed: Selecting the Right Stone Finish",
      category: "Technical Guide",
      image: "/images/stone-finishes-guide.jpg",
      excerpt: "Understand how surface treatments impact slip resistance, light reflection, and longevity in commercial vs residential applications."
    },
    {
      id: 3,
      title: "The Timeless Legacy of Makrana White Marble",
      category: "Heritage & Materials",
      image: "/images/blog-makrana.jpg",
      excerpt: "The iconic 99% pure calcite marble of Rajasthan that built the Taj Mahal continues to define contemporary luxury monuments worldwide."
    }
  ];

  return (
    <div>
      <SEO
        title="Luxury Natural Stone, Granite & Marble Exporter"
        description="Arpran Industries Pvt. Ltd. — Bringing Nature's Elegance to Life. Direct quarry supply of Indian Granite, Makrana White Marble, Sandstone, and Flexible Stone Veneer from Jaipur to international projects."
        keywords="Arpran Industries, natural stone supplier, Indian granite exporter, Makrana white marble, stone veneer Jaipur, architectural paving, gangsaw slabs"
        canonicalPath="/"
      />

      {/* 1. HERO SECTION - 100% Full-Bleed Ultra-HD Photographic Carousel */}
      <section className="relative min-h-[440px] sm:min-h-[480px] lg:h-[520px] flex items-center overflow-hidden border-b border-slate-200 bg-slate-50">

        {/* Background Auto-Slider - 100% Full-Bleed Ultra-HD Photographic Carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {activeSlides.map((slide, index) => {
            const isActive = index === currentHeroSlide;

            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.tag || slide.title || "Arpran Luxury Natural Stone"}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <Link
                  to={slide.button_link || "/products"}
                  className="absolute inset-0 z-10 cursor-pointer"
                  aria-label={slide.title || "Explore Natural Stones"}
                />
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation - Previous Arrow */}
        <button
          type="button"
          onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-white/50 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer group shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Carousel Navigation - Next Arrow */}
        <button
          type="button"
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % activeSlides.length)}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 hover:border-white/50 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer group shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </section>

      {/* 2. ABOUT US PREVIEW SECTION: Ultra-Luxury Architectural Heritage Showcase */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#F5F2EB] via-[#FAF7F0] to-[#EFEAE0] border-y border-[#E2D8C3] relative overflow-hidden">

        {/* Subtle Ambient Architectural Lighting Background Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: High-End Brand Heritage & Global Operational Hubs */}
            <div className="lg:col-span-6 space-y-5">

              {/* Luxury Micro-Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D8C7A5] text-[11px] font-bold tracking-[0.2em] uppercase text-[#99732B] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#99732B]" />
                <span>{aboutPrev.badge || "Company Legacy & Quarry Origins"}</span>
              </div>

              {/* Main Headline with Clean Modern Sans-Serif Styling */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium text-slate-900 leading-[1.2] tracking-tight">
                {activeAboutHeading}
              </h1>


              {/* Story Narrative */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {aboutDescription}
              </p>

              {/* Prestigious Global Hubs Cards */}
              <div className={`grid gap-4 pt-1 ${hubs.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-sm'}`}>
                {hubs.map((hub, idx) => {
                  const isJaipur = idx === 0 || hub.title?.toLowerCase().includes('jaipur');
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-[#E2D8C3] shadow-[0_4px_16px_rgba(184,144,71,0.06)] hover:shadow-lg hover:border-[#B89047] transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#FBF7EE] text-[#B89047] group-hover:bg-[#B89047] group-hover:text-white transition-colors flex items-center justify-center">
                          {isJaipur ? <Building2 className="w-4 h-4" /> : <Globe2 className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#F5EFE3] text-[#8C6823] group-hover:bg-[#B89047] group-hover:text-white transition-colors">
                          {isJaipur ? "Processing HQ" : "Export Logistics"}
                        </span>
                      </div>
                      <div className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#B89047] transition-colors">
                        {hub.title}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 leading-snug">
                        {hub.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Area: Luxury Button & Trust Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-5">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B89047] to-[#A37E3A] hover:from-[#A37E3A] hover:to-[#8E6C2E] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <span>{aboutPrev.link_text || "READ OUR FULL BRAND HERITAGE & INFRASTRUCTURE STORY"}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                  {aboutTrustStrip.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>•</span>}
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {item}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: 4 Architectural Capability Pillars */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {pillars.map((pillar, idx) => {
                const pillarIcons = [
                  <Compass key={0} className="w-4 h-4 text-amber-400" />,
                  <Layers key={1} className="w-4 h-4 text-amber-400" />,
                  <ShieldCheck key={2} className="w-4 h-4 text-amber-400" />,
                  <Truck key={3} className="w-4 h-4 text-amber-400" />
                ];
                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-[#0B1528] via-[#0E1D38] to-[#07101E] p-6 rounded-2xl sm:rounded-3xl text-white shadow-xl hover:shadow-2xl border border-amber-500/30 hover:border-amber-400 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Background subtle watermark number */}
                    <span className="absolute -bottom-2 -right-1 text-6xl font-serif font-bold text-amber-400/[0.08] select-none pointer-events-none group-hover:text-amber-400/[0.14] transition-colors">
                      {pillar.num || `0${idx + 1}`}
                    </span>

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shadow-2xs">
                          {pillar.num || `0${idx + 1}`}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-800/90 text-amber-400 border border-slate-700/80 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          {pillarIcons[idx % pillarIcons.length]}
                        </div>
                      </div>

                      <h3 className="font-serif font-semibold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors">
                        {pillar.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {pillar.text || pillar.description}
                      </p>
                    </div>

                    {/* Bottom subtle gold accent line on hover */}
                    <div className="w-8 h-0.5 bg-amber-500/40 group-hover:w-full group-hover:bg-amber-400 transition-all duration-500 mt-4 rounded-full" />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 3. 11 COLLECTIONS SHOWCASE PREVIEW: Official Architectural Stone Pavilion */}
      <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Official Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF7EE] border border-[#EADCC0] text-[11px] font-bold tracking-[0.2em] uppercase text-[#B89047] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B89047]" />
                <span>{collPrev.badge || "Certified Natural Stone Pavilion"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-medium text-slate-900 tracking-tight leading-tight">
                Our Natural{' '}
                <span className="text-[#B89047] font-semibold">
                  Stone Collections
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
                {collPrev.description || "Curated export-grade varieties of Granite, Makrana Marble, Sandstone, Slate, Quartzite, Limestone, Natural Stone Veneers, Paving & Artifacts exported worldwide."}
              </p>
            </div>

            <Link
              to={collPrev.cta_link || "/products"}
              className="px-6 py-3.5 bg-gradient-to-r from-[#B89047] to-[#A37E3A] hover:from-[#A37E3A] hover:to-[#8E6C2E] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-xl hover:scale-[1.01] flex items-center gap-2 shrink-0 self-start md:self-end"
            >
              <span>{collPrev.cta_text || `View All ${categories.length || 9} Collections`}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Category Cards with 100% Uniform Heights & Pixel-Perfect Aspect Ratios (3 per line) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              'Granite Series',
              'Marble Series',
              'Rough Blocks',
              'Quartzite Series',
              'Sandstone Series',
              'Slate Stone',
              'Stone Veneer',
              'Limestone Series',
              'Landscaping & Furniture'
            ].map((catName) => {
              const items = (catalogMap && catalogMap[catName]) || CATALOG_DATA[catName] || [];
              const firstItem = items[0] || {};

              // Curated official configuration for each of the categories matching user exact specification
              const CATEGORY_SHOWCASE_CONFIG = {
                'Granite Series': {
                  slug: 'granite-series',
                  image: '/images/hero/granite-series-hero.jpg',
                  specBadge: 'Multi-Wire Gangsaw Slabs',
                  desc: 'Computerized diamond gangsaw slabs (20mm/30mm) in Black Galaxy, Viscon White & Tan Brown for commercial towers and countertops.'
                },
                'Marble Series': {
                  slug: 'marble-series',
                  image: '/images/hero/marble-series-hero.jpg',
                  specBadge: 'Makrana & Calcite Slabs',
                  desc: 'Pristine Makrana white marble, Fantasy Brown, and exotic veined calcite slabs sliced with diamond gangsaw precision for luxury villas.'
                },
                'Rough Blocks': {
                  slug: 'rough-blocks',
                  image: '/images/hero/rough-blocks-hero.jpg',
                  specBadge: 'Quarry Monoliths (6-9 cbm)',
                  desc: 'Direct quarry extraction rights, dressed 6-sided gangsaw blocks with ultrasonic crack inspection for international stone factories.'
                },
                'Quartzite Series': {
                  slug: 'quartzite-series',
                  image: '/images/hero/quartzite-series-hero.jpg',
                  specBadge: 'Mohs Hardness 7 Slabs',
                  desc: 'Exotic crystalline metamorphic slabs (Silver Shine, Copper) with zero acid etching and diamond durability for focal feature walls.'
                },
                'Sandstone Series': {
                  slug: 'sandstone-series',
                  image: '/images/hero/sandstone-series-hero.jpg',
                  specBadge: 'CE Certified Paving',
                  desc: 'Natural cleft Kandla Grey & Raj Green patio packs, sawn smooth paving slabs, and bullnose pool copings with R11 non-slip rating.'
                },
                'Slate Stone': {
                  slug: 'slate-stone',
                  image: '/images/hero/slate-stone-hero.jpg',
                  specBadge: 'Natural Cleft Tiles',
                  desc: 'Foliated non-slip floor tiles, interlocking Z-cladding panels & rustic copper hearth stones with low water absorption.'
                },
                'Stone Veneer': {
                  slug: 'stone-veneer',
                  image: '/images/hero/stone-veneer-hero.jpg',
                  specBadge: 'Ultra-Thin 2mm Flexible',
                  desc: 'Revolutionary real stone sheets with fiberglass flexibility for curved columns, lightweight ceilings, and translucent backlit bars.'
                },
                'Limestone Series': {
                  slug: 'limestone-series',
                  image: '/images/hero/limestone-series-hero.jpg',
                  specBadge: 'High-Traffic Architectural Limestone',
                  desc: 'Premium Kadappa Black, Tandur & Jaisalmer limestones offering superior wear resistance and cool-foot properties for civic concourses.'
                },
                'Landscaping & Furniture': {
                  slug: 'landscaping-and-furniture',
                  image: '/images/hero/bright-landscaping-paving.jpg',
                  specBadge: 'Solid Carved Monoliths',
                  desc: 'Hand-sculpted granite benches, tiered sandstone water fountains, planters, stepping stones, and radial cobblestones for civic parks.'
                }
              };

              const config = (categoryCards && categoryCards[catName]) || CATEGORY_SHOWCASE_CONFIG[catName] || {
                slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                image: firstItem.image || '/images/hero/granite-series-hero.jpg',
                specBadge: 'Architectural Stone',
                desc: 'Export-grade certified natural stone processed to precision architectural project dimensions.'
              };

              const cardTargetUrl = `/products/${config.slug}`;

              return (
                <Link
                  key={catName}
                  to={cardTargetUrl}
                  className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_8px_30px_rgba(4,23,56,0.06)] hover:shadow-[0_20px_50px_rgba(184,144,71,0.12)] hover:border-[#B89047] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Fixed, Calibrated Image Container (100% Uniform Height & Alignment) */}
                    <div className="h-56 sm:h-60 w-full relative overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={`${config.image}?v=4`}
                        alt={`${catName} - ARPRAN Industries`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6">
                      <h3 className="font-semibold text-lg sm:text-xl text-slate-900 group-hover:text-[#B89047] transition-colors line-clamp-1">
                        {catName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">
                        {config.desc}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Bar */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#B89047] group-hover:text-[#8E6C2E]">
                      <span>Explore Collection & Slabs</span>
                      <div className="w-7 h-7 rounded-full bg-[#FBF7EE] group-hover:bg-[#B89047] text-[#B89047] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Direct CTA Strip */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={bottomCtaLink}
              className="inline-flex items-center gap-2 px-7 py-3 bg-slate-900 hover:bg-[#B89047] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-xl"
            >
              <span>{bottomCtaText}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. STONE FINISHES PREVIEW (Bright Luxury Edition) */}
      <section className="py-12 sm:py-14 bg-slate-50 text-slate-800 border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B89047] bg-[#FBF7EE] px-3.5 py-1.5 rounded-full border border-[#EADCC0] shadow-2xs">
              {finPrev.badge || "Surface Technology"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 mt-3.5">
              {finPrev.heading ? (
                <span>{finPrev.heading}</span>
              ) : (
                <>Available Architectural <span className="italic text-[#B89047]">Stone Finishes</span></>
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              {finPrev.description || "Transforming raw quarried blocks into mirror-like polished slabs, non-slip flamed outdoor pavers, and velvety honed indoor textures."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {finishesItems.map((finish, fidx) => (
              <div
                key={fidx}
                className="bg-white border border-slate-200/90 hover:border-[#B89047]/50 rounded-2xl overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={finish.image}
                      alt={finish.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {finish.tag && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                        {finish.tag}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif font-medium text-xl sm:text-2xl text-slate-900 mb-2.5 group-hover:text-[#B89047] transition-colors">
                      {finish.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {finish.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-[#B89047] font-semibold">
                  <span className="text-slate-500 font-normal">{finish.category || 'Architectural Stone'}</span>
                  <Link to={finish.link && finish.link !== '/finishes' ? finish.link : '/products'} className="text-[#B89047] hover:text-[#8E6C2E] flex items-center gap-1 group/link transition-colors font-bold">
                    <span>Learn More</span>
                    <span className="group-hover/link:translate-x-1 transition-transform">›</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to={finPrev.cta_link && finPrev.cta_link !== '/finishes' ? finPrev.cta_link : '/products'}
              className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#B89047] to-[#A37E3A] hover:from-[#A37E3A] hover:to-[#8E6C2E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-xl hover:scale-[1.01]"
            >
              <span>{finPrev.cta_text || "Explore All Stone Varieties & Products"}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. WHY ARCHITECTS & BUILDERS CHOOSE ARPRAN & SAMPLE BOX */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAFAF8] via-[#F6F4EE] to-[#EFECE3]/70 border-y border-stone-200/90 relative overflow-hidden">
        {/* Luminous Ambient Architectural Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-b from-[#B89047]/10 via-[#B89047]/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-10 w-96 h-96 bg-stone-200/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EADCC0] shadow-[0_2px_12px_rgba(184,144,71,0.06)] text-[#B89047] text-xs font-semibold tracking-[0.16em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] animate-pulse" />
              <span>{whyChoose.badge || "Architectural Partnership & Advantage"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-slate-900 tracking-[-0.03em] leading-[1.18] mt-3">
              {whyChoose.heading || <>Why Leading Architects & Builders <span className="text-[#B89047]">Trust ARPRAN</span></>}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed font-normal max-w-2xl mx-auto">
              {whyChoose.description || "From direct quarry extraction to computerized diamond gangsaw slicing, dry-lay sequencing, and seaworthy containerized export, we deliver precision natural stone tailored for landmark architecture."}
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 sm:mb-10">
            {(whyChoose.pillars || [
              {
                num: "01",
                title: "Direct Quarry Ownership",
                badge: "Direct Origin",
                description: "Private mining leases across Makrana, Rajsamand, Jodhpur & Southern granite belts guarantee genuine color continuity, zero broker markups, and monolithic block integrity.",
                checkpoints: ["100% Traceable Quarry Sourcing", "Consistent Veining & Texture"]
              },
              {
                num: "02",
                title: "Zero-Deviation Gangsaw",
                badge: "±1mm Tolerance",
                description: "Computerized diamond multi-wire gangsaws slice calibrated slabs to exact millimeter specs. Zero thickness deviation prevents uneven floor lips and ensures flush facade cladding.",
                checkpoints: ["Calibrated 18mm / 20mm / 30mm", "Diamond Polish Up to 95° Gloss"]
              },
              {
                num: "03",
                title: "Dry-Lay & Vein Matching",
                badge: "Pre-Inspection",
                description: "Every sequence is dry-laid in our Jaipur inspection facility before dispatch. Slabs are bookmatched, numbered sequentially, and high-res video proof is shared for client sign-off.",
                checkpoints: ["Bookmatched Sequence Numbering", "Zero Hairline Crack Guarantee"]
              },
              {
                num: "04",
                title: "ISPM-15 Seaworthy Crating",
                badge: "Port Dispatch",
                description: "Heavy-duty pine A-frames, fumigation certified, waterproof plastic shrink-wrap, and steel banding safeguard slabs for transit from Mundra Port to job sites across 25+ countries.",
                checkpoints: ["Fumigated Seaworthy Packaging", "Direct Mundra / Nhava Sheva Ports"]
              }
            ]).map((pillar, idx) => {
              const icons = [Compass, Layers, CheckCircle2, Truck];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-b from-[#FDFBF7] to-[#F7F3EA] border border-[#EAE3D2] hover:border-[#B89047] rounded-2xl p-6 sm:p-7 shadow-[0_6px_22px_rgba(184,144,71,0.06)] hover:shadow-[0_16px_35px_rgba(184,144,71,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B89047] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-white text-[#B89047] flex items-center justify-center group-hover:bg-[#B89047] group-hover:text-white transition-all duration-300 shadow-xs border border-[#EFE7D7]">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FBF7EE] text-[#B89047] border border-[#EADCC0] shadow-2xs">
                        {pillar.badge || `Pillar ${idx + 1}`}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-[#B89047] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {pillar.description || pillar.text}
                    </p>
                  </div>
                  {pillar.checkpoints && pillar.checkpoints.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-[#EFE7D7] space-y-1.5 text-xs font-medium text-slate-600">
                      {pillar.checkpoints.map((cp, cpidx) => (
                        <div key={cpidx} className="flex items-center gap-2 text-slate-800">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Architectural Sample Box Callout */}
          {(() => {
            const sampleBox = whyChoose.sample_box || {};
            const sampleBullets = sampleBox.bullets || [
              "Real quarried slab cuts (150×150×20mm)",
              "Side-by-side surface finish comparison",
              "Physical ASTM / CE technical test reports",
              "Express international courier delivery"
            ];
            const sampleSwatches = sampleBox.swatches || [
              { name: "Makrana White", tag: "High Gloss", subtitle: "Mirror Polish 90°+", image: "/images/finish-polished.jpg" },
              { name: "Black Galaxy", tag: "Non-Slip R11", subtitle: "Thermal Flamed", image: "/images/finish-flamed.jpg" },
              { name: "Kandla Grey", tag: "Velvet Matte", subtitle: "Satin Honed", image: "/images/finish-honed.jpg" },
              { name: "Tan Brown", tag: "Tactile", subtitle: "Leather Touch", image: "/images/blog-granite.jpg" }
            ];

            return (
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-[#FDFBF7] to-[#F7F3EA] text-slate-800 p-6 sm:p-8 shadow-xl border border-[#EAE3D2]">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#B89047]/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF7EE] border border-[#EADCC0] text-[#B89047] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
                      <Package className="w-3.5 h-3.5 text-[#B89047]" />
                      <span>{sampleBox.badge || "Architect & Builder Exclusive Service"}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 tracking-normal leading-tight">
                      {sampleBox.title || <>Request an Architectural <span className="italic text-[#B89047]">Stone Sample Box</span></>}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed font-normal">
                      {sampleBox.description || "Working on a luxury residential villa, commercial facade, hotel lobby, or landscaping development? Touch and evaluate our natural stone caliber in person. We dispatch bespoke 150×150mm tile specimens with your specified surface finishes (Polished, Flamed, Honed, Leather) directly to your studio."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 pt-5 border-t border-stone-200 text-xs sm:text-sm text-slate-700">
                      {sampleBullets.map((bullet, bidx) => (
                        <div key={bidx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#B89047] shrink-0" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Link
                        to={sampleBox.cta_button_link || "/contact?subject=Sample+Box+Request"}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#B89047] to-[#A37E3A] hover:from-[#A37E3A] hover:to-[#8E6C2E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-xl hover:scale-[1.02]"
                      >
                        <Package className="w-4 h-4" />
                        <span>{sampleBox.cta_button_text || "Request Free Sample Box"}</span>
                      </Link>

                      {(sampleBox.catalogue_button_link || "/brochure.pdf") && (
                        <a
                          href={sampleBox.catalogue_button_link || "/brochure.pdf"}
                          download
                          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-slate-700 hover:text-[#B89047] font-bold text-xs uppercase tracking-wider rounded-xl border border-stone-300 transition-all shadow-xs"
                        >
                          <Download className="w-4 h-4 text-[#B89047]" />
                          <span>{sampleBox.catalogue_button_text || "Download E-Catalogue (PDF)"}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xl relative">
                      <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs">
                        <span className="font-bold text-[#B89047] uppercase tracking-widest flex items-center gap-1.5">
                          <Box className="w-4 h-4" />
                          {sampleBox.studio_kit_title || "ARPRAN Studio Kit"}
                        </span>
                        <span className="text-stone-500">{sampleBox.studio_kit_subtitle || "Specimen Dimensions: 150×150mm"}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 my-5">
                        {sampleSwatches.map((swatch, sidx) => (
                          <div key={sidx} className="rounded-xl overflow-hidden border border-stone-200/80 bg-white group/swatch shadow-2xs hover:shadow-md transition-shadow">
                            <div className="h-24 w-full overflow-hidden relative">
                              <img
                                src={swatch.image}
                                alt={swatch.name}
                                className="w-full h-full object-cover group/swatch:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                              <span className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-[10px] font-bold text-white uppercase tracking-wider">
                                {swatch.tag}
                              </span>
                            </div>
                            <div className="p-2.5">
                              <p className="text-xs font-bold text-slate-900 truncate">{swatch.name}</p>
                              <p className="text-[10px] text-[#B89047] font-semibold">{swatch.subtitle}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-[#FBF7EE] border border-[#EADCC0] flex items-center justify-between text-xs text-slate-700">
                        <span>{sampleBox.studio_kit_badge || "Includes ASTM Physical Test Data Sheets"}</span>
                        <span className="text-[#B89047] font-bold">{sampleBox.studio_kit_highlight || "100% Free for Architects"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 6. DYNAMIC BLOG & JOURNAL PREVIEW (Connected to CMS Tab 5) */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBF7EE] border border-[#EADCC0] text-[11px] font-bold tracking-[0.2em] uppercase text-[#B89047] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B89047]" />
                <span>{blogPrev.badge || "Architectural Stone Journal"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-medium text-slate-900 tracking-tight leading-tight">
                {blogPrev.heading || "Latest Insights & Material Specification Guides"}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
                {blogPrev.description || "Explore technical analyses on diamond gangsaw fabrication, quarry geology, slip-resistance engineering, and innovative surface treatments from our technical team."}
              </p>
            </div>

            <Link
              to={blogPrev.cta_link || "/blog"}
              className="px-6 py-3.5 bg-gradient-to-r from-[#B89047] to-[#A37E3A] hover:from-[#A37E3A] hover:to-[#8E6C2E] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-xl hover:scale-[1.01] flex items-center gap-2 shrink-0 self-start md:self-end"
            >
              <span>{blogPrev.cta_text || "Explore Full Stone Journal"}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {displayBlogs.map((b) => (
              <article
                key={b.id}
                onClick={() => onOpenBlog ? onOpenBlog(b) : null}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-[#B89047] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="h-52 w-full overflow-hidden bg-slate-200 relative">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                      {b.category || "Architecture"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif font-semibold text-lg text-slate-900 mb-2 group-hover:text-[#B89047] transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {b.excerpt || b.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-[#B89047] font-semibold">
                  <span className="text-slate-500 font-normal">{b.read_time || b.readTime || "5 min read"}</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
