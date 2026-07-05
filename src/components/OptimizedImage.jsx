import { useState } from 'react'
import { getImageSources } from '../lib/images'

/**
 * Image WebP + fallback PNG, skeleton pendant le chargement.
 * size: 'card' (grilles) | 'full' (fiche produit, héros)
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  fit = 'contain',
  size = 'full',
  loading = 'lazy',
  priority = false,
  wrapperClassName = '',
}) {
  const [loaded, setLoaded] = useState(false)
  const { fallback, webp, cardWebp } = getImageSources(src, size)
  const webpSrc = size === 'card' ? cardWebp ?? webp : webp
  const fitClass = fit === 'cover' ? 'object-cover' : 'object-contain'

  if (!src) return null

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`.trim()}>
      {!loaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#f5efe6] via-cream to-[#ebe3d6] dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
          aria-hidden
        />
      ) : null}
      <picture>
        {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
        <img
          src={fallback}
          alt={alt}
          loading={priority ? 'eager' : loading}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`relative h-full w-full ${fitClass} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`.trim()}
        />
      </picture>
    </div>
  )
}
