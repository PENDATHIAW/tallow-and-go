import { formatPrice } from './format'

const waveUrl = import.meta.env.VITE_WAVE_PAYMENT_URL || ''
const orangeMoneyUrl = import.meta.env.VITE_ORANGE_MONEY_PAYMENT_URL || ''
const wavePhone = import.meta.env.VITE_WAVE_MERCHANT_PHONE || ''
const orangeMoneyPhone = import.meta.env.VITE_ORANGE_MONEY_MERCHANT_PHONE || ''

export function isPaymentLinkReady(paymentMethod) {
  if (paymentMethod === 'wave') return Boolean(waveUrl || wavePhone)
  if (paymentMethod === 'orange_money') return Boolean(orangeMoneyUrl || orangeMoneyPhone)
  return true
}

export function getPaymentMethodLabel(paymentMethod, t) {
  const base = t.cart.paymentMethods[paymentMethod] ?? paymentMethod
  if ((paymentMethod === 'wave' || paymentMethod === 'orange_money') && !isPaymentLinkReady(paymentMethod)) {
    return `${base} ${t.checkout.paymentPending}`
  }
  return base
}

export function getPaymentInstructions(paymentMethod, total, locale, t) {
  const amount = formatPrice(total)
  const success = t.checkout.successPayment
  const pending = !isPaymentLinkReady(paymentMethod)

  if (paymentMethod === 'wave') {
    return {
      title: pending ? `${success.waveTitle} ${t.checkout.paymentPending}` : success.waveTitle,
      amount,
      link: waveUrl || null,
      phone: wavePhone || null,
      hint: (pending ? success.wavePendingHint : success.waveHint).replace('{amount}', amount),
      linkLabel: success.payWithWave,
      pending,
    }
  }

  if (paymentMethod === 'orange_money') {
    return {
      title: pending ? `${success.orangeTitle} ${t.checkout.paymentPending}` : success.orangeTitle,
      amount,
      link: orangeMoneyUrl || null,
      phone: orangeMoneyPhone || null,
      hint: (pending ? success.orangePendingHint : success.orangeHint).replace('{amount}', amount),
      linkLabel: success.payWithOrange,
      pending,
    }
  }

  return {
    title: success.cashTitle,
    amount,
    link: null,
    phone: null,
    hint: success.cashHint.replace('{amount}', amount),
    linkLabel: null,
    pending: false,
  }
}
