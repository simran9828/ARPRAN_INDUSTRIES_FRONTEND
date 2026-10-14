import React from 'react';
import { COMPANY_INFO } from '../data/stoneData';
import { useCMS } from '../context/CMSContext';

export default function WhatsAppButton() {
  const { settings } = useCMS();
  const rawWa = settings?.whatsapp || COMPANY_INFO?.contact?.whatsapp || '919414068933';
  const waNumber = rawWa.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=Hello%20Arpran%20Industries,%20I%20would%20like%20to%20inquire%20about%20natural%20stone%20export.`;

  return (
    <div className="fixed bottom-6 left-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Inquiry"
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#1EBE5D] via-[#25D366] to-[#34E77B] text-white flex items-center justify-center border-2 border-white/90 ring-4 ring-emerald-500/20 shadow-[0_10px_25px_rgba(37,211,102,0.45),0_4px_10px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_36px_rgba(37,211,102,0.6),0_6px_14px_rgba(0,0,0,0.18)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Pulsing online indicator dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white shadow-xs"></span>
        </span>

        {/* WhatsApp Official SVG Glyph */}
        <svg 
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current transition-transform duration-300 group-hover:rotate-6 drop-shadow-xs" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Hover Tooltip - Appears cleanly next to button on hover without clutter */}
        <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap hidden sm:flex items-center gap-1.5 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>WhatsApp Inquiry</span>
        </span>
      </a>
    </div>
  );
}
