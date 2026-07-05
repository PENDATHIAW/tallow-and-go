/** Chemins d'images optimisées (WebP) — PNG/JPG UUID conservés en fallback. */

export function toWebp(path) {
  if (!path) return null
  return path.replace(/\.(png|jpe?g)$/i, '.webp')
}

export function toCardWebp(path) {
  if (!path) return null
  return path.replace(/\.(png|jpe?g)$/i, '-sm.webp')
}

export function getImageSources(path, size = 'full') {
  if (!path) {
    return { fallback: '', webp: null, cardWebp: null }
  }

  return {
    fallback: path,
    webp: toWebp(path),
    cardWebp: toCardWebp(path),
  }
}

/** Images critiques à précharger sur l'accueil. */
export function getHomePreloadImages() {
  return [
    '/illustrations/5EF0FFEB-F27A-4248-B35F-CE0009351D50.webp',
    '/products/BA5CA76E-B226-480C-A2CD-54C01D4FF7C5-sm.webp',
    '/products/32C60D3F-8CFA-44FC-8AF8-717FD0B4F871-sm.webp',
    '/products/06C35FCC-202E-4145-B055-1C5ED2BD8FFB-sm.webp',
    '/products/54F8B2D4-A4BF-4C7D-AAAA-7BFC4AFE06B2-sm.webp',
  ]
}

export function preloadImages(urls) {
  urls.forEach((href) => {
    if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = href
    document.head.appendChild(link)
  })
}
