import React from 'react';
import { ArrowRight, CheckCircle2, Globe2, Ship, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { EXPORT_MARKETS, LOCALIZED_EXPORT_COPY } from '../data/exportMarkets';

const PRODUCT_CATEGORIES = [
  'Granite slabs and tiles',
  'Marble and quartzite',
  'Sandstone and limestone',
  'Slate and natural stone veneer',
  'Paving, cobbles and landscaping stone',
  'Rough blocks and made-to-order stone'
];

export default function ExportMarketsPage() {
  return (
    <main className="bg-white text-slate-800">
      <SEO
        title="International Natural Stone Exports from India"
        description="Source granite, marble, sandstone, quartzite and stone veneer from India. Request a destination-specific export quotation for projects in Australia, Europe, Africa, Asia and New Zealand."
        canonicalPath="/international-exports"
        alternateLanguages={Object.fromEntries([
          ['x-default', 'https://arpranindustries.com/international-exports'],
          ...EXPORT_MARKETS.filter((market) => LOCALIZED_EXPORT_COPY[market.slug]).map((market) => [
            market.locale,
            `https://arpranindustries.com/exports/${market.slug}`
          ])
        ])}
      />

      <section className="relative overflow-hidden bg-[#0B1528] px-4 py-16 text-white sm:px-6 lg:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
            <Globe2 className="h-4 w-4" /> International supply from India
          </div>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
            Natural Stone Exports for International Projects
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            ARPRAN Industries helps importers, distributors, architects, fabricators and project buyers source natural stone from India. Choose your destination to start a quotation request with the country already filled in.
          </p>
          <Link
            to="/contact?country=Australia#rfq"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Request an export quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A4E9B]">Export destinations</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Choose the country for your stone enquiry</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Request current product availability, packing details and a freight quotation for your destination. Final pricing and transit options depend on the selected stone, order volume and destination port.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EXPORT_MARKETS.map((market) => (
              <Link
                key={market.slug}
                to={LOCALIZED_EXPORT_COPY[market.slug]
                  ? `/exports/${market.slug}`
                  : `/contact?country=${encodeURIComponent(market.country)}#rfq`}
                className="group flex min-h-20 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <span>
                  <span className="block font-semibold text-slate-900">{market.country}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {LOCALIZED_EXPORT_COPY[market.slug] ? `${market.language} export page` : 'English export enquiry'}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#0A4E9B] transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-[#0A4E9B]"><Sparkles className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Stone categories</span></div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Products for commercial and architectural requirements</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{category}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0A4E9B]"><Ship className="h-5 w-5" /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">What to include in your enquiry</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Share your destination country and port, stone category or variety, dimensions and finish, estimated quantity, and project timeline. The export team can then check availability and prepare a suitable quotation.</p>
            <Link to="/contact#rfq" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0A4E9B] hover:underline">
              Contact the export team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">Planning a natural stone order?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">Send the destination and project specifications to request current availability and export pricing.</p>
        <Link to="/contact#rfq" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0A4E9B] px-5 py-3 text-sm font-bold text-white hover:bg-[#073b77]">
          Start your enquiry <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
