import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GET_SERVICE_BY_SLUG, SERVICES_LIST } from '../src/data/servicesData.js';
import { getRouteRobotsDirective, getServiceSlugForCatalogCategory, resolveLegacyProductServiceSlug, resolveUnmatchedRoute } from '../src/utils/seoRouting.js';
import { findExactPageSeoRecord, getCanonicalUrl } from '../src/utils/seoMetadata.js';

test('every configured product category resolves to a service', () => {
  for (const service of SERVICES_LIST) {
    assert.equal(GET_SERVICE_BY_SLUG(service.slug), service);
  }
});

test('unknown product category slugs do not fall back to granite', () => {
  assert.equal(GET_SERVICE_BY_SLUG('not-a-real-category'), null);
});

test('verified legacy product URLs resolve to matching current categories', () => {
  const expected = new Map([
    ['/granite-stone/', 'granite-series'],
    ['/marble-exporter-from-india/', 'marble-series'],
    ['/quartzite-stone-exporters-in-india/', 'quartzite-series'],
    ['/sandstone-exporter-manufactures-from-india/', 'sandstone-series'],
    ['/limestone-exporters-in-india/', 'limestone-series'],
    ['/slate-stone-exporters-from-india/', 'slate-stone'],
    ['/natural-stone-veneer-sheets/', 'stone-veneer'],
    ['/granite-rough-blocks-manufacturer-india/', 'rough-blocks'],
    ['/pebbles-stone-manufacturers-india/', 'landscaping-and-furniture'],
    ['/natural-stone-paving-exporters/', 'landscaping-and-furniture'],
    ['/cobbles-stone/', 'landscaping-and-furniture'],
    ['/stepping-stone-exporters-from-india/', 'landscaping-and-furniture'],
    ['/stone-articles-furnitures/', 'landscaping-and-furniture']
  ]);

  for (const [pathname, serviceSlug] of expected) {
    assert.equal(resolveLegacyProductServiceSlug(pathname), serviceSlug);
    assert.ok(GET_SERVICE_BY_SLUG(serviceSlug));
  }
});

test('unmatched route decision maps known aliases and preserves CMS redirect precedence', () => {
  assert.deepEqual(resolveUnmatchedRoute('/granite-stone/'), {
    type: 'legacy-service',
    serviceSlug: 'granite-series'
  });
  assert.deepEqual(resolveUnmatchedRoute('/granite-stone/', [
    { source_path: '/granite-stone/', target_url: '/contact' }
  ]), {
    type: 'cms-redirect',
    targetUrl: '/contact',
    external: false
  });
  assert.deepEqual(resolveUnmatchedRoute('/not-a-real-route'), { type: 'not-found' });
});

test('unmapped legacy paths remain unresolved rather than guessing a category', () => {
  assert.equal(resolveLegacyProductServiceSlug('/natural-stone-ledgestone-panel-wall-cladding/'), null);
  assert.equal(resolveLegacyProductServiceSlug('/unrecognized-product/'), null);
});

test('private routes stay noindex and public routes stay indexable', () => {
  for (const pathname of ['/login', '/signup', '/dashboard', '/admin', '/admin/login', '/admin/products']) {
    assert.equal(getRouteRobotsDirective(pathname), 'noindex, nofollow');
  }
  for (const pathname of ['/', '/about', '/products', '/products/granite-series']) {
    assert.equal(getRouteRobotsDirective(pathname), 'index, follow');
  }
});

test('unknown routes and unknown product slugs are noindex', () => {
  for (const pathname of ['/not-a-real-page', '/products/not-a-real-category', '/natural-stone-ledgestone-panel-wall-cladding/']) {
    assert.equal(getRouteRobotsDirective(pathname), 'noindex, nofollow');
  }
});

test('CMS product services remain indexable at their product route', () => {
  assert.equal(getRouteRobotsDirective('/products/cms-stone-category', {
    'cms-stone-category': { slug: 'cms-stone-category' }
  }), 'index, follow');
});

test('catalog category links use the actual service slug', () => {
  assert.equal(getServiceSlugForCatalogCategory('Landscaping & Furniture'), 'landscaping-and-furniture');
  assert.equal(getServiceSlugForCatalogCategory('Granite Series'), 'granite-series');
  assert.equal(getServiceSlugForCatalogCategory('Unknown Category'), null);
});

test('category canonical stays self-referencing when only section CMS SEO exists', () => {
  const sectionSeo = [{ page_route: '/products', canonical_url: 'https://arpranindustries.com/products' }];
  const exactSeo = findExactPageSeoRecord(sectionSeo, '/products/granite-series');

  assert.equal(exactSeo, null);
  assert.equal(getCanonicalUrl('/products/granite-series', exactSeo),
    'https://arpranindustries.com/products/granite-series');
});

test('category canonical uses an exact category CMS record when supplied', () => {
  const categorySeo = [{
    page_route: '/products/granite-series',
    canonical_url: 'https://arpranindustries.com/products/granite-series'
  }];
  const exactSeo = findExactPageSeoRecord(categorySeo, '/products/granite-series');

  assert.equal(exactSeo, categorySeo[0]);
  assert.equal(getCanonicalUrl('/products/granite-series', exactSeo), categorySeo[0].canonical_url);
});

test('sitemap URL list exactly matches the configured public canonical routes', () => {
  const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expected = [
    'https://arpranindustries.com/',
    'https://arpranindustries.com/about',
    'https://arpranindustries.com/products',
    ...SERVICES_LIST.map((service) => `https://arpranindustries.com/products/${service.slug}`),
    'https://arpranindustries.com/blog',
    'https://arpranindustries.com/contact'
  ];

  assert.ok(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.equal(new Set(locations).size, locations.length, 'sitemap must not contain duplicate URLs');
  assert.deepEqual([...locations].sort(), expected.sort());
  assert.ok(locations.every((url) => new URL(url).origin === 'https://arpranindustries.com'));
  assert.ok(!locations.some((url) => /ledgestone|\/login|\/signup|\/dashboard|\/admin/i.test(url)));
});
