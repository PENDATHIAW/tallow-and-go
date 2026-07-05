import { Link, Navigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'
import { getPaymentMethodLabel } from '../lib/payments'
import { formatPrice } from '../lib/format'
import { openOrderWhatsApp } from '../lib/whatsapp'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

export default function OrderPage() {
  const { locale, t } = useLocale()
  const { lastOrder } = useCart()

  if (!lastOrder) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="section-padding">
      <PageMeta title={t.order.pageTitle} path="/commande" />
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: t.order.pageTitle }]} />

        <div className="mt-8 rounded-2xl border border-cream-dark bg-white-warm p-6 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="rounded-xl bg-tg-green/10 px-4 py-3 text-sm font-semibold text-tg-green">{t.cart.orderOk}</p>

          <p className="mt-6 text-sm">
            {t.cart.orderNumber} : <strong className="font-display text-lg">{lastOrder.orderNumber}</strong>
          </p>
          <p className="mt-2 text-sm text-earth-soft">
            {lastOrder.customer.name} · {lastOrder.customer.phone}
          </p>
          <p className="text-sm text-earth-soft">{lastOrder.locality.name[locale]}</p>
          <p className="text-sm text-earth-soft">{lastOrder.customer.address}</p>

          <ul className="mt-6 space-y-2 border-t border-cream-dark pt-4 text-sm dark:border-neutral-800">
            {(lastOrder.items ?? []).map((item) => (
              <li key={`${item.type}-${item.id}`} className="flex justify-between gap-4">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-1 border-t border-cream-dark pt-4 text-sm dark:border-neutral-800">
            <div className="flex justify-between"><span>{t.cart.subtotal}</span><span>{formatPrice(lastOrder.subtotal)}</span></div>
            <div className="flex justify-between"><span>{t.cart.shipping}</span><span>{formatPrice(lastOrder.shippingFee)}</span></div>
            <div className="flex justify-between font-semibold"><span>{t.cart.total}</span><span>{formatPrice(lastOrder.total)}</span></div>
            <p className="pt-2 text-earth-soft">
              {t.cart.payment} : {getPaymentMethodLabel(lastOrder.paymentMethod, t)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openOrderWhatsApp(lastOrder, locale)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            {t.whatsapp.sendOrder}
          </button>

          <Link to="/" className="mt-4 block text-center text-sm font-semibold text-tg-green">
            {t.pages.backHome}
          </Link>
        </div>
      </div>
    </section>
  )
}
