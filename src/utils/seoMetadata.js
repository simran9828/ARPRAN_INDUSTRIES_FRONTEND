export const PRODUCTION_ORIGIN = 'https://arpranindustries.com';

export function findExactPageSeoRecord(seoSettings = [], canonicalPath = '') {
  const cleanCanonical = (!canonicalPath || canonicalPath === '/')
    ? '/'
    : canonicalPath.replace(/\/$/, '');
  const exactPageIdentifiers = cleanCanonical === '/'
    ? ['home']
    : [cleanCanonical, cleanCanonical.startsWith('/products/')
      ? cleanCanonical.slice('/products/'.length)
      : cleanCanonical.slice(1)];

  return seoSettings?.find((record) =>
    record.page_route === cleanCanonical ||
    record.page_route === canonicalPath ||
    (cleanCanonical === '/' && record.page_route === 'home') ||
    exactPageIdentifiers.includes(record.page_identifier)
  ) || null;
}

export function getCanonicalUrl(canonicalPath = '', exactPageSeoRecord = null) {
  return exactPageSeoRecord?.canonical_url || `${PRODUCTION_ORIGIN}${canonicalPath}`;
}

export function getProductCategoryBreadcrumbs(canonicalPath = '', pageTitle = '') {
  if (!/^\/products\/[a-z0-9-]+$/i.test(canonicalPath) || !pageTitle) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${PRODUCTION_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${PRODUCTION_ORIGIN}/products` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: getCanonicalUrl(canonicalPath) }
    ]
  };
}
