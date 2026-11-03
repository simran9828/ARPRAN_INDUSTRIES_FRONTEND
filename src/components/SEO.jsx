import { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { findExactPageSeoRecord, getCanonicalUrl, getProductCategoryBreadcrumbs } from '../utils/seoMetadata';

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
  ogImage,
  alternateLanguages = {}
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

    document.querySelectorAll('link[data-seo-alternate="true"]').forEach((el) => el.remove());
    Object.entries(alternateLanguages).forEach(([language, href]) => {
      if (!language || !href) return;
      const alternate = document.createElement('link');
      alternate.rel = 'alternate';
      alternate.hreflang = language;
      alternate.href = href;
      alternate.dataset.seoAlternate = 'true';
      document.head.appendChild(alternate);
    });

    // Keep the server-rendered defaults in index.html in sync for social crawlers.
    const setPropertyTag = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setPropertyTag('og:url', getCanonicalUrl(canonicalPath, cmsSeo));

    const breadcrumbData = getProductCategoryBreadcrumbs(canonicalPath, activeTitle);
    let breadcrumbScript = document.getElementById('seo-breadcrumb-jsonld');
    if (breadcrumbData) {
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'seo-breadcrumb-jsonld';
        breadcrumbScript.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    } else {
      breadcrumbScript?.remove();
    }

    // Scroll to top upon page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, keywords, canonicalPath, ogType, ogImage, alternateLanguages, seoSettings, settings]);

  return null;
}
