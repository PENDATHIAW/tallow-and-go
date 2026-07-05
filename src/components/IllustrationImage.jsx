import OptimizedImage from './OptimizedImage'

const HAS_EXT = /\.(jpe?g|png|webp)$/i

/**
 * Affiche un visuel — WebP optimisé + fallback PNG UUID.
 */
export default function IllustrationImage({
  name,
  alt = '',
  className = '',
  fit = 'cover',
  fallback = null,
  loading = 'lazy',
  priority = false,
  size = 'full',
  wrapperClassName = '',
}) {
  if (!name) return fallback

  const src = name.startsWith('/') ? name : `/illustrations/${name}`
  if (!HAS_EXT.test(src)) return fallback

  return (
    <OptimizedImage
      src={src.replace(/\.webp$/i, '.png')}
      alt={alt}
      className={className}
      fit={fit}
      size={size}
      loading={loading}
      priority={priority}
      wrapperClassName={wrapperClassName || 'h-full w-full'}
    />
  )
}
