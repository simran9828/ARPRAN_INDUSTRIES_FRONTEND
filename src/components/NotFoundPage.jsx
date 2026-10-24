import React, { useEffect } from 'react';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | ARPRAN Industries';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', 'The requested page could not be found.');
    document.querySelector('link[rel="canonical"]')?.remove();
  }, []);

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-3 max-w-lg text-slate-600">The page you requested could not be found.</p>
      <a href="/" className="mt-6 rounded-md bg-[#0A4E9B] px-5 py-3 font-semibold text-white hover:bg-[#073B75]">Return to home</a>
    </section>
  );
}
