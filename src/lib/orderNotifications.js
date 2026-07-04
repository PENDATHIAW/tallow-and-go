import { supabase, isSupabaseConfigured } from './supabase'
import { translations } from '../i18n/translations'

function fmt(amount) {
  return `${amount.toLocaleString('fr-FR')} F`
}

export function buildOrderSummaryText(order, locale = 'fr') {
  const tr = translations[locale]?.cart ?? translations.fr.cart
  const itemLines = (order.items ?? []).map(
    (item) => `• ${item.name} × ${item.quantity} — ${fmt(item.unitPrice * item.quantity)}`,
  )
  const localityName = order.locality?.name?.[locale] ?? order.locality?.name?.fr ?? ''
  const paymentLabel = tr.paymentMethods?.[order.paymentMethod] ?? order.paymentMethod

  return [
    locale === 'fr' ? 'Commande Tallow & Go' : 'Tallow & Go order',
    '',
    `${tr.orderNumber} : ${order.orderNumber}`,
    `${order.customer.name} · ${order.customer.phone}`,
    order.customer.email || null,
    localityName,
    order.customer.address,
    '',
    ...itemLines,
    '',
    `${tr.subtotal} : ${fmt(order.subtotal)}`,
    `${tr.shipping} : ${fmt(order.shippingFee)}`,
    `${tr.total} : ${fmt(order.total)}`,
    `${tr.payment} : ${paymentLabel}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendOrderNotifications(order, locale = 'fr') {
  if (!isSupabaseConfigured || !supabase) {
    return { emailSent: false, shopNotified: false }
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
      body: { order, locale },
    })

    if (error) {
      return { emailSent: false, shopNotified: false }
    }

    return {
      emailSent: Boolean(data?.emailSent),
      shopNotified: Boolean(data?.shopNotified ?? data?.ok),
    }
  } catch {
    return { emailSent: false, shopNotified: false }
  }
}
