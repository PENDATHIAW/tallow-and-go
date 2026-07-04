import { X } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

export default function ProductModal({ product, onClose }) {
  const { locale, t } = useLocale()
  const { addProduct } = useCart()

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white-warm shadow-2xl dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square bg-tg-cream dark:bg-neutral-900">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-earth shadow dark:bg-neutral-900 dark:text-neutral-100"
            aria-label={t.product.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-earth dark:text-neutral-100">
            {product.tagline[locale]}
          </h2>
          <p className="mt-1 text-sm text-earth-soft">{product.size}</p>
          <p className="mt-4 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">
            {product.description[locale]}
          </p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-earth/60">{t.product.benefits}</p>
            <ul className="mt-2 space-y-1">
              {product.benefits[locale].map((b) => (
                <li key={b} className="text-sm text-earth-soft dark:text-neutral-400">
                  — {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-cream-dark pt-5 dark:border-neutral-800">
            <span className="font-display text-2xl font-semibold text-earth dark:text-neutral-100">
              {formatPrice(product.price)}
            </span>
            <button
              type="button"
              onClick={() => {
                addProduct(product.id)
                onClose()
              }}
              className="rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
            >
              {t.product.add}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
