import { useEffect } from 'react'

const SITE = 'Tallow & Go'
const SITE_URL = 'https://tallow-and-go.vercel.app'
const DEFAULT_DESC =
  'Cosmétiques premium au suif purifié, formulés au Sénégal. Livraison partout au Sénégal.'

function absoluteUrl(path) {
  if (!path) return `${SITE_URL}/brand/logo-full.png`
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export default function PageMeta({ title, description = DEFAULT_DESC, path = '', image }) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Cosmétiques naturels au suif`

    const setMeta = (selector, content) => {
      const el = document.querySelector(selector)
      if (el && content) el.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', document.title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:image"]', absoluteUrl(image))
    setMeta('meta[name="twitter:image"]', absoluteUrl(image))
    if (path) setMeta('meta[property="og:url"]', `${SITE_URL}${path}`)
  }, [title, description, path, image])

  return null
}

export { absoluteUrl as metaAbsoluteUrl }
