import React, { useEffect } from 'react';
import { ArrowRight, Globe2, MessageSquare, Ship } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import SEO from '../components/SEO';
import NotFoundPage from '../components/NotFoundPage';
import { EXPORT_MARKETS, LOCALIZED_EXPORT_COPY } from '../data/exportMarkets';

const LOCAL_COUNTRY_NAMES = {
  brazil: 'Brasil',
  bulgaria: 'България',
  germany: 'Deutschland',
  italy: 'Italia',
  'south-korea': '대한민국',
  latvia: 'Latvija',
  lithuania: 'Lietuva',
  mongolia: 'Монгол',
  hungary: 'Magyarország',
  poland: 'Polska',
  spain: 'España',
  thailand: 'ประเทศไทย'
};

export default function LocalizedExportPage() {
  const { marketSlug } = useParams();
  const { settings } = useCMS();
  const market = EXPORT_MARKETS.find((item) => item.slug === marketSlug);
  const copy = LOCALIZED_EXPORT_COPY[marketSlug];

  useEffect(() => {
    if (!market || !copy) return undefined;
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = market.locale;
    return () => { document.documentElement.lang = previousLanguage || 'en'; };
  }, [market, copy]);

  if (!market || !copy) return <NotFoundPage />;

  const countryName = LOCAL_COUNTRY_NAMES[market.slug] || market.country;
  const whatsapp = (settings?.whatsapp || '919414068933').replace(/[^0-9]/g, '');
  const alternates = Object.fromEntries([
    ['x-default', 'https://arpranindustries.com/international-exports'],
    ...EXPORT_MARKETS.filter((item) => LOCALIZED_EXPORT_COPY[item.slug]).map((item) => [
      item.locale,
      `https://arpranindustries.com/exports/${item.slug}`
    ])
  ]);

  return (
    <main className="bg-white text-slate-800">
      <SEO
        title={copy.title}
        description={copy.description}
        canonicalPath={`/exports/${market.slug}`}
        alternateLanguages={alternates}
      />

      <section className="relative overflow-hidden bg-[#0B1528] px-4 py-16 text-white sm:px-6 lg:py-24">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
            <Globe2 className="h-4 w-4" /> {countryName} · {market.language}
          </div>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">{copy.heading}</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{copy.intro}</p>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(copy.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            <MessageSquare className="h-4 w-4" /> {copy.quoteButton}
          </a>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A4E9B]">{market.country}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{copy.termsHeading}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{copy.terms}</p>
            <h3 className="mt-8 text-lg font-bold text-slate-900">{copy.productsHeading}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy.products}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0A4E9B] shadow-sm"><Ship className="h-5 w-5" /></div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{copy.quoteHeading}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{copy.quoteText}</p>
            <Link
              to={`/contact?country=${encodeURIComponent(market.country)}#rfq`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A4E9B] px-5 py-3 text-sm font-bold text-white hover:bg-[#073b77]"
            >
              {copy.quoteButton} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 px-4 py-8 text-center sm:px-6">
        <Link to="/international-exports" className="text-sm font-semibold text-[#0A4E9B] hover:underline">
          {market.language} · {market.country}
        </Link>
      </section>
    </main>
  );
}
