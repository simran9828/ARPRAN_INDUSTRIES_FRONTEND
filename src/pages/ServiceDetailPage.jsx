import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Globe2, Phone, Mail, ArrowRight, CheckCircle2,
  ChevronDown, Search, Download, Sparkles, Sliders, Maximize,
  Grid, MessageSquare, Send, Check, ExternalLink
} from 'lucide-react';
import { SERVICES_LIST, GET_SERVICE_BY_SLUG } from '../data/servicesData';
import CATALOG_DATA from '../data/catalog.json';
import { COMPANY_INFO } from '../data/stoneData';
import SEO from '../components/SEO';
import { useCMS } from '../context/CMSContext';
import PremiumQuoteCard from '../components/PremiumQuoteCard';

export default function ServiceDetailPage({ onOpenProduct }) {
  const { categorySlug, serviceSlug } = useParams();
  const navigate = useNavigate();
  const { catalogMap, services: cmsServices } = useCMS();

  // Find active category / service
  const activeSlug = categorySlug || serviceSlug;
  const service = useMemo(() => {
    if (cmsServices && cmsServices[activeSlug]) {
      return cmsServices[activeSlug];
    }
    return GET_SERVICE_BY_SLUG(activeSlug) || SERVICES_LIST[0];
  }, [activeSlug, cmsServices]);

  // Products belonging to this service category
  const categoryProducts = useMemo(() => {
    if (catalogMap && catalogMap[service.catalogCategory]) {
      return catalogMap[service.catalogCategory];
    }
    return CATALOG_DATA[service.catalogCategory] || [];
  }, [service, catalogMap]);

  // Product search within category
  const [productSearch, setProductSearch] = useState('');
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return categoryProducts;
    const term = productSearch.toLowerCase();
    return categoryProducts.filter((p) => p.name.toLowerCase().includes(term));
  }, [categoryProducts, productSearch]);

  // Quotation form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    destinationPort: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  const handleSelectStoneForQuote = (stoneName) => {
    setFormData((prev) => ({
      ...prev,
      message: `I am interested in requesting FOB/CIF quotation for ${stoneName} under ${service.title}.`
    }));
    // Smooth scroll to hero form
    const formElem = document.getElementById('service-quote-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Mapping of category-specific premium hero images
  const CATEGORY_HERO_MAP = {
    'rough-blocks': '/images/hero/rough-blocks-hero.jpg',
    'granite-series': '/images/hero/granite-series-hero.jpg',
    'marble-series': '/images/hero/marble-series-hero.jpg',
    'sandstone-series': '/images/hero/sandstone-series-hero.jpg',
    'quartzite-series': '/images/hero/quartzite-series-hero.jpg',
    'slate-stone': '/images/hero/slate-stone-hero.jpg',
    'stone-veneer': '/images/hero/stone-veneer-hero.jpg?v=2',
    'limestone-series': '/images/hero/limestone-series-hero.jpg',
    'landscaping-and-furniture': '/images/hero/bright-landscaping-paving.jpg',
  };

  // Robust multi-level fallback cascade for category hero visual
  const firstStoneImage = categoryProducts && categoryProducts[0]?.image;
  const activeHeroImage =
    CATEGORY_HERO_MAP[service.slug] ||
    service.heroImage ||
    firstStoneImage ||
    '/images/hero/slide-1.jpg';

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <SEO
        title={`${service.h1} | ARPRAN Industries`}
        description={service.heroDescription}
        keywords={`${service.title}, ${service.catalogCategory}, Indian stone export, ${service.h1}, Jaipur natural stone supplier`}
        canonicalPath={`/products/${service.slug}`}
      />

      {/* =========================================================================
          1. TOP HERO SECTION: Pure High-Resolution Architectural Image (No Text Overlay)
          ========================================================================= */}
      <section className="relative h-[320px] sm:h-[400px] lg:h-[480px] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
        {/* Full-Width Sunlit Product-Specific Hero Image with Fallback */}
        <img
          src={activeHeroImage}
          alt={`${service.title} - ARPRAN Industries`}
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            if (firstStoneImage && e.target.src !== firstStoneImage) {
              e.target.src = firstStoneImage;
            } else if (e.target.src !== '/images/hero/slide-1.jpg') {
              e.target.src = '/images/hero/slide-1.jpg';
            }
          }}
        />
      </section>


      {/* =========================================================================
          1.5 DEDICATED SECTION: Official Quarry Certification & Technical Profile
          ========================================================================= */}
      <section className="py-14 lg:py-20 bg-slate-50 border-b border-slate-200" id="specifications-quote">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Full Width: Official Technical Profile */}
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-[0_12px_40px_rgba(4,23,56,0.06)] space-y-6">

            {/* Header Badge & Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold tracking-[0.18em] uppercase text-[#0A4E9B]">
                <Sparkles className="w-3.5 h-3.5 text-[#0A4E9B]" />
                <span>Quarry Origins & Technical Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
                {service.h1 || `${service.title} Specifications & Export Profile`}
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {service.heroDescription}
            </p>

            {/* Featured Live Stone Thumbnails Preview (Visual Proof) */}
            {categoryProducts && categoryProducts.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Featured {service.title} Varieties</span>
                  <span className="text-[11px] text-[#0A4E9B] font-semibold">{categoryProducts.length} Available</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {categoryProducts.slice(0, 6).map((st, sidx) => (
                    <div
                      key={sidx}
                      onClick={() => onOpenProduct && onOpenProduct(st)}
                      className="group/thumb cursor-pointer bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-[#0A4E9B] transition-all"
                    >
                      <div className="h-20 sm:h-24 w-full overflow-hidden bg-slate-900 relative">
                        <img
                          src={`${st.image}?v=3`}
                          alt={st.name}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                          onError={(e) => { e.target.src = '/images/finish-polished.jpg'; }}
                        />
                      </div>
                      <div className="p-2 text-center">
                        <span className="text-[11px] font-bold text-slate-900 group-hover/thumb:text-[#0A4E9B] transition-colors line-clamp-1 block">
                          {st.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certified Export Assurances Chips */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Certified Export Assurances
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {(service.trustBadges || []).map((badge, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#0A4E9B] hover:bg-blue-50/50 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0A4E9B] shrink-0" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Quarry Contact Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-700 border-t border-slate-200">
              <a
                href={`tel:${(COMPANY_INFO?.contact?.phone || '+91-94140 68933').replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 text-slate-900 hover:text-[#0A4E9B] font-bold transition"
              >
                <Phone className="w-4 h-4 text-[#0A4E9B]" />
                <span>Quarry Desk: {COMPANY_INFO?.contact?.phone || '+91-94140 68933'}</span>
              </a>
              <div className="inline-flex items-center gap-2 text-slate-600 font-medium">
                <Globe2 className="w-4 h-4 text-[#0A4E9B]" />
                <span>Jaipur HQ & Ocean Port Logistics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECTION: "What is [Service Name]?"
          ========================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Architectural & Geological Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                {service.whatIs?.title || service.title}
              </h2>
              {service.whatIs?.subtitle && (
                <div className="text-sm font-semibold text-[#0A4E9B] tracking-wide uppercase">
                  {service.whatIs.subtitle}
                </div>
              )}

              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                {(service.whatIs?.paragraphs || []).map((para, pidx) => (
                  <p key={pidx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Technical Specifications Matrix Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#031433] rounded-2xl p-7 text-white shadow-xl border border-blue-900/80 space-y-6">
                <div className="border-b border-blue-800/60 pb-4">
                  <span className="text-xs uppercase font-bold text-cyan-300 tracking-widest block mb-1">
                    Standard Laboratory Metrics
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-white">
                    Technical Specifications
                  </h3>
                </div>

                <div className="space-y-4">
                  {(service.whatIs?.specs || []).map((spec, sidx) => (
                    <div
                      key={sidx}
                      className="flex items-center justify-between pb-3 border-b border-blue-900/60 text-sm"
                    >
                      <span className="text-slate-300 font-medium">{spec.label}</span>
                      <span className="text-cyan-300 font-bold text-base">{spec.value}</span>
                    </div>
                  ))}
                  {(!service.whatIs?.specs || service.whatIs.specs.length === 0) && (
                    <div className="text-sm text-slate-300">
                      Standard international export specifications & custom dimensional gauges available on request.
                    </div>
                  )}
                </div>

                <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Verified by independent NABL and ISO certified laboratory testing.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION: "What We Provide / Our Offerings"
          ========================================================================= */}
      <section className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B] bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              Industrial Stone Processing Scope
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-3">
              {service.whatWeProvide?.title || 'What We Provide'}
            </h2>
            {service.whatWeProvide?.subtitle && (
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                {service.whatWeProvide.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(service.whatWeProvide?.items || service.whatWeProvide?.cards || []).map((item, iidx) => (
              <div
                key={iidx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#0A4E9B] transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4E9B] group-hover:bg-[#0A4E9B] group-hover:text-white transition-colors flex items-center justify-center font-bold mb-5 shadow-xs">
                    <span className="text-base font-bold">0{iidx + 1}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#0A4E9B] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. SECTION: Product Images / Varieties Catalog for this Service
          ========================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200" id="service-products-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B]">
                Live Material Catalog ({categoryProducts.length} Stone Varieties)
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">
                Available {service.title} Varieties
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select any stone to inspect high-resolution gangsaw slabs or request direct project pricing.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${service.title}...`}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#0A4E9B]"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-600 border border-slate-200">
              <p className="text-base font-semibold">No stone varieties matched "{productSearch}".</p>
              <button
                onClick={() => setProductSearch('')}
                className="mt-3 px-4 py-2 bg-[#0A4E9B] text-white rounded-xl text-xs font-bold"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((stone) => (
                <div
                  key={stone.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#0A4E9B] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Responsive Image Container */}
                    <div
                      onClick={() => onOpenProduct && onOpenProduct(stone)}
                      className="aspect-16/10 w-full overflow-hidden bg-slate-100 relative cursor-pointer"
                    >
                      <img
                        src={`${stone.image}?v=4`}
                        alt={`${stone.name} - ${service.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/images/finish-polished.jpg';
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <h4 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#0A4E9B] transition-colors line-clamp-1">
                        {stone.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {stone.category || service.title}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    <button
                      onClick={() => onOpenProduct && onOpenProduct(stone)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <span>Inspect Slab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSelectStoneForQuote(stone.name)}
                      className="w-full py-2 bg-[#0A4E9B] hover:bg-[#073b77] text-white text-xs font-bold rounded-xl transition"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Pavilion Explorer Button */}
          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={service.content?.urls?.catalogUrl || '/products'}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-[#0A4E9B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
            >
              <span>{service.content?.urls?.catalogButtonText || 'Explore All 250+ Stone Varieties in Main Pavilion'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {service.content?.urls?.brochureUrl && (
              <a
                href={service.content.urls.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs"
              >
                <span>Download {service.title} Specifications PDF</span>
                <ExternalLink className="w-4 h-4 text-[#0A4E9B]" />
              </a>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. SECTION: Frequently Asked Questions (FAQs) & Direct Quotation
          ========================================================================= */}
      <section className="py-20 bg-slate-100 border-b border-slate-200" id="faqs-quote-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Frequently Asked Questions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-xs">
                  Direct Export Clarity
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A4E9B] mt-3 tracking-tight">
                  Frequently Asked Questions: {service.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Key technical, specification, packaging, and ocean logistics information.
                </p>
              </div>

              <div className="space-y-4">
                {(service.faqs || []).map((faq, fidx) => (
                  <div
                    key={fidx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === fidx ? -1 : fidx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-slate-900 hover:text-[#0A4E9B] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#0A4E9B] shrink-0 transition-transform duration-300 ${activeFaq === fidx ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {activeFaq === fidx && (
                      <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 font-normal">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Premium Quotation & Contact Card */}
            <div className="lg:col-span-5 lg:sticky lg:top-24" id="service-quote-form">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_12px_40px_rgba(4,23,56,0.08)] text-slate-900 relative">

                <div className="mb-4 pb-3 border-b border-slate-200">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold tracking-[0.18em] uppercase text-[#0A4E9B] mb-2">
                    <Sparkles className="w-3 h-3 text-[#0A4E9B]" />
                    <span>Direct Factory Quotation</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight">
                    Request <span className="bg-gradient-to-r from-[#0A4E9B] to-[#041738] bg-clip-text text-transparent">{service.title}</span> Quote
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-normal">
                    Receive technical specifications, FOB Mundra rates & container estimates within 4 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-emerald-950">
                      Inquiry Received Successfully!
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Thank you, <strong className="font-bold">{formData.name}</strong>. Our stone export team will prepare your quotation for {service.title} and reach out shortly.
                    </p>
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${(COMPANY_INFO?.contact?.whatsapp || '919414068933').replace(/[^0-9]/g, '')}?text=Hello%20Arpran%20Industries,%20I%20just%20submitted%20a%20quotation%20request%20for%20${encodeURIComponent(service.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Instant WhatsApp Follow-up</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0A4E9B] focus:ring-2 focus:ring-[#0A4E9B]/15 transition shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0A4E9B] focus:ring-2 focus:ring-[#0A4E9B]/15 transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Destination Port */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0A4E9B] focus:ring-2 focus:ring-[#0A4E9B]/15 transition shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Destination Port / City
                        </label>
                        <input
                          type="text"
                          value={formData.destinationPort}
                          onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0A4E9B] focus:ring-2 focus:ring-[#0A4E9B]/15 transition shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Row 3: Volume & Specifications */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Specific Thickness, Finishes & Volume
                      </label>
                      <textarea
                        rows={2}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0A4E9B] focus:ring-2 focus:ring-[#0A4E9B]/15 transition shadow-2xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0A4E9B] to-[#041738] hover:from-[#083b75] hover:to-[#03112b] text-white font-bold text-xs uppercase tracking-[0.16em] transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Request Factory Quotation</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center">
                      🔒 Direct factory quotation. No spam. Technical & freight response within 4 hours.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Other Categories Navigation Bar */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Browse Other Stone Collections & Categories
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {SERVICES_LIST.map((other) => (
              <Link
                key={other.id}
                to={`/products/${other.slug}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${other.slug === service.slug
                    ? 'bg-[#0A4E9B] text-white border-[#0A4E9B] shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
              >
                {other.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
