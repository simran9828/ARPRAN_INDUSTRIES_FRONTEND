import { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { findExactPageSeoRecord, getCanonicalUrl } from '../utils/seoMetadata';

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
    const cmsSeo = findExactPageSeoRecord(seoSettings, canonicalPath);

    const activeTitle = cmsSeo?.meta_title || title;
    const activeDescription = cmsSeo?.meta_description || description;
    const activeKeywords = cmsSeo?.meta_keywords || keywords;
    const activeOgTitle = cmsSeo?.og_title || activeTitle;
    const activeOgDescription = cmsSeo?.og_description || activeDescription;
    const activeOgImage = cmsSeo?.og_image || ogImage || settings?.logo_url || `${window.location.origin}/logo.png`;

    const siteName = settings?.site_name || 'ARPRAN Industries';
    const baseTitle = `${siteName} | Premium Natural Stone, Granite & Marble`;
    const titleWithSiteName = activeTitle?.toLowerCase().endsWith(`| ${siteName}`.toLowerCase())
      ? activeTitle
      : `${activeTitle} | ${siteName}`;
    document.title = activeTitle ? titleWithSiteName : baseTitle;

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
    canonical.setAttribute('href', getCanonicalUrl(canonicalPath, cmsSeo));

    // Scroll to top upon page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, keywords, canonicalPath, ogType, ogImage, seoSettings, settings]);

  return null;
}
