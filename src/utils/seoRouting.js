import { GET_SERVICE_BY_SLUG, SERVICES_LIST } from '../data/servicesData.js';

const LEGACY_PRODUCT_SERVICE_SLUGS = Object.freeze({
  '/granite-stone': 'granite-series',
  '/marble-exporter-from-india': 'marble-series',
  '/quartzite-stone-exporters-in-india': 'quartzite-series',
  '/sandstone-exporter-manufactures-from-india': 'sandstone-series',
  '/limestone-exporters-in-india': 'limestone-series',
  '/slate-stone-exporters-from-india': 'slate-stone',
  '/natural-stone-veneer-sheets': 'stone-veneer',
  '/granite-rough-blocks-manufacturer-india': 'rough-blocks',
  '/pebbles-stone-manufacturers-india': 'landscaping-and-furniture',
  '/natural-stone-paving-exporters': 'landscaping-and-furniture',
  '/cobbles-stone': 'landscaping-and-furniture',
  '/stepping-stone-exporters-from-india': 'landscaping-and-furniture',
  '/stone-articles-furnitures': 'landscaping-and-furniture'
});

const PRIVATE_ROUTE_PATTERN = /^\/(?:admin|login|signup|dashboard)(?:\/|$)/i;
const STATIC_PUBLIC_ROUTES = new Set(['/', '/about', '/products', '/finishes', '/blog', '/contact', '/services']);

function normalizePathname(pathname = '') {
  const pathOnly = String(pathname).split(/[?#]/)[0].toLowerCase();
  return (`/${pathOnly}`).replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
}

export function resolveLegacyProductServiceSlug(pathname = '') {
  const normalizedPath = normalizePathname(pathname);
  return LEGACY_PRODUCT_SERVICE_SLUGS[normalizedPath] || null;
}

export function resolveUnmatchedRoute(pathname = '', redirects = []) {
  const matchedRedirect = redirects.find((redirect) =>
    typeof redirect.source_path === 'string' &&
    redirect.source_path.toLowerCase() === String(pathname).toLowerCase() &&
    typeof redirect.target_url === 'string' && redirect.target_url
  );

  if (matchedRedirect) {
    return {
      type: 'cms-redirect',
      targetUrl: matchedRedirect.target_url,
      external: matchedRedirect.target_url.startsWith('http')
    };
  }

  const serviceSlug = resolveLegacyProductServiceSlug(pathname);
  if (serviceSlug) return { type: 'legacy-service', serviceSlug };
  return { type: 'not-found' };
}

export function getServiceSlugForCatalogCategory(category, cmsServices = {}) {
  const cmsService = Object.entries(cmsServices || {}).find(
    ([slug, service]) => service.catalogCategory === category || service.catalog_category === category
  );
  if (cmsService) return cmsService[1].slug || cmsService[0];
  return SERVICES_LIST.find(service => service.catalogCategory === category)?.slug || null;
}

export function getRouteRobotsDirective(pathname = '', cmsServices = {}) {
  const normalizedPath = normalizePathname(pathname);
  if (PRIVATE_ROUTE_PATTERN.test(normalizedPath)) return 'noindex, nofollow';
  if (STATIC_PUBLIC_ROUTES.has(normalizedPath)) return 'index, follow';
  if (LEGACY_PRODUCT_SERVICE_SLUGS[normalizedPath]) return 'index, follow';

  const productMatch = normalizedPath.match(/^\/(?:products|services)\/([^/]+)$/);
  if (productMatch) {
    const slug = productMatch[1];
    if (GET_SERVICE_BY_SLUG(slug) || cmsServices?.[slug]) return 'index, follow';
  }

  return 'noindex, nofollow';
}
