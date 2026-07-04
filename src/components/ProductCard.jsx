import { formatPrice } from '../lib/format'
import { useLocale } from '../context/LocaleContext'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onSelect }) {
  const { locale, t } = useLocale()
  const { addProduct } = useCart()

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream-dark/80 bg-white-warm transition hover:-translate-y-1 hover:border-tg-green/20 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
      <button type="button" onClick={() => onSelect(product)} className="text-left">
        <div className="relative aspect-square overflow-hidden bg-tg-cream dark:bg-neutral-900">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {product.featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-tg-green px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-tg-ivory">
              {t.shop.bestSeller}
            </span>
          ) : null}
          {product.nomade ? (
            <span className="absolute right-3 top-3 rounded-full bg-tg-gold/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
              {t.shop.nomade}
            </span>
          ) : null}
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <button type="button" onClick={() => onSelect(product)} className="text-left">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-earth dark:text-neutral-100">
            {product.tagline[locale]}
          </h3>
          <p className="mt-1 text-xs text-earth-soft dark:text-neutral-500">{product.size}</p>
        </button>

        <p className="mt-3 flex-1 text-xs leading-relaxed text-earth-soft dark:text-neutral-400">
          {product.description[locale]}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-cream-dark/60 pt-4 dark:border-neutral-800">
          <span className="font-display text-lg font-semibold text-earth dark:text-neutral-100">
            {formatPrice(product.price)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="rounded-full border border-cream-dark px-3 py-1.5 text-xs font-semibold text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
            >
              {t.shop.view}
            </button>
            <button
              type="button"
              onClick={() => addProduct(product.id)}
              className="rounded-full bg-tg-green px-3 py-1.5 text-xs font-semibold text-tg-ivory transition hover:bg-tg-green-light"
            >
              {t.shop.add}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
