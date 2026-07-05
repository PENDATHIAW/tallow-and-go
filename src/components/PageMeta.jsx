import { useEffect } from 'react'

const SITE = 'Tallow & Go'
const DEFAULT_DESC =
  'Cosmétiques premium au suif purifié, formulés au Sénégal. Livraison Dakar et régions.'

export default function PageMeta({ title, description = DEFAULT_DESC, path = '' }) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Cosmétiques naturels au suif`

    const descTag = document.querySelector('meta[name="description"]')
    if (descTag) descTag.setAttribute('content', description)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogTitle) ogTitle.setAttribute('content', document.title)
    if (ogDesc) ogDesc.setAttribute('content', description)
    if (ogUrl && path) {
      ogUrl.setAttribute('content', `${window.location.origin}${path}`)
    }
  }, [title, description, path])

  return null
}
