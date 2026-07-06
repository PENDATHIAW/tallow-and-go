import { Minus, Plus, X, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { localityGroups, getLocalityById } from '../data/localities'
import { getBundleImage } from '../data/illustrationManifest'
import { formatPrice } from '../lib/format'
import { sendOrderNotifications } from '../lib/orderNotifications'
import { isValidSenegalPhone, normalizeSenegalPhone } from '../lib/phone'
import { getPaymentInstructions, getPaymentMethodLabel } from '../lib/payments'
import { getShippingFeeRange } from '../lib/shipping'
import { submitOrder } from '../lib/orders'
import { openOrderWhatsApp, openSupportWhatsApp } from '../lib/whatsapp'
import OptimizedImage from './OptimizedImage'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

const paymentOptions = ['wave', 'orange_money', 'cash']

export default function CartDrawer() {
  const { locale, t } = useLocale()
  const {
    open,
    step,
    setStep,
    resolved,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
    openCheckout,
    setLastOrder,
    lastOrder,
  } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    localityId: '',
    address: '',
    notes: '',
    paymentMethod: 'wave',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notificationStatus, setNotificationStatus] = useState(null)

  if (!open) return null

  const locality = getLocalityById(form.localityId)
  const shippingFee = locality?.shippingFee ?? 0
  const grandTotal = total + (step === 'recap' || step === 'form' ? shippingFee : 0)
  const { min: minShipping } = getShippingFeeRange()

  const getItemImage = (item) => {
    if (item.type === 'bundle') {
      return getBundleImage(item.id) ?? item.bundle?.image
    }
    return item.product?.image
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!locality) {
      setError(locale === 'fr' ? 'Choisissez une localité.' : 'Choose a location.')
      return
    }
    if (!isValidSenegalPhone(form.phone)) {
      setError(t.checkout.phoneInvalid)
      return
    }
    setSubmitting(true)
    setError('')

    const customer = { ...form, phone: normalizeSenegalPhone(form.phone) }
    const orderItems = resolved.map((item) => ({
      type: item.type,
      id: item.id,
      name: item.type === 'bundle' ? item.bundle?.name : item.product?.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    }))

    const result = await submitOrder({
      customer,
      locality,
      items: orderItems,
      subtotal: total,
      shippingFee,
      total: total + shippingFee,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      locale,
    })

    setSubmitting(false)
    if (!result.ok) {
      setError(result.message)
      return
    }

    setLastOrder({
      orderNumber: result.orderNumber,
      subtotal: total,
      shippingFee,
      total: total + shippingFee,
      paymentMethod: form.paymentMethod,
      locality,
      customer,
      items: orderItems,
    })
    clearCart()
    setStep('recap')
    setNotificationStatus(null)

    sendOrderNotifications(
      {
        orderNumber: result.orderNumber,
        subtotal: total,
        shippingFee,
        total: total + shippingFee,
        paymentMethod: form.paymentMethod,
        locality,
        customer,
        items: orderItems,
      },
      locale,
    ).then(setNotificationStatus)
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40" onClick={closeCart}>
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white-warm shadow-2xl dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4 dark:border-neutral-800">
          <h2 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">
            {step === 'form' ? t.checkout.title : step === 'recap' ? t.checkout.recapTitle : t.cart.title}
          </h2>
          <button type="button" onClick={closeCart} className="rounded-full p-2 text-earth-soft" aria-label={t.product.close}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 'cart' && (
            <>
              {resolved.length === 0 ? (
                <p className="text-center text-sm text-earth-soft">{t.cart.empty}</p>
              ) : (
                <>
                  <ul className="space-y-4">
                  {resolved.map((item) => {
                    const name = item.type === 'bundle' ? item.bundle?.name : item.product?.name
                    const subtitle =
                      item.type === 'bundle' ? item.bundle?.tagline?.[locale] : item.product?.tagline?.[locale]
                    return (
                      <li key={`${item.type}-${item.id}`} className="flex gap-3 border-b border-cream-dark pb-4 dark:border-neutral-800">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5efe6] dark:bg-neutral-900">
                          {getItemImage(item) ? (
                            <OptimizedImage
                              src={getItemImage(item)}
                              alt=""
                              size="card"
                              fit="contain"
                              className="p-1"
                              wrapperClassName="h-full w-full"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-earth dark:text-neutral-100">{name}</p>
                          {subtitle ? <p className="text-xs text-earth-soft">{subtitle}</p> : null}
                          <p className="mt-1 text-sm font-medium text-tg-green">{formatPrice(item.unitPrice)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button type="button" onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)} className="rounded-full border p-1 dark:border-neutral-700">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)} className="rounded-full border p-1 dark:border-neutral-700">
                              <Plus className="h-3 w-3" />
                            </button>
                            <button type="button" onClick={() => removeItem(item.type, item.id)} className="ml-2 text-xs underline text-earth-soft">
                              {t.cart.remove}
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                  </ul>
                  <div className="mt-6 rounded-xl border border-cream-dark bg-cream/40 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-tg-green">{t.cart.trustTitle}</p>
                    <ul className="mt-3 space-y-2 text-xs text-earth-soft dark:text-neutral-400">
                      {t.cart.trustPoints.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="text-tg-green">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'form' && (
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <Field label={t.checkout.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label={t.checkout.phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              <Field label={t.checkout.email} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-earth/60">{t.checkout.locality}</label>
                <select
                  required
                  value={form.localityId}
                  onChange={(e) => setForm({ ...form, localityId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="">{t.checkout.selectLocality}</option>
                  {localityGroups.map((group) => (
                    <optgroup key={group.id} label={group.label[locale]}>
                      {group.localities.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name[locale]}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <Field label={t.checkout.address} value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
              <Field label={t.checkout.notes} value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-earth/60">{t.checkout.paymentLabel}</p>
                <div className="mt-2 space-y-2">
                  {paymentOptions.map((method) => (
                    <label key={method} className="flex cursor-pointer items-center gap-2 rounded-xl border border-cream-dark px-3 py-2 text-sm dark:border-neutral-700">
                      <input
                        type="radio"
                        name="payment"
                        checked={form.paymentMethod === method}
                        onChange={() => setForm({ ...form, paymentMethod: method })}
                      />
                      {getPaymentMethodLabel(method, t)}
                    </label>
                  ))}
                </div>
                {form.paymentMethod !== 'cash' ? (
                  <p className="mt-2 text-xs text-earth-soft">{t.checkout.paymentHint[form.paymentMethod]}</p>
                ) : null}
              </div>
              {locality ? (
                <p className="text-sm text-earth-soft">
                  {t.cart.shipping} : <strong>{formatPrice(shippingFee)}</strong>
                </p>
              ) : null}
              <div className="rounded-xl border border-cream-dark bg-cream/40 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-tg-green">{t.cart.trustTitle}</p>
                <ul className="mt-2 space-y-1.5 text-xs text-earth-soft">
                  {t.cart.trustPoints.slice(0, 3).map((point) => (
                    <li key={point}>✓ {point}</li>
                  ))}
                </ul>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </form>
          )}

          {step === 'recap' && lastOrder && (
            <div className="space-y-4 text-sm">
              <p className="rounded-xl bg-tg-green/10 px-4 py-3 font-semibold text-tg-green">{t.cart.orderOk}</p>
              <p>
                {t.cart.orderNumber} : <strong>{lastOrder.orderNumber}</strong>
              </p>
              <p>{lastOrder.customer.name} · {lastOrder.customer.phone}</p>
              <p>{lastOrder.locality.name[locale]}</p>
              <p>{lastOrder.customer.address}</p>
              <div className="border-t border-cream-dark pt-3 dark:border-neutral-800">
                <p>{t.cart.subtotal} : {formatPrice(lastOrder.subtotal)}</p>
                <p>{t.cart.shipping} : {formatPrice(lastOrder.shippingFee)}</p>
                <p className="mt-2 font-display text-lg font-semibold">{t.cart.total} : {formatPrice(lastOrder.total)}</p>
              </div>
              <p>
                {t.cart.payment} : {getPaymentMethodLabel(lastOrder.paymentMethod, t)}
              </p>

              <PaymentSuccessBlock
                paymentMethod={lastOrder.paymentMethod}
                total={lastOrder.total}
                locale={locale}
                t={t}
              />

              {notificationStatus?.emailSent ? (
                <p className="rounded-xl bg-cream px-4 py-3 text-earth dark:bg-neutral-900 dark:text-neutral-200">
                  {t.checkout.emailSent}
                </p>
              ) : null}
              {notificationStatus && lastOrder.customer.email && !notificationStatus.emailSent ? (
                <p className="rounded-xl bg-cream px-4 py-3 text-earth dark:bg-neutral-900 dark:text-neutral-200">
                  {t.checkout.emailPendingForward}
                </p>
              ) : null}
              {!lastOrder.customer.email ? (
                <p className="text-earth-soft">{t.checkout.whatsappConfirm}</p>
              ) : null}

              <button
                type="button"
                onClick={() => openOrderWhatsApp(lastOrder, locale)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                {t.whatsapp.sendOrder}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-cream-dark px-5 py-5 dark:border-neutral-800">
          {step === 'cart' && (
            <>
              <div className="mb-4 space-y-1 text-sm">
                <div className="flex justify-between font-semibold">
                  <span>{t.cart.subtotal}</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-earth-soft">
                  {t.cart.shippingFrom} {formatPrice(minShipping)} · {t.cart.shippingAtCheckout}
                </p>
              </div>
              {resolved.length > 0 ? (
                <>
                  <button type="button" onClick={openCheckout} className="block w-full rounded-full bg-tg-green py-3.5 text-sm font-semibold text-tg-ivory">
                    {t.cart.confirm}
                  </button>
                  <button
                    type="button"
                    onClick={() => openSupportWhatsApp(locale)}
                    className="mt-3 flex w-full items-center justify-center gap-2 text-sm font-medium text-tg-green"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t.cart.needHelp}
                  </button>
                </>
              ) : null}
            </>
          )}

          {step === 'form' && (
            <>
              <div className="mb-4 space-y-1 text-sm">
                <div className="flex justify-between"><span>{t.cart.subtotal}</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span>{t.cart.shipping}</span><span>{formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between font-semibold"><span>{t.cart.total}</span><span>{formatPrice(grandTotal)}</span></div>
              </div>
              <button form="checkout-form" type="submit" disabled={submitting} className="w-full rounded-full bg-tg-green py-3.5 text-sm font-semibold text-tg-ivory disabled:opacity-60">
                {submitting ? '…' : t.cart.submit}
              </button>
              <button type="button" onClick={() => setStep('cart')} className="mt-3 w-full text-sm underline text-earth-soft">
                {t.cart.back}
              </button>
            </>
          )}

          {step === 'recap' && lastOrder && (
            <>
              <Link
                to="/commande"
                onClick={closeCart}
                className="mb-3 block w-full rounded-full border border-cream-dark py-3 text-center text-sm font-semibold text-earth-soft dark:border-neutral-700"
              >
                {t.cart.viewOrder}
              </Link>
              <button type="button" onClick={closeCart} className="block w-full rounded-full bg-tg-green py-3.5 text-sm font-semibold text-tg-ivory">
                {t.cart.continue}
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

function PaymentSuccessBlock({ paymentMethod, total, locale, t }) {
  const payment = getPaymentInstructions(paymentMethod, total, locale, t)

  return (
    <div className="rounded-xl border border-cream-dark bg-cream/40 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      <p className="font-semibold text-earth dark:text-neutral-100">{payment.title}</p>
      <p className="mt-2 text-earth-soft">{payment.hint}</p>
      {payment.link ? (
        <a
          href={payment.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-full bg-tg-green py-3 text-center text-sm font-semibold text-tg-ivory"
        >
          {payment.linkLabel}
        </a>
      ) : payment.pending ? (
        <p className="mt-4 rounded-full border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          {t.checkout.paymentPending}
        </p>
      ) : null}
      {payment.phone ? (
        <p className="mt-3 text-sm">
          {t.checkout.successPayment.merchantPhone} : <strong>{payment.phone}</strong>
        </p>
      ) : null}
    </div>
  )
}

function Field({ label, value, onChange, required = false }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-earth/60">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-cream-dark bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />
    </div>
  )
}
