import React from 'react';
import { Sparkles, MessageSquare, Check } from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';

export default function PremiumQuoteCard({
  service,
  formData,
  setFormData,
  isSubmitted,
  setIsSubmitted,
  handleFormSubmit,
}) {
  return (
    <div className="lg:col-span-5" id="service-quote-form">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_12px_40px_rgba(4,23,56,0.08)] text-slate-900 relative">
        <div className="mb-4 pb-3 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold tracking-[0.18em] uppercase text-[#0A4E9B] mb-2">
            <Sparkles className="w-3 h-3 text-[#0A4E9B]" />
            <span>Direct Factory Quotation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-tight">
            Request <span className="bg-gradient-to-r from-[#0A4E9B] to-[#041738] bg-clip-text text-transparent">{service.title}</span> Quote
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Receive technical specifications, FOB Mundra rates &amp; container estimates within 4 hours.
          </p>
        </div>
        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-serif font-bold text-lg text-emerald-950">Inquiry Received Successfully!</h4>
            <p className="text-xs text-emerald-800">
              Thank you, <strong className="font-bold">{formData.name}</strong>. Our stone export team will prepare your quotation for {service.title} and reach out shortly.
            </p>
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
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-3">
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-[#0A4E9B] focus:ring-1 focus:ring-[#0A4E9B] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-[#0A4E9B] focus:ring-1 focus:ring-[#0A4E9B] outline-none"
                />
              </div>
            </div>
            {/* Row 2: Email & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-[#0A4E9B] focus:ring-1 focus:ring-[#0A4E9B] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-[#0A4E9B] focus:ring-1 focus:ring-[#0A4E9B] outline-none"
                />
              </div>
            </div>
            {/* Row 3: Destination Port & Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destination Port</label>
                <input
                  type="text"
                  value={formData.destinationPort}
                  onChange={e => setFormData({ ...formData, destinationPort: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-[#0A4E9B] focus:ring-1 focus:ring-[#0A4E9B] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Message</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-[#0A4E9B] focus:ring-1 focus:ring-[#0A4E9B] outline-none resize-none"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#0A4E9B] hover:bg-[#083670] text-white font-bold py-2.5 rounded-md transition">
              Submit Quote Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
