import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COMPANY_INFO } from '../data/stoneData';
import CATALOG_DATA from '../data/catalog.json';

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

  const fetchCMSData = useCallback(async () => {
    try {
      const res = await fetch('/api/public/all');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const fetched = json.data;

          // Rebuild catalogMap by category name for 100% backward compatibility
          const newCatalogMap = { ...CATALOG_DATA };
          delete newCatalogMap['Quartz Series'];
          delete newCatalogMap['Wall Cladding'];
          delete newCatalogMap['Semi-Precious Stone'];

          if (fetched.products && fetched.products.length > 0) {
            const grouped = {};
            fetched.products.forEach(p => {
              const cat = p.category_name || 'Granite Series';
              const lower = cat.toLowerCase();
              if (lower === 'quartz series' || lower === 'wall cladding' || lower.includes('semi-precious') || lower.includes('semi precious')) {
                return;
              }
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push({
                id: p.slug || `prod_${p.id}`,
                dbId: p.id,
                name: p.name,
                category: p.category_name,
                image: p.main_image,
                additional_images: p.additional_images,
                short_description: p.short_description,
                full_description: p.full_description,
                specifications: p.specifications,
                finishes: p.finishes,
                page: p.page_number
              });
            });
            Object.keys(grouped).forEach(k => {
              newCatalogMap[k] = grouped[k];
            });
          }

          const rawCategoriesList = fetched.categories?.length ? fetched.categories : data.categories;
          const filteredCategories = rawCategoriesList.filter(c => {
            const name = (c.name || c.catalog_category || '').toLowerCase();
            return name !== 'quartz series' && name !== 'wall cladding' && !name.includes('semi-precious') && !name.includes('semi precious');
          });

          setData({
            settings: { ...data.settings, ...(fetched.settings || {}) },
            heroSlides: fetched.heroSlides?.length ? fetched.heroSlides : data.heroSlides,
            categories: filteredCategories,
            products: (fetched.products || []).filter(p => {
              const cat = (p.category_name || '').toLowerCase();
              return cat !== 'quartz series' && cat !== 'wall cladding' && !cat.includes('semi-precious') && !cat.includes('semi precious');
            }),
            catalogMap: newCatalogMap,
            pages: fetched.pages || {},
            blogs: fetched.blogs || [],
            services: fetched.services || {},
            about: fetched.about || fetched.pages?.about || null,
            documents: fetched.documents || [],
            events: fetched.events || [],
            gallery: fetched.gallery || [],
            socialLinks: fetched.socialLinks || [],
            seoSettings: fetched.seoSettings || [],
            redirects: fetched.redirects || [],
            pageImages: fetched.pageImages || [],
            footerLinks: fetched.footerLinks || []
          });
        }
      }
    } catch (err) {
      console.warn('CMS public API unavailable, using local cached store:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCMSData();
  }, [fetchCMSData]);

  return (
    <CMSContext.Provider value={{ ...data, isLoading, refreshCMS: fetchCMSData }}>
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
