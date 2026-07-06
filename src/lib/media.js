import { productImages, bundleImages } from '../data/illustrationManifest'

let cache = null

export async function fetchMediaIndex() {
  if (cache) return cache
  try {
    const res = await fetch('/products/media-index.json', { cache: 'no-store' })
    if (!res.ok) throw new Error('index missing')
    cache = await res.json()
    return cache
  } catch {
    const published = Object.values(productImages).map((path) => ({ path, name: path.split('/').pop() }))
    const bundles = Object.values(bundleImages).map((path) => ({ path, name: path.split('/').pop() }))
    return { published, inbox: [], bundles }
  }
}

export function clearMediaIndexCache() {
  cache = null
}

export function getAllMediaPaths(index) {
  const paths = new Set()
  for (const item of index?.published ?? []) paths.add(item.path)
  for (const item of index?.inbox ?? []) paths.add(item.path)
  return [...paths]
}
