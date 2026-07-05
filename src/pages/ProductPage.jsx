import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'
import ProductCard from '../components/ProductCard'
import ProductTrustStrip from '../components/ProductTrustStrip'
import ShopCtaBand from '../components/ShopCtaBand'
import { productPageExtras } from '../data/pageContent'
import { getUniversePath } from '../data/routes'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'

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
  const { catalog } = useShopConfig()
  const { getProduct, getProductsByUniverse, products, routines } = catalog
  const product = getProduct(productId)
  const extras = productPageExtras[locale] ?? productPageExtras.fr

  useEffect(() => {
    window.scrollTo(0, 0)
    if (product) document.title = `${product.name} — Tallow & Go`
  }, [productId, product])

  if (!product) {
    return <Navigate to="/" replace />
  }

  const related = getProductsByUniverse(product.universe)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  const nomadeRelated = product.nomade
    ? products.filter((p) => p.nomade && p.id !== product.id).slice(0, 3)
    : related

  const linkedRoutine = product.routine
    ? routines.find((r) => r.id === product.routine.id)
    : null

  return (
    <>
      <PageMeta
        title={`${product.name} — ${product.tagline[locale]}`}
        description={product.description[locale]}
        path={`/produit/${product.id}`}
      />

      <section className="section-padding pt-8 sm:pt-12" id="product-top">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: t.pages.home, href: '/' },
              { label: t.universes[product.universe].title, href: getUniversePath(product.universe) },
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-cream-dark bg-[#f5efe6] dark:border-neutral-800 dark:bg-neutral-900">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[4/5] w-full object-contain p-4"
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {product.featured ? (
                  <span className="rounded-full bg-tg-green px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-tg-ivory">
                    {t.shop.bestSeller}
                  </span>
                ) : null}
                {product.nomade ? (
                  <span className="rounded-full bg-tg-gold/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    {t.shop.nomade}
                  </span>
                ) : null}
                <span className="rounded-full border border-cream-dark px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-earth-soft dark:border-neutral-700">
                  {t.universes[product.universe].title}
                </span>
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-earth dark:text-neutral-100 sm:text-4xl">
                {product.tagline[locale]}
              </h1>
              <p className="mt-2 text-sm text-earth-soft">{product.size}</p>
              <p className="mt-4 text-base leading-relaxed text-earth-soft dark:text-neutral-400">
                {product.description[locale]}
              </p>

              <ProductTrustStrip />

              {linkedRoutine ? (
                <Link
                  to="/routines"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-tg-green/10 px-4 py-2 text-sm font-semibold text-tg-green"
                >
                  <Sparkles className="h-4 w-4" />
                  {t.product.routineLink} · {t.routines.items[linkedRoutine.id]?.title ?? linkedRoutine.id}
                </Link>
              ) : null}

              <DetailSection title={t.product.benefits}>
                <ul className="space-y-2">
                  {(product.benefits?.[locale] ?? []).map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-earth-soft dark:text-neutral-300">
                      <span className="text-tg-green">✓</span> {b}
                    </li>
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

              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-cream-dark bg-cream/30 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
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
            <div className="mt-20 border-t border-cream-dark pt-16 dark:border-neutral-800">
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

      <ShopCtaBand
        title={t.quiz.homeTitle}
        lead={t.quiz.homeLead}
        primaryTo="/quiz"
        primaryLabel={t.quiz.homeCta}
        secondaryTo={getUniversePath(product.universe)}
        secondaryLabel={`${extras.backToUniverse} ${t.universes[product.universe].title}`}
      />
    </>
  )
}
