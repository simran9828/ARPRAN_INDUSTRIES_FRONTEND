const OPTIMIZED_IMAGE_VERSION = '20261103';

/** Add a cache key only to bundled image paths that were recompressed. */
export function getImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl.startsWith('/images/')) return imageUrl;

  const [path, ...queryParts] = imageUrl.split('?');
  const query = new URLSearchParams(queryParts.join('?'));
  query.set('v', OPTIMIZED_IMAGE_VERSION);
  return `${path}?${query.toString()}`;
}
