import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import PageMeta from '../components/PageMeta'
import OptimizedImage from '../components/OptimizedImage'
import IllustrationImage from '../components/IllustrationImage'
import ShopCtaBand from '../components/ShopCtaBand'
import { bundlesPageContent } from '../data/pageContent'
import { getBundleImage } from '../data/illustrationManifest'
import { getProductPath } from '../data/routes'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'

export default function BundlePage() {
  const { bundleId } = useParams()
  const { locale, t } = useLocale()
  const { addBundle } = useCart()
  const { catalog } = useShopConfig()
  const { getBundle, getProduct } = catalog
  const bundle = getBundle(bundleId)
  const content = bundlesPageContent[locale] ?? bundlesPageContent.fr

  useEffect(() => {
    window.scrollTo(0, 0)
    if (bundle) document.title = `${bundle.name} — Tallow & Go`
  }, [bundleId, bundle])

  if (!bundle) {
    return <Navigate to="/coffrets" replace />
  }

  const detail =
    bundle.id === 'mama-bear' ? content.mamaBearDetail : content.edenDetail
  const products = bundle.productIds.map((id) => getProduct(id)).filter(Boolean)

  return (
    <>
      <PageMeta
        title={`${bundle.name} — ${bundle.tagline[locale]}`}
        description={bundle.description[locale]}
        path={`/coffret/${bundle.id}`}
        image={bundle.image}
      />

      <section className="section-padding-compact pt-8 sm:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: t.pages.home, href: '/' },
              { label: t.bundles.title, href: '/coffrets' },
              { label: bundle.name },
            ]}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-cream-dark bg-[#f5efe6] dark:border-neutral-800 dark:bg-neutral-900 lg:sticky lg:top-24">
              <IllustrationImage
                name={getBundleImage(bundle.id) ?? bundle.image}
                alt={bundle.name}
                fit="cover"
                size="full"
                className="aspect-[4/5] w-full"
                wrapperClassName="aspect-[4/5] w-full"
                priority
                loading="eager"
                fallback={
                  <OptimizedImage
                    src={bundle.image}
                    alt={bundle.name}
                    fit="cover"
                    size="full"
                    className="aspect-[4/5] w-full"
                    wrapperClassName="aspect-[4/5] w-full"
                    priority
                    loading="eager"
                  />
                }
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-tg-green">{bundle.name}</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-earth dark:text-neutral-100 sm:text-4xl">
                {bundle.tagline[locale]}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-earth-soft dark:text-neutral-400">
                {bundle.description[locale]}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-earth-soft dark:text-neutral-300">{detail}</p>

              {products.length > 0 ? (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-earth/60">{t.bundles.includes}</p>
                  <ul className="mt-3 space-y-2">
                    {products.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={getProductPath(p.id)}
                          className="flex items-center justify-between gap-3 rounded-xl border border-cream-dark px-4 py-3 text-sm transition hover:border-tg-green dark:border-neutral-800"
                        >
                          <span>
                            <span className="font-semibold text-earth dark:text-neutral-100">{p.name}</span>
                            <span className="text-earth-soft"> — {p.tagline[locale]}</span>
                          </span>
                          <span className="shrink-0 font-medium text-tg-green">{formatPrice(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-earth/60">{t.bundles.includes}</p>
                  <ul className="mt-3 space-y-2">
                    {(content.edenIncludes ?? []).map((item) => (
                      <li key={item} className="flex gap-2 rounded-xl border border-cream-dark px-4 py-3 text-sm text-earth-soft dark:border-neutral-800">
                        <span className="text-tg-green">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-cream-dark bg-cream/30 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <span className="font-display text-3xl font-semibold text-earth dark:text-neutral-100">
                  {formatPrice(bundle.price)}
                </span>
                <button
                  type="button"
                  onClick={() => addBundle(bundle.id)}
                  className="rounded-full bg-tg-green px-8 py-3.5 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
                >
                  {t.bundles.add}
                </button>
              </div>

              <Link to="/coffrets" className="mt-4 inline-block text-sm font-semibold text-tg-green">
                ← {t.bundles.backToAll}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ShopCtaBand
        title={t.routines.title}
        lead={content.intro}
        primaryTo="/routines"
        primaryLabel={t.pages.seeAllRoutines}
        secondaryTo="/boutique"
        secondaryLabel={t.shop.viewAll}
      />
    </>
  )
}
