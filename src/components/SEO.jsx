import { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

/**
 * Dynamic SEO Component
 * Automatically updates document.title, meta description, keywords, OpenGraph, and canonical link
 * from CMS SEO settings or component props for optimal search engine indexing.
 */
export default function SEO({
  title,
  description,
  keywords,
  canonicalPath = '',
  ogType = 'website',
  ogImage
}) {
  const { seoSettings, settings } = useCMS();

  useEffect(() => {
    // 1. Resolve Admin CMS SEO configuration for this page, if present
    const cleanCanonical = (!canonicalPath || canonicalPath === '/') ? '/' : canonicalPath.replace(/\/$/, '');
    const pageKey = cleanCanonical === '/' ? 'home' : cleanCanonical.replace(/^\//, '').split('/')[0];

    const cmsSeo = seoSettings?.find(s =>
      s.page_route === cleanCanonical ||
      (cleanCanonical === '/' && (s.page_route === '/' || s.page_route === 'home')) ||
      s.page_route === canonicalPath ||
      s.page_route === `/${pageKey}` ||
      s.page_identifier === cleanCanonical ||
      s.page_identifier === pageKey
    );

    const activeTitle = cmsSeo?.meta_title || title;
    const activeDescription = cmsSeo?.meta_description || description;
    const activeKeywords = cmsSeo?.meta_keywords || keywords;
    const activeOgTitle = cmsSeo?.og_title || activeTitle;
    const activeOgDescription = cmsSeo?.og_description || activeDescription;
    const activeOgImage = cmsSeo?.og_image || ogImage || settings?.logo_url || `${window.location.origin}/logo.png`;

    const siteName = settings?.site_name || 'ARPRAN Industries';
    const baseTitle = `${siteName} | Premium Natural Stone, Granite & Marble`;
    document.title = activeTitle ? `${activeTitle} | ${siteName}` : baseTitle;

    // Helper to set or create meta tag
    const setMetaTag = (nameAttr, nameVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', activeDescription);
    if (activeKeywords) {
      setMetaTag('name', 'keywords', activeKeywords);
    }
    setMetaTag('name', 'author', `${siteName} Pvt. Ltd.`);
    setMetaTag('name', 'robots', 'index, follow');

    // 3. Open Graph (Facebook, WhatsApp, LinkedIn)
    setMetaTag('property', 'og:title', activeOgTitle ? `${activeOgTitle} | ${siteName}` : baseTitle);
    setMetaTag('property', 'og:description', activeOgDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:image', activeOgImage);

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', activeOgTitle ? `${activeOgTitle} | ${siteName}` : baseTitle);
    setMetaTag('name', 'twitter:description', activeOgDescription);
    setMetaTag('name', 'twitter:image', activeOgImage);

    // 5. Favicon update if admin set custom favicon
    if (settings?.favicon_url) {
      let fav = document.querySelector('link[rel="icon"]');
      if (fav) fav.setAttribute('href', settings.favicon_url);
    }

    // 6. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', cmsSeo?.canonical_url || `${window.location.origin}${canonicalPath}`);

    // Scroll to top upon page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, keywords, canonicalPath, ogType, ogImage, seoSettings, settings]);

  return null;
}
