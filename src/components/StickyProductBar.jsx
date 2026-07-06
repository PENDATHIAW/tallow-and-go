import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

export default function StickyProductBar({ product }) {
  const { t } = useLocale()
  const { addProduct } = useCart()

  if (!product) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-dark bg-white-warm/95 px-4 py-3 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-wider text-tg-green">{product.name}</p>
          <p className="font-display text-lg font-semibold text-earth dark:text-neutral-100">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={() => addProduct(product.id)}
          className="shrink-0 rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory"
        >
          {t.product.add}
        </button>
      </div>
    </div>
  )
}
