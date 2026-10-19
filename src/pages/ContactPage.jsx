import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2,
  Globe2, ShieldCheck, Download, FileText, Clock, HelpCircle, Sparkles
} from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';
import SEO from '../components/SEO';
import { useCMS } from '../context/CMSContext';

export default function ContactPage() {
  const { settings, pages } = useCMS();
  const contactPageData = pages?.contact;
  const content = contactPageData?.content || {};
  const headerBadge = content.header?.badge || "Direct Export Division";
  const headerTitle = contactPageData?.h1 || content.header?.h1 || "Contact Arpran Industries – Your Natural Stone Partner";
  const headerSubtitle = contactPageData?.tagline || content.header?.subtitle || "Looking for premium natural stone slabs, granite, sandstone, quartzite, slate stone, or limestone? Get in touch with Arpran Industries for product enquiries, bulk orders, custom requirements, and international export solutions. Our team is ready to help you find the right natural stone for your architectural, commercial, and landscaping projects.";

  const officesSection = content.offices_section || {
    badge: "International Presence",
    heading: "Headquarters & International Office",
    description: "Direct communication with our quarry directors and logistics specialists."
  };

  const instantWa = content.instant_wa || {
    title: "Instant WhatsApp Quotations",
    description: "Send your project blueprints or required slab quantities directly to our director's desk for instant FOB Mundra / CIF port estimates.",
    button_text: "Chat With Quarry Director"
  };

  const rfqForm = content.rfq_form || {
    badge: "Direct Factory Submission",
    title: "Request Stone Specification Quotation",
    subtitle: "Fill in your project requirements below. Our commercial department will provide calibrated slab photos, laboratory test reports, and CIF freight pricing.",
    button_text: "Submit Official Quotation Request",
    trust_badge_1: "NDA Confidentiality Guaranteed",
    trust_badge_2: "24-Hour Quotation Turnaround"
  };

  const DEFAULT_FAQS = [
    {
      question: "What is the standard container capacity for slabs?",
      answer: "A 20ft heavy-duty ocean container holds approx 400 to 450 sqm of 20mm granite slabs, or approx 300 sqm of 30mm slabs, subject to the weight limits of the discharge port (usually 21 to 27 metric tons)."
    },
    {
      question: "How are the slabs packaged for export?",
      answer: "All slabs are loaded on certified ISPM-15 heat-treated fumigated wooden A-frames. Slabs are individually cushioned with foam sheets and strapped with heavy-gauge steel bands to prevent transit movement."
    },
    {
      question: "Can we order mixed stone varieties in one container?",
      answer: "Yes. We frequently pack mixed containers containing granite slabs, marble tiles, and flexible stone veneer crates together to maximize space utilization for project developers."
    },
    {
      question: "What is the typical production and shipping lead time?",
      answer: "Factory gangsaw cutting and finishing takes 10 to 18 days. Transit time from Mundra Port to destination ports is approximately 18 to 24 days."
    }
  ];

  const faqsList = Array.isArray(content.faqs) && content.faqs.length > 0 ? content.faqs : DEFAULT_FAQS;
  const faqsBadge = content.faqs_badge || "Frequently Asked Questions";
  const faqsHeading = content.faqs_heading || "Stone Export & Logistics Information";

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    stoneCategory: 'Granite Series',
    quantity: '',
    thickness: '20mm',
    finish: 'Polished',
    message: ''
  });

  const phone = settings?.phone || COMPANY_INFO?.contact?.phone || '+91-94140 68933';
  const whatsapp = settings?.whatsapp || COMPANY_INFO?.contact?.whatsapp || '919414068933';
  const email = settings?.email || COMPANY_INFO?.contact?.email || 'info@arpranindustries.com';
  const addressJaipur = settings?.address_jaipur || COMPANY_INFO?.addresses?.jaipur;
  const addressUae = settings?.address_uae || COMPANY_INFO?.offices?.uae?.address;
  const businessHours = settings?.business_hours || 'Mon - Sat: 9:00 AM - 7:00 PM IST';

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // WhatsApp prefilled lead generation
    const waText = `*New Stone RFQ from Website*%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Country/Port:* ${encodeURIComponent(formData.country)}%0A*Stone Category:* ${encodeURIComponent(formData.stoneCategory)}%0A*Quantity:* ${encodeURIComponent(formData.quantity)}%0A*Thickness:* ${encodeURIComponent(formData.thickness)}%0A*Finish:* ${encodeURIComponent(formData.finish)}%0A*Message:* ${encodeURIComponent(formData.message)}`;

    // Optional instant WhatsApp redirect
    setTimeout(() => {
      const waNumber = whatsapp.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
      window.open(waUrl, '_blank');
    }, 1200);
  };

  return (
    <div>
      <SEO
        title={contactPageData?.title || "Contact Us & Request Natural Stone Quotation"}
        description="Contact ARPRAN Industries Pvt. Ltd. in Jaipur, Rajasthan. Request factory-direct container export prices, gangsaw slab photos, and custom cut-to-size stone estimates."
        keywords="contact Arpran Industries, stone export inquiry, Indian granite quotation, Makrana marble prices, Jaipur stone factory address"
        canonicalPath="/contact"
      />

      {/* Header Banner - Blog Style Luxury Dark Background */}
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
          <p className="mt-2.5 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
            {headerSubtitle}
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 sm:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Column: Dual Office Locations & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {officesSection.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
                  {officesSection.heading}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  {officesSection.description}
                </p>
              </div>

              {/* Jaipur HQ Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="font-serif font-bold text-base text-slate-900">Corporate HQ & Processing Plant</h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#0A4E9B] bg-blue-50 px-2 py-0.5 rounded">
                    India
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#0A4E9B] shrink-0 mt-0.5" />
                    <span>{addressJaipur}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#0A4E9B] shrink-0" />
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-slate-800 hover:text-[#0A4E9B] font-semibold">
                      {phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#0A4E9B] shrink-0" />
                    <a href={`mailto:${email}`} className="text-slate-800 hover:text-[#0A4E9B] font-semibold">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Plant Visiting Hours:</span>
                  <span className="font-semibold text-slate-700">{businessHours}</span>
                </div>
              </div>


              {/* Direct WhatsApp Callout */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50/60 p-6 rounded-2xl text-slate-800 shadow-sm border border-emerald-200/90 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-serif font-medium text-base text-slate-900">{instantWa.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {instantWa.description}
                </p>
                <a
                  href={`https://wa.me/${(whatsapp || '919414068933').replace(/[^0-9]/g, '')}?text=Hello%20Arpran%20Industries,%20I%20would%20like%20to%20request%20a%20stone%20export%20quotation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{instantWa.button_text}</span>
                </a>
              </div>

            </div>

            {/* Right Column: Comprehensive RFQ Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">

                <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B]">
                  {rfqForm.badge}
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1 mb-2">
                  {rfqForm.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-8">
                  {rfqForm.subtitle}
                </p>

                {formSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-emerald-900">
                      Thank You! Quotation Request Sent
                    </h4>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been received by Arpran Industries. We are opening WhatsApp to instantly link your specifications with our export manager.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="mt-4 px-4 py-2 text-xs font-bold text-emerald-700 underline"
                    >
                      Submit Another Requirement
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          Official Email *
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          Destination Country / Port
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          Stone Category
                        </label>
                        <select
                          value={formData.stoneCategory}
                          onChange={(e) => setFormData({ ...formData, stoneCategory: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs cursor-pointer"
                        >
                          <option>Granite Series</option>
                          <option>Marble Series</option>
                          <option>Natural Stone Veneer</option>
                          <option>Translucent Veneer</option>
                          <option>Sandstone Series</option>
                          <option>Slate Stone</option>
                          <option>Quartzite</option>
                          <option>Limestone</option>
                          <option>Sandstone Paving</option>
                          <option>Cobbles & Pebbles</option>
                          <option>Stone Benches</option>
                          <option>Artifacts & Sculptures</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          Thickness
                        </label>
                        <select
                          value={formData.thickness}
                          onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs cursor-pointer"
                        >
                          <option>18mm Gangsaw Slab</option>
                          <option>20mm Calibrated</option>
                          <option>30mm Heavy Duty</option>
                          <option>2mm Flexible Veneer</option>
                          <option>Custom Architectural</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                          Preferred Finish
                        </label>
                        <select
                          value={formData.finish}
                          onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                          className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs cursor-pointer"
                        >
                          <option>Polished (High Gloss)</option>
                          <option>Flamed (Thermal Non-Slip)</option>
                          <option>Honed (Velvet Matte)</option>
                          <option>Leathered / Antique</option>
                          <option>Bush-Hammered</option>
                          <option>Natural Cleft / Tumbled</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                        Estimated Area / Volume (e.g. 500 sqm, 1 FCL Container, or 5 gangsaw slabs)
                      </label>
                      <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block mb-1">
                        Project Description & Specific Stone Variety
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white border-2 border-blue-400 hover:border-blue-500 focus:border-[#0A4E9B] focus:ring-4 focus:ring-blue-100/70 rounded-xl p-4 text-xs text-slate-900 focus:outline-none resize-none transition-all shadow-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#0A4E9B] hover:bg-[#073b77] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      <span>{rfqForm.button_text}</span>
                    </button>

                    <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 pt-2">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {rfqForm.trust_badge_1}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0A4E9B]" /> {rfqForm.trust_badge_2}
                      </span>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Export Logistics & FAQs */}
      <section className="py-12 sm:py-14 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A4E9B]">
              {faqsBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              {faqsHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            {faqsList.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#0A4E9B] shrink-0" />
                  {faq.question}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
