import { X } from 'lucide-react'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

export default function ProductModal({ product, onClose }) {
  const { locale, t } = useLocale()
  const { addProduct } = useCart()

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-2 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white-warm shadow-2xl dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex max-h-[min(55vh,520px)] shrink-0 items-center justify-center overflow-hidden bg-[#f5efe6] p-4 dark:bg-neutral-900">
          <img src={product.image} alt={product.name} className="max-h-[min(50vh,480px)] w-full object-contain" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-earth shadow dark:bg-neutral-900"
            aria-label={t.product.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-earth dark:text-neutral-100">
            {product.tagline[locale]}
          </h2>
          <p className="mt-1 text-sm text-earth-soft">{product.size}</p>
          <p className="mt-4 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">
            {product.description[locale]}
          </p>

          <Section title={t.product.benefits}>
            <ul className="space-y-1">
              {(product.benefits?.[locale] ?? []).map((b) => (
                <li key={b} className="text-sm text-earth-soft">— {b}</li>
              ))}
            </ul>
          </Section>

          {product.composition ? (
            <Section title={t.product.composition}>
              <p className="text-sm text-earth-soft">{product.composition[locale].join(' · ')}</p>
            </Section>
          ) : null}

          {product.usage ? (
            <Section title={t.product.usage}>
              <p className="text-sm leading-relaxed text-earth-soft">{product.usage[locale]}</p>
            </Section>
          ) : null}

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

function Section({ title, children }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-earth/60">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}
