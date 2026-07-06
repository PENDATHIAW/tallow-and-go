import { useEffect, useState } from 'react'
import { getImageSources } from '../lib/images'

/**
 * WebP en priorité (src direct), PNG en secours. Skeleton discret pendant le chargement.
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  fit = 'cover',
  size = 'full',
  loading = 'lazy',
  priority = false,
  wrapperClassName = '',
}) {
  const { fallback, webp, cardWebp } = getImageSources(src, size)
  const preferred = size === 'card' ? cardWebp ?? webp : webp
  const [currentSrc, setCurrentSrc] = useState(preferred || fallback)
  const [loaded, setLoaded] = useState(false)
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'

  useEffect(() => {
    setCurrentSrc(preferred || fallback)
    setLoaded(false)
  }, [preferred, fallback])

  if (!src) return null

  return (
    <div className={`relative h-full w-full overflow-hidden ${wrapperClassName}`.trim()}>
      {!loaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#f5efe6] via-cream to-[#ebe3d6] dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
          aria-hidden
        />
      ) : null}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallback) {
            setCurrentSrc(fallback)
            setLoaded(false)
          }
        }}
        className={`relative block h-full w-full ${fitClass} ${className}`.trim()}
      />
    </div>
  )
}
