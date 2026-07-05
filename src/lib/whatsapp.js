import { buildOrderSummaryText } from './orderNotifications'

const DEFAULT_NUMBER = '221785890153'

export function getWhatsAppNumber() {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_NUMBER
  return raw.replace(/\D/g, '')
}

export function buildWhatsAppUrl(text) {
  const encoded = encodeURIComponent(text)
  return `https://wa.me/${getWhatsAppNumber()}?text=${encoded}`
}

export function buildOrderWhatsAppUrl(order, locale = 'fr') {
  const intro =
    locale === 'fr'
      ? 'Bonjour Tallow & Go, voici ma commande :'
      : 'Hello Tallow & Go, here is my order:'
  return buildWhatsAppUrl(`${intro}\n\n${buildOrderSummaryText(order, locale)}`)
}

export function buildSupportWhatsAppUrl(locale = 'fr') {
  const text =
    locale === 'fr'
      ? 'Bonjour Tallow & Go, j\'aimerais des conseils sur vos produits.'
      : 'Hello Tallow & Go, I would like advice on your products.'
  return buildWhatsAppUrl(text)
}
