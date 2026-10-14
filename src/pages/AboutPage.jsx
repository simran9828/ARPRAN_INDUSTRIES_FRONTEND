import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Globe2, Award, Truck, CheckCircle2,
  Sparkles, Factory, Compass, ArrowRight, Download, FileText, Check,
  X, ZoomIn, Layers
} from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';
import SEO from '../components/SEO';
import { useCMS } from '../context/CMSContext';

export default function AboutPage() {
  const { about, settings } = useCMS();
  const [selectedProcess, setSelectedProcess] = useState(null);

  const siteName = settings?.site_name || COMPANY_INFO.name;
  const h1 = about?.h1 || "Quality is not just a standard; it is a commitment to delivering natural stone that adds lasting value to every space.";
  const tagline = about?.tagline || "To provide premium natural stone solutions that inspire architects, designers, builders, and customers to create beautiful, durable, and distinctive spaces.";

  const genesis = about?.content?.genesis || {};
  const badge = genesis.badge || "About Us";
  const genesisHeading = genesis.heading || "Quality is not just a standard; it is a commitment to delivering natural stone that adds lasting value to every space.";
  const paragraphs = genesis.paragraphs || [
    "At Arpran Industries, we are committed to offering premium natural stone that combines quality, durability, natural beauty, and timeless character. Our carefully selected range of natural stones is designed to meet the diverse requirements of modern architecture, interior design, and landscaping.",
    "From elegant architectural surfaces to distinctive outdoor spaces, our natural stones bring unique textures, patterns, and natural variations to every project. We focus on maintaining consistent quality and delivering products that meet the expectations of architects, designers, builders, and clients worldwide.",
    "Whether for residential, commercial, architectural, or landscaping applications, Arpran Industries strives to provide natural stone solutions that combine aesthetic appeal with long-lasting performance."
  ];

  const stats = genesis.stats || [
    { number: "100%", label: "Export Oriented Unit" },
    { number: "25+ Nations", label: "International Shipments" },
    { number: "10+ Yrs", label: "Quarrying Heritage" }
  ];

  const genesisImage = genesis.image || "/images/about-stone-samples.jpg";
  const pillars = about?.content?.pillars || [
    {
      title: "Material",
      description: "Carefully selected natural stone with a strong focus on quality and durability."
    },
    {
      title: "Manufacturing",
      description: "Precision processing and finishing to deliver consistent, high-quality products."
    },
    {
      title: "Delivery",
      description: "Reliable and timely delivery to meet project requirements efficiently."
    },
    {
      title: "Relationship",
      description: "Building long-term relationships through trust, quality, and dependable service."
    }
  ];

  const WORK_PROCESS_STEPS = [
    {
      step: "01",
      title: "1. Stone Selection",
      subtitle: "Carefully Selected Natural Stone",
      description: "Rigorous geological selection of natural stone blocks with consistent textures, mineral composition, and high durability.",
      image: "/images/process/1-block-procuring.jpg",
      gridClass: "lg:col-start-1 lg:row-start-1",
    },
    {
      step: "02",
      title: "2. Block Procuring",
      subtitle: "Direct Quarry Bench Extraction",
      description: "Direct procurement of raw natural stone blocks from trusted quarry strata, ensuring dependable volume and monolithic density.",
      image: "/images/process/2-sawing.jpg",
      gridClass: "lg:col-start-2 lg:row-start-1",
    },
    {
      step: "03",
      title: "3. Sawing",
      subtitle: "Computerized Gangsaw Processing",
      description: "Precision diamond multi-wire gangsaw slicing into uniform calibrated slabs with continuous water cooling to protect stone integrity.",
      image: "/images/process/3-edge-cutting.jpg",
      gridClass: "lg:col-start-1 lg:row-start-2",
    },
    {
      step: "04",
      title: "4. Edge Cutting",
      subtitle: "Accurate Orthogonal Dimensions",
      description: "Laser-aligned CNC bridge saws cut calibrated slabs and tiles to accurate dimensions, making fabrication and installation faster.",
      image: "/images/process/4-sandblast.jpg",
      gridClass: "lg:col-start-2 lg:row-start-2",
    },
    {
      step: "05",
      title: "5. Surface Finishing",
      subtitle: "Precision Surface Treatments",
      description: "Automated processing of mirror polish, honed velvet, non-slip thermal flamed, and antique leathered surface treatments.",
      image: "/images/process/5-waterproofing.jpg",
      isTall: true,
      gridClass: "lg:col-start-3 lg:row-start-1 lg:row-span-2",
    },
    {
      step: "06",
      title: "6. Quality Inspection",
      subtitle: "Dry-Lay & Vein Matching",
      description: "Every slab is carefully inspected, dry-laid, and pattern-matched to create seamless patterns and visually balanced surfaces across luxury spaces.",
      image: "/images/process/6-packaging.jpg",
      isTall: true,
      gridClass: "lg:col-start-1 lg:row-start-3 lg:row-span-2",
    },
    {
      step: "07",
      title: "7. Cleaning",
      subtitle: "Thorough High-Pressure Rinse",
      description: "Multi-stage freshwater wash and squeegee drying to remove cutting slurry, micro-dust, and stone residue before packing.",
      image: "/images/process/8-cleaning.jpg",
      gridClass: "lg:col-start-2 lg:row-start-3",
    },
    {
      step: "08",
      title: "8. Packaging",
      subtitle: "Expert Worthy Packaging",
      description: "Secure, export-ready packaging designed to protect premium marble and natural stone slabs during handling, transportation, and international delivery.",
      image: "/images/process/7-stock.jpg",
      gridClass: "lg:col-start-3 lg:row-start-3",
    },
    {
      step: "09",
      title: "9. Stock Management",
      subtitle: "Systematic Inventory Control",
      description: "Systematic warehousing and digitized bundle tracking under heavy overhead gantry yards for rapid container export dispatch.",
      image: "/images/process/9-inspection.jpg",
      gridClass: "lg:col-start-2 lg:row-start-4",
    },
    {
      step: "10",
      title: "10. Final Inspection",
      subtitle: "Zero-Deviation Verification",
      description: "Final quality verification checking thickness consistency, surface finish, squareness, and export crating compliance.",
      image: "/images/process/10-loading.jpg",
      gridClass: "lg:col-start-3 lg:row-start-4",
    },
  ];

  const WORK_PROCESS_BOTTOM = [
    {
      step: "11",
      title: "11. Loading & Delivery",
      subtitle: "Reliable Container Ocean Transit",
      description: "Professional container stuffing, heavy timber bracing, and reliable ocean freight delivery to meet international project requirements efficiently.",
      image: "/images/process/11-implementation.jpg",
    },
    {
      step: "12",
      title: "12. Project Implementation",
      subtitle: "Distinctive Architectural Spaces",
      description: "To provide premium natural stone solutions that inspire architects, designers, builders, and customers to create beautiful, durable, and distinctive spaces.",
      image: "/images/process/12-completed.jpg",
    },
  ];

  const hubs = about?.content?.hubs || {
    badge: "International Reach",
    heading: "Integrated Quarry Mining & Ocean Export Logistics",
    description: "By uniting primary quarry extraction and heavy industrial manufacturing in Jaipur with direct container shipments via Mundra Port, Arpran Industries removes middlemen, delivers factory pricing, and guarantees verifiable stone provenance.",
    jaipur_functions: "Block Quarrying, Gangsaw Slicing, Surface Treatments, QC & Container Stuffing",
    mundra_functions: "Customs Clearance, Vessel Booking, Seaworthy A-Frame Packaging & Ocean Port Delivery"
  };

  const accreditations = about?.content?.accreditations || {
    heading: "Quality Accreditations & Standards",
    description: "All Arpran export shipments are supported by laboratory test reports verifying compressive strength, flexural rigidity, modulus of rupture, and water absorption rate according to ASTM & EN standards.",
    items: [
      { title: "ISO 9001:2015 Quality Management", subtitle: "Certified manufacturing, testing and packaging protocols" },
      { title: "ASTM C615 & International Compliance", subtitle: "Structural building granite & natural stone physical property thresholds" },
      { title: "ISPM-15 Certified Wood Packaging", subtitle: "Heat-treated phytosanitary export crates accepted at all international ports" }
    ],
    brochure_text: "Download Complete Brand & Technical Brochure",
    brochure_link: "/brochure.pdf"
  };

  return (
    <div>
      <SEO
        title={about?.title || "About Our Heritage, Quarries & Infrastructure"}
        description="Learn about ARPRAN Industries Pvt. Ltd. — over a decade of natural stone quarrying in Rajasthan, state-of-the-art gangsaw processing in Jaipur, and direct ocean export logistics to worldwide ports."
        keywords="Arpran Industries history, Rajasthan stone quarries, Indian granite processing, Makrana marble factory, Jaipur stone export division"
        canonicalPath="/about"
      />


      {/* Header Banner - Blog Style Luxury Dark Background with Our Mission */}
      <section className="bg-gradient-to-b from-[#070E1C] via-[#0B1528] to-[#0E1A32] text-white py-12 sm:py-16 border-b border-slate-800 relative overflow-hidden">
        {/* Ambient Subtle Glow Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-amber-400/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -top-24 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-normal text-white tracking-tight leading-[1.2] mb-4">
            Our Mission
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed font-light italic">
            "{about?.content?.mission?.statement || "To be a leading supplier and exporter of natural stone by consistently delivering high-quality materials, innovative stone solutions, and reliable export services. We are dedicated to creating lasting value for architects, builders, landscapers, and homeowners worldwide through integrity, precision, and excellence in natural stone processing."}"
          </p>
        </div>
      </section>

      {/* Main Story & About Us Section */}
      <section className="py-12 sm:py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">

              <h3 className="text-xl sm:text-2xl lg:text-[25px] font-serif font-semibold text-slate-900 leading-snug">
                {genesisHeading}
              </h3>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {paragraphs.map((p, i) => (
                  <p key={i}>
                    {p}
                  </p>
                ))}
              </div>

              {/* End of content */}

            </div>

            {/* Right Side: High-End Natural Stone Samples Palette */}
            <div className="lg:col-span-5">
              <div className="group relative rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] border-2 border-slate-200/90 bg-white transition-all duration-300 hover:shadow-2xl hover:border-[#B89047]">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={genesisImage}
                    alt={`${siteName} Curated Indian Natural Stone Palette`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence - Quality Standards */}
      <section className="py-12 sm:py-14 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B]">
              Quality Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2">
              {about?.content?.pillars_heading || "Our 4 Quality Standards"}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {about?.content?.pillars_description || "Material, Manufacturing, Delivery, and Relationship-Driven Excellence."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => {
              const icons = [Compass, Factory, ShieldCheck, Truck];
              const IconComp = icons[idx % icons.length];
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4E9B] flex items-center justify-center mb-6">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Our Work Process */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0A4E9B] bg-blue-50 px-3 py-1 rounded-full inline-block mb-2 border border-blue-100">
              Quarry to Architecture Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Our Work Process
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#0A4E9B] via-[#C29B38] to-[#0A4E9B] mx-auto mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Every slab, tile, and bespoke architectural element moves through our rigorous 12-stage manufacturing cycle — ensuring certified dimensional tolerance and seaworthy export dispatch.
            </p>
          </div>

          {/* Top 10 Steps Mosaic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:grid-rows-[repeat(4,180px)]">
            {WORK_PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                onClick={() => setSelectedProcess(item)}
                className={`group relative rounded-xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-44 sm:h-48 lg:h-full ${item.gridClass}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:via-black/50 transition-colors duration-300" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#C29B38] text-white shadow-xs">
                    Step {item.step}
                  </span>
                </div>

                {/* Top Right Zoom Indicator */}
                <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Content Bar */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 z-10 text-white">
                  <h4 className="font-serif font-bold text-sm sm:text-base tracking-wide drop-shadow-md text-white group-hover:text-[#F3C65D] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-white/80 text-[11px] sm:text-xs font-medium mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                  <p className="text-slate-300 text-[11px] mt-1 line-clamp-2 leading-relaxed opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:max-h-0 sm:group-hover:max-h-16 transition-all duration-300 overflow-hidden">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 2 Wide Steps (Implementation & Completed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3.5">
            {WORK_PROCESS_BOTTOM.map((item) => (
              <div
                key={item.step}
                onClick={() => setSelectedProcess(item)}
                className="group relative rounded-xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-48 sm:h-52 lg:h-[190px]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:via-black/50 transition-colors duration-300" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#C29B38] text-white shadow-xs">
                    Step {item.step}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-white/20 backdrop-blur-md text-white border border-white/30 hidden sm:inline-block">
                    {item.step === "11" ? "Site Execution" : "Project Handover"}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Content Bar */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 z-10 text-white">
                  <h4 className="font-serif font-bold text-base sm:text-lg tracking-wide drop-shadow-md text-white group-hover:text-[#F3C65D] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-white/85 text-xs font-medium mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-slate-300 text-[11px] sm:text-xs mt-1 leading-relaxed opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:max-h-0 sm:group-hover:max-h-20 transition-all duration-300 overflow-hidden">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Process Lightbox Modal */}
      {selectedProcess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedProcess(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProcess(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center border border-white/20 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedProcess.image}
                alt={selectedProcess.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
              <div className="absolute bottom-4 left-6 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C29B38] text-white inline-block mb-2 shadow">
                  Stage {selectedProcess.step} of 12
                </span>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                  {selectedProcess.title}
                </h3>
                <p className="text-amber-300/90 text-sm font-medium">
                  {selectedProcess.subtitle}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-900">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Engineering Methodology & Quality Assurance
              </h5>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {selectedProcess.description}
              </p>
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Arpran Industries Pvt. Ltd. • ISO & ASTM Compliant Factory Standards</span>
                <button
                  onClick={() => setSelectedProcess(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition font-medium cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

