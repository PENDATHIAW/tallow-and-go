import { buildOrderSummaryText } from './orderNotifications'

const DEFAULT_NUMBER = '221785890153'

export function getWhatsAppNumber() {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER
  return raw.replace(/\D/g, '')
}

/** Lien web (fallback mobile web) */
export function buildWhatsAppWebUrl(text) {
  const encoded = encodeURIComponent(text)
  return `https://wa.me/${getWhatsAppNumber()}?text=${encoded}`
}

/** Lien app native WhatsApp Desktop / mobile */
export function buildWhatsAppAppUrl(text) {
  const encoded = encodeURIComponent(text)
  return `whatsapp://send?phone=${getWhatsAppNumber()}&text=${encoded}`
}

export function buildWhatsAppUrl(text) {
  return buildWhatsAppAppUrl(text)
}

/**
 * Ouvre WhatsApp installé (whatsapp://) puis fallback wa.me si l'app ne répond pas.
 */
export function openWhatsApp(text) {
  const appUrl = buildWhatsAppAppUrl(text)
  const webUrl = buildWhatsAppWebUrl(text)

  const link = document.createElement('a')
  link.href = appUrl
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  window.setTimeout(() => {
    if (document.visibilityState === 'visible') {
      window.open(webUrl, '_blank', 'noopener,noreferrer')
    }
  }, 1200)
}

export function buildOrderWhatsAppUrl(order, locale = 'fr') {
  const intro =
    locale === 'fr'
      ? 'Bonjour Tallow & Go, voici ma commande :'
      : 'Hello Tallow & Go, here is my order:'
  return buildWhatsAppAppUrl(`${intro}\n\n${buildOrderSummaryText(order, locale)}`)
}

export function openOrderWhatsApp(order, locale = 'fr') {
  const intro =
    locale === 'fr'
      ? 'Bonjour Tallow & Go, voici ma commande :'
      : 'Hello Tallow & Go, here is my order:'
  openWhatsApp(`${intro}\n\n${buildOrderSummaryText(order, locale)}`)
}

export function buildSupportWhatsAppUrl(locale = 'fr') {
  const text =
    locale === 'fr'
      ? 'Bonjour Tallow & Go, j\'aimerais des conseils sur vos produits.'
      : 'Hello Tallow & Go, I would like advice on your products.'
  return buildWhatsAppAppUrl(text)
}

export function openSupportWhatsApp(locale = 'fr') {
  const text =
    locale === 'fr'
      ? 'Bonjour Tallow & Go, j\'aimerais des conseils sur vos produits.'
      : 'Hello Tallow & Go, I would like advice on your products.'
  openWhatsApp(text)
}
