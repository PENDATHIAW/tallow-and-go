import { useMemo, useState } from 'react'

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
const HAS_EXT = /\.(jpe?g|png|webp)$/i

function buildSrc(name, extIndex) {
  const ext = EXTENSIONS[extIndex]
  if (!ext) return null
  const path = name.startsWith('/') ? name : `/illustrations/${name}`
  const normalized = path.replace(/\.(jpe?g|png|webp)$/i, '')
  return `${normalized}.${ext}`
}

/**
 * Affiche un visuel tel quel — chemins UUID conservés, sans renommage.
 */
export default function IllustrationImage({
  name,
  alt = '',
  className = '',
  fit = 'cover',
  fallback = null,
  loading = 'lazy',
}) {
  const directSrc = useMemo(() => (name && HAS_EXT.test(name) ? name : null), [name])
  const [extIndex, setExtIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const src = directSrc ?? buildSrc(name, extIndex)

  if (!name || failed || !src) {
    return fallback
  }

  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`h-full w-full ${fitClass} ${className}`.trim()}
      onError={() => {
        if (directSrc) {
          setFailed(true)
          return
        }
        if (extIndex + 1 < EXTENSIONS.length) {
          setExtIndex((i) => i + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}
