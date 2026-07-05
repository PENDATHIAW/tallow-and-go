import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Remonte en haut de page à chaque changement de route (fix scroll conservé). */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
