import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, MessageSquare, Download, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/stoneData';
import { useCMS } from '../context/CMSContext';

export default function ProductModal({ product, onClose }) {
  const { settings } = useCMS();
  if (!product) return null;

  const waRaw = settings?.whatsapp || COMPANY_INFO?.contact?.whatsapp || '919414068933';
  const waNumber = waRaw.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A4E9B] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {product.categoryName || 'Natural Stone'}
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-1">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
              <img
                src={`${product.image}?v=4`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/logo.png';
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Architectural Specs</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Calibrated gangsaw slabs and cut-to-size dimensional stone processed with computerized bridge cutting. Uniform grain structure and premium grade finish.
                </p>
              </div>

              {product.finishes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available Finishes</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.finishes.map((f, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard Thickness: 18mm, 20mm, 30mm & Custom</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Packaging: Fumigated Seaworthy Wooden Crates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Loading Port: Mundra Port / Pipavav Port, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`https://wa.me/${waNumber}?text=Hello%20Arpran%20Industries,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.categoryName || 'Natural Stone')}).%20Please%20send%20quote%20and%20slab%20photos.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquire on WhatsApp</span>
          </a>

          <Link
            to="/contact"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0A4E9B] hover:bg-[#073b77] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2"
          >
            <span>Request Full Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
