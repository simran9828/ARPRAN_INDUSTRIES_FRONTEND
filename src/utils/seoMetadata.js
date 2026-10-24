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
