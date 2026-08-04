function hostnameLooksLikeEden() {
  if (typeof window === 'undefined') return false

  const host = window.location.hostname.toLowerCase()
  const firstLabel = host.split('.')[0]

  return (
    firstLabel === 'eden' ||
    firstLabel.startsWith('eden-') ||
    firstLabel.endsWith('-eden') ||
    firstLabel.includes('-eden-')
  )
}

/**
 * The original Tallow & Go Vercel project keeps the complete shop.
 * A Vercel project named EDEN, or a deployment with VITE_APP_MODE=eden,
 * exposes only the private EDEN application at the root URL.
 */
export const EDEN_STANDALONE =
  import.meta.env.VITE_APP_MODE === 'eden' || hostnameLooksLikeEden()
