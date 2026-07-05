import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import ProductCard from '../components/ProductCard'
import { getProduct, getProductsByUniverse, products } from '../data/catalog'
import { productPageExtras } from '../data/pageContent'
import { getUniversePath } from '../data/routes'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'

function DetailSection({ title, children }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-earth/60">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

export default function ProductPage() {
  const { productId } = useParams()
  const { locale, t } = useLocale()
  const { addProduct } = useCart()
  const product = getProduct(productId)
  const extras = productPageExtras[locale] ?? productPageExtras.fr

  useEffect(() => {
    if (product) document.title = `${product.name} — Tallow & Go`
  }, [product])

  if (!product) {
    return <Navigate to="/" replace />
  }

  const related = getProductsByUniverse(product.universe)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  const nomadeRelated = product.nomade
    ? products.filter((p) => p.nomade && p.id !== product.id).slice(0, 3)
    : related

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Breadcrumb
          items={[
            { label: t.pages.home, href: '/' },
            { label: t.universes[product.universe].title, href: getUniversePath(product.universe) },
            { label: product.name },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-[#f5efe6] dark:bg-neutral-900">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-earth dark:text-neutral-100 sm:text-4xl">
              {product.tagline[locale]}
            </h1>
            <p className="mt-2 text-sm text-earth-soft">{product.size}</p>
            <p className="mt-4 text-base leading-relaxed text-earth-soft dark:text-neutral-400">
              {product.description[locale]}
            </p>

            <DetailSection title={t.product.benefits}>
              <ul className="space-y-2">
                {(product.benefits?.[locale] ?? []).map((b) => (
                  <li key={b} className="text-sm text-earth-soft dark:text-neutral-300">— {b}</li>
                ))}
              </ul>
            </DetailSection>

            {product.composition ? (
              <DetailSection title={t.product.composition}>
                <p className="text-sm leading-relaxed text-earth-soft">{product.composition[locale].join(' · ')}</p>
              </DetailSection>
            ) : null}

            {product.usage ? (
              <DetailSection title={t.product.usage}>
                <p className="text-sm leading-relaxed text-earth-soft">{product.usage[locale]}</p>
              </DetailSection>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-cream-dark pt-6 dark:border-neutral-800">
              <span className="font-display text-3xl font-semibold text-earth dark:text-neutral-100">
                {formatPrice(product.price)}
              </span>
              <button
                type="button"
                onClick={() => addProduct(product.id)}
                className="rounded-full bg-tg-green px-8 py-3.5 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
              >
                {extras.addToCart}
              </button>
            </div>
            <p className="mt-3 text-xs text-earth-soft">{extras.priceNote}</p>
            <Link to={getUniversePath(product.universe)} className="mt-4 inline-block text-sm font-semibold text-tg-green">
              ← {extras.backToUniverse} {t.universes[product.universe].title}
            </Link>
          </div>
        </div>

        {nomadeRelated.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-earth dark:text-neutral-100">{extras.relatedTitle}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nomadeRelated.map((p) => (
                <ProductCard key={p.id} product={p} linkMode />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
