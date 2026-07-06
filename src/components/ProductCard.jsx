import { Link } from 'react-router-dom'
import OptimizedImage from './OptimizedImage'
import { formatPrice } from '../lib/format'
import { getProductPath } from '../data/routes'
import { useLocale } from '../context/LocaleContext'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, onSelect, linkMode = false, priority = false }) {
  const { locale, t } = useLocale()
  const { addProduct } = useCart()
  const productPath = getProductPath(product.id)

  const TitleWrap = linkMode ? Link : 'button'
  const titleProps = linkMode
    ? { to: productPath, className: 'text-left block' }
    : { type: 'button', onClick: () => onSelect?.(product), className: 'text-left' }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cream-dark/80 bg-white-warm transition hover:-translate-y-1 hover:border-tg-green/20 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
      {linkMode ? (
        <Link to={productPath} className="block">
          <ProductImage product={product} t={t} priority={priority} />
        </Link>
      ) : (
        <button type="button" onClick={() => onSelect?.(product)} className="text-left">
          <ProductImage product={product} t={t} priority={priority} />
        </button>
      )}

      <div className="flex flex-1 flex-col p-4">
        <TitleWrap {...titleProps}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-earth dark:text-neutral-100">
            {product.tagline[locale]}
          </h3>
          <p className="mt-1 text-xs text-earth-soft dark:text-neutral-500">{product.size}</p>
        </TitleWrap>

        <p className="mt-3 flex-1 text-xs leading-relaxed text-earth-soft dark:text-neutral-400">
          {product.description[locale]}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-cream-dark/60 pt-4 dark:border-neutral-800">
          <span className="font-display text-lg font-semibold text-earth dark:text-neutral-100">
            {formatPrice(product.price)}
          </span>
          <div className="flex gap-2">
            {linkMode ? (
              <Link
                to={productPath}
                className="rounded-full border border-cream-dark px-3 py-1.5 text-xs font-semibold text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
              >
                {t.shop.view}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onSelect?.(product)}
                className="rounded-full border border-cream-dark px-3 py-1.5 text-xs font-semibold text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
              >
                {t.shop.view}
              </button>
            )}
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

function ProductImage({ product, t, priority = false }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#f5efe6] dark:bg-neutral-900">
      <OptimizedImage
        src={product.image}
        alt={product.name}
        size="card"
        fit="cover"
        size="card"
        className="transition duration-500 group-hover:scale-[1.02]"
        wrapperClassName="h-full w-full"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
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
  )
}
