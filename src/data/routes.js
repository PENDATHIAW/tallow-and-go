export const universeSlugs = {
  skin: 'visage',
  body: 'corps',
  essentials: 'essentiels',
  nomades: 'nomades',
}

const slugToId = Object.fromEntries(Object.entries(universeSlugs).map(([id, slug]) => [slug, id]))

export function getUniverseIdFromSlug(slug) {
  return slugToId[slug] ?? null
}

export function getUniversePath(universeId) {
  const slug = universeSlugs[universeId]
  return slug ? `/univers/${slug}` : '/'
}

export function getProductPath(productId) {
  return `/produit/${productId}`
}
