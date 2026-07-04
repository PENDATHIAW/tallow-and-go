import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

function fmt(amount: number) {
  return `${amount.toLocaleString('fr-FR')} F`
}

function buildBody(order: Record<string, unknown>, locale: string) {
  const items = (order.items as Array<Record<string, unknown>>) ?? []
  const customer = order.customer as Record<string, string>
  const locality = order.locality as { name?: Record<string, string> }
  const localityName = locality?.name?.[locale] ?? locality?.name?.fr ?? ''

  const itemLines = items.map(
    (item) =>
      `• ${item.name} × ${item.quantity} — ${fmt((item.unitPrice as number) * (item.quantity as number))}`,
  )

  return [
    locale === 'fr' ? 'Commande Tallow & Go' : 'Tallow & Go order',
    '',
    `${locale === 'fr' ? 'N° commande' : 'Order no.'} : ${order.orderNumber}`,
    `${customer.name} · ${customer.phone}`,
    customer.email || null,
    localityName,
    customer.address,
    '',
    ...itemLines,
    '',
    `${locale === 'fr' ? 'Sous-total' : 'Subtotal'} : ${fmt(order.subtotal as number)}`,
    `${locale === 'fr' ? 'Livraison' : 'Shipping'} : ${fmt(order.shippingFee as number)}`,
    `${locale === 'fr' ? 'Total' : 'Total'} : ${fmt(order.total as number)}`,
    `${locale === 'fr' ? 'Paiement' : 'Payment'} : ${order.paymentMethod}`,
  ]
    .filter(Boolean)
    .join('\n')
}

async function sendEmail(apiKey: string, from: string, to: string, subject: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  })
  return res.ok
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order, locale = 'fr' } = await req.json()
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const shopEmail = Deno.env.get('SHOP_EMAIL') ?? 'pendathiaw1995@gmail.com'
    const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'Tallow & Go <onboarding@resend.dev>'

    if (!resendKey) {
      return new Response(JSON.stringify({ ok: false, emailSent: false, shopNotified: false, reason: 'not_configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = buildBody(order, locale)
    const customer = order.customer as Record<string, string>
    let emailSent = false

    if (customer.email) {
      const subject =
        locale === 'fr'
          ? `Commande ${order.orderNumber} — Tallow & Go`
          : `Order ${order.orderNumber} — Tallow & Go`
      emailSent = await sendEmail(resendKey, fromEmail, customer.email, subject, body)
    }

    const shopSubject = `Nouvelle commande ${order.orderNumber}`
    const shopBody = customer.email
      ? body
      : `${body}\n\n⚠️ Pas d'email client — confirmer par WhatsApp au ${customer.phone}`
    const shopNotified = await sendEmail(resendKey, fromEmail, shopEmail, shopSubject, shopBody)

    return new Response(JSON.stringify({ ok: true, emailSent, shopNotified }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
