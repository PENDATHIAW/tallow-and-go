import { useEffect } from 'react'

const LOGO_SRC = '/eden/eden-logo.svg'

function installLogo() {
  const candidates = Array.from(document.querySelectorAll('div, p, span, h1, h2'))

  candidates.forEach((node) => {
    if (node.children.length > 0 || node.textContent?.trim() !== 'EDEN') return
    if (node.dataset.edenLogoInstalled === 'true') return

    node.dataset.edenLogoInstalled = 'true'
    node.setAttribute('aria-label', 'EDEN')
    node.textContent = ''

    const image = document.createElement('img')
    image.src = LOGO_SRC
    image.alt = 'EDEN'
    image.className = 'eden-official-logo'
    image.style.width = 'clamp(132px, 24vw, 190px)'
    image.style.height = 'auto'
    image.style.display = 'block'
    image.style.objectFit = 'contain'
    image.style.margin = '0 auto'

    node.appendChild(image)

    const parent = node.parentElement
    if (parent) {
      Array.from(parent.children).forEach((sibling) => {
        if (sibling !== node && sibling.tagName?.toLowerCase() === 'svg') {
          sibling.style.display = 'none'
        }
      })
    }
  })
}

export default function EdenBrandingBridge({ children }) {
  useEffect(() => {
    installLogo()

    const observer = new MutationObserver(() => installLogo())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return children
}
