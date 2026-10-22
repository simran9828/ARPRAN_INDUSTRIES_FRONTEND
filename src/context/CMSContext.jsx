import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { COMPANY_INFO } from '../data/stoneData';
import CATALOG_DATA from '../data/catalog.json';
import { getApiUrl, resolveCmsAssetUrls, safeParseResponse } from '../utils/api';

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [data, setData] = useState({
    settings: {
      site_name: COMPANY_INFO.name,
      tagline: COMPANY_INFO.tagline,
      subtagline: COMPANY_INFO.subtagline,
      motto: COMPANY_INFO.motto,
      phone: COMPANY_INFO.contact.phone,
      whatsapp: COMPANY_INFO.contact.whatsapp,
      email: COMPANY_INFO.contact.email,
      address_jaipur: COMPANY_INFO.addresses.jaipur,
      address_uae: COMPANY_INFO.offices.uae.address,
      logo_url: '/logo.png',
      copyright_text: `${COMPANY_INFO.name}. All rights reserved.`
    },
    heroSlides: [
      {
        id: 1,
        title: 'The World of Natural Stones',
        subtitle: 'Makrana White, Calacatta & Statuario Series',
        tag: 'Opulent White Marble Architecture',
        highlight: 'Polished Gangsaw Slabs',
        description: 'Calibrated gangsaw granite slabs, pristine Makrana marble, quartzite, sandstone, slate, natural stone veneers, and handcrafted landscaping exported from India worldwide.',
        image: '/images/hero/slide-1.jpg',
        button_text: 'Explore Collections',
        button_link: '/products'
      },
      {
        id: 2,
        title: 'Illuminated Stone Walls & Veneers',
        subtitle: 'Ultra-Thin 2mm Natural & Translucent Stone Veneer',
        tag: 'Illuminated Stone Walls & Veneers',
        highlight: 'Peel & Stick Cladding',
        description: 'Ultra-thin 2mm natural stone veneers and translucent sheets engineered for curved walls, backlit bars, elevator cabs, and modern architectural feature walls.',
        image: '/images/hero/slide-2.jpg',
        button_text: 'Explore Veneers',
        button_link: '/products/stone-veneer'
      },
      {
        id: 3,
        title: 'Architectural Landscaping & Paving',
        subtitle: 'Sandstone Paving, Cobbles, Pebbles & Stone Benches',
        tag: 'Architectural Landscaping & Paving',
        highlight: 'Direct Quarry Sourcing',
        description: 'Hand-split cobbles, tumbled landscaping pebbles, calibrated sandstone pavers, and monolithic granite garden furniture direct from Rajasthan quarries.',
        image: '/images/hero/bright-landscaping-paving.jpg',
        button_text: 'View Landscaping',
        button_link: '/products/landscaping-and-furniture'
      },
      {
        id: 4,
        title: 'The World of Natural Stones',
        subtitle: 'Makrana White, Calacatta & Statuario Series',
        tag: 'Opulent White Marble Architecture',
        highlight: 'Direct Quarry Heritage',
        description: 'Calibrated gangsaw granite slabs, pristine Makrana marble, quartzite, sandstone, slate, natural stone veneers, and handcrafted landscaping exported from India worldwide.',
        image: '/images/hero/luxury-stone-villa.jpg',
        button_text: 'Explore Collections',
        button_link: '/products'
      }
    ],
    categories: Object.keys(CATALOG_DATA).map((catName, idx) => ({
      id: idx + 1,
      name: catName,
      catalog_category: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: (CATALOG_DATA[catName] && CATALOG_DATA[catName][0]?.image) || '/logo.png'
    })),
    products: [],
    catalogMap: CATALOG_DATA,
    pages: {},
    blogs: [],
    services: {},
    about: null,
    documents: [],
    events: [],
    gallery: [],
    socialLinks: [],
    seoSettings: [],
    redirects: [],
    pageImages: [],
    footerLinks: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const inFlightRequest = useRef(null);

  const fetchCMSData = useCallback(async () => {
    if (inFlightRequest.current) return inFlightRequest.current;

    inFlightRequest.current = (async () => {
      let lastError;
      const retryDelays = [0, 1000, 2000, 4000, 8000, 12000];

      try {
        for (const delay of retryDelays) {
          if (delay) await new Promise(resolve => setTimeout(resolve, delay));

          try {
            const res = await fetch(getApiUrl('/api/public/all'), { cache: 'no-store' });
            const parsed = await safeParseResponse(res);
            if (!parsed.ok || !parsed.data?.success || !parsed.data?.data) {
              throw new Error(parsed.error || 'CMS server returned no content');
            }

            const fetched = resolveCmsAssetUrls(parsed.data.data);
            const fetchedProducts = Array.isArray(fetched.products) ? fetched.products : null;
            const grouped = {};
            const fetchedCategories = Array.isArray(fetched.categories) ? fetched.categories : null;

            // Keep empty published categories so the UI does not fall back to the
            // bundled catalog when an admin removes its last product.
            (fetchedCategories || []).forEach(category => {
              const name = category.catalog_category || category.name;
              const lower = (name || '').toLowerCase();
              if (name && lower !== 'quartz series' && lower !== 'wall cladding' && !lower.includes('semi-precious') && !lower.includes('semi precious')) {
                grouped[name] = [];
              }
            });

            // A successful CMS response is authoritative, including empty lists. This
            // prevents deleted or unpublished bundled products from reappearing.
            (fetchedProducts || []).forEach(product => {
              const category = product.category_name || 'Granite Series';
              const lower = category.toLowerCase();
              if (lower === 'quartz series' || lower === 'wall cladding' || lower.includes('semi-precious') || lower.includes('semi precious')) return;
              if (!grouped[category]) grouped[category] = [];
              grouped[category].push({
                id: product.slug || `prod_${product.id}`,
                dbId: product.id,
                name: product.name,
                category: product.category_name,
                image: product.main_image,
                additional_images: product.additional_images,
                short_description: product.short_description,
                full_description: product.full_description,
                specifications: product.specifications,
                finishes: product.finishes,
                page: product.page_number
              });
            });

            const filteredCategories = fetchedCategories?.filter(category => {
              const name = (category.name || category.catalog_category || '').toLowerCase();
              return name !== 'quartz series' && name !== 'wall cladding' && !name.includes('semi-precious') && !name.includes('semi precious');
            });

            setData(previous => ({
              ...previous,
              settings: { ...previous.settings, ...(fetched.settings || {}) },
              heroSlides: Array.isArray(fetched.heroSlides) ? fetched.heroSlides : previous.heroSlides,
              categories: filteredCategories || previous.categories,
              products: fetchedProducts
                ? fetchedProducts.filter(product => {
                    const category = (product.category_name || '').toLowerCase();
                    return category !== 'quartz series' && category !== 'wall cladding' && !category.includes('semi-precious') && !category.includes('semi precious');
                  })
                : previous.products,
              catalogMap: fetchedProducts ? grouped : previous.catalogMap,
              pages: fetched.pages || previous.pages,
              blogs: Array.isArray(fetched.blogs) ? fetched.blogs : previous.blogs,
              services: fetched.services || previous.services,
              about: fetched.about || fetched.pages?.about || previous.about,
              documents: Array.isArray(fetched.documents) ? fetched.documents : previous.documents,
              events: Array.isArray(fetched.events) ? fetched.events : previous.events,
              gallery: Array.isArray(fetched.gallery) ? fetched.gallery : previous.gallery,
              socialLinks: Array.isArray(fetched.socialLinks) ? fetched.socialLinks : previous.socialLinks,
              seoSettings: Array.isArray(fetched.seoSettings) ? fetched.seoSettings : previous.seoSettings,
              redirects: Array.isArray(fetched.redirects) ? fetched.redirects : previous.redirects,
              pageImages: Array.isArray(fetched.pageImages) ? fetched.pageImages : previous.pageImages,
              footerLinks: Array.isArray(fetched.footerLinks) ? fetched.footerLinks : previous.footerLinks
            }));
            return true;
          } catch (err) {
            lastError = err;
          }
        }

        console.warn('CMS API unavailable after retries; keeping the last loaded content:', lastError?.message);
        return false;
      } finally {
        setIsLoading(false);
        inFlightRequest.current = null;
      }
    })();

    return inFlightRequest.current;
  }, []);

  const refreshCMSData = useCallback(async () => {
    // If the initial/public refresh is still running when an admin save finishes,
    // wait for it and then fetch again so the UI cannot reuse its stale response.
    const pendingRequest = inFlightRequest.current;
    if (pendingRequest) await pendingRequest;
    return fetchCMSData();
  }, [fetchCMSData]);

  useEffect(() => {
    fetchCMSData();
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') fetchCMSData();
    };
    const refreshTimer = window.setInterval(refreshWhenVisible, 60_000);
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [fetchCMSData]);

  return (
    <CMSContext.Provider value={{ ...data, isLoading, refreshCMS: refreshCMSData }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
