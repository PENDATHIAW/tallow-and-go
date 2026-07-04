import { Minus, Plus, X } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

export default function CartDrawer() {
  const { locale, t } = useLocale()
  const { open, setOpen, resolved, total, updateQuantity, removeItem, getWhatsAppUrl } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40" onClick={() => setOpen(false)}>
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white-warm shadow-2xl dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4 dark:border-neutral-800">
          <h2 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">{t.cart.title}</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-earth-soft hover:bg-cream dark:text-neutral-400"
            aria-label={t.product.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {resolved.length === 0 ? (
            <p className="text-center text-sm text-earth-soft dark:text-neutral-400">{t.cart.empty}</p>
          ) : (
            <ul className="space-y-4">
              {resolved.map((item) => {
                const name = item.type === 'bundle' ? item.bundle?.name : item.product?.name
                const subtitle =
                  item.type === 'bundle'
                    ? item.bundle?.tagline?.[locale]
                    : item.product?.tagline?.[locale]

                return (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="flex gap-4 border-b border-cream-dark pb-4 dark:border-neutral-800"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-earth dark:text-neutral-100">{name}</p>
                      {subtitle ? (
                        <p className="text-xs text-earth-soft dark:text-neutral-400">{subtitle}</p>
                      ) : null}
                      <p className="mt-1 text-sm font-medium text-tg-green">{formatPrice(item.unitPrice)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                          className="rounded-full border border-cream-dark p-1 dark:border-neutral-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                          className="rounded-full border border-cream-dark p-1 dark:border-neutral-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.type, item.id)}
                          className="ml-2 text-xs text-earth-soft underline dark:text-neutral-500"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-cream-dark px-5 py-5 dark:border-neutral-800">
          <div className="mb-4 flex justify-between text-base font-semibold text-earth dark:text-neutral-100">
            <span>{t.cart.total}</span>
            <span>{formatPrice(total)}</span>
          </div>
          {resolved.length > 0 ? (
            <a
              href={getWhatsAppUrl(locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-tg-green py-3.5 text-center text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
            >
              {t.cart.checkout}
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full text-center text-sm text-earth-soft underline dark:text-neutral-400"
          >
            {t.cart.continue}
          </button>
        </div>
      </aside>
    </div>
  )
}
