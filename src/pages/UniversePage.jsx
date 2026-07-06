import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import ShopCtaBand from '../components/ShopCtaBand'
import { getUniverseHeroImage, universePageContent } from '../data/pageContent'
import { getUniverseIdFromSlug, getUniversePath } from '../data/routes'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'

export default function UniversePage() {
  const { slug } = useParams()
  const { locale, t } = useLocale()
  const { catalog } = useShopConfig()
  const { getProductsByUniverse } = catalog
  const universeId = getUniverseIdFromSlug(slug)
  const content = universeId ? universePageContent[universeId]?.[locale] : null
  const items = universeId ? getProductsByUniverse(universeId) : []

  useEffect(() => {
    if (universeId) {
      document.title = `${t.universes[universeId].title} — Tallow & Go`
    }
  }, [universeId, t.universes])

  if (!universeId || !content) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <PageHero
        kicker={t.universes[universeId].title}
        title={t.universes[universeId].title}
        subtitle={content.intro}
        image={getUniverseHeroImage(universeId)}
        imageAlt={t.universes[universeId].title}
      />

      <section className="section-padding-compact pt-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: t.pages.home, href: '/' },
              { label: t.nav.shop, href: '/boutique' },
              { label: t.universes[universeId].title },
            ]}
          />

          <h2 className="mt-8 font-display text-2xl font-semibold text-earth dark:text-neutral-100">
            {t.pages.productsInUniverse} ({items.length})
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product, index) => (
              <ProductCard key={product.id} product={product} linkMode priority={index < 4} />
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-cream-dark pt-12 lg:grid-cols-3 dark:border-neutral-800">
            <div className="lg:col-span-2">
              <h3 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">{t.pages.highlights}</h3>
              <ul className="mt-4 space-y-3">
                {content.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-earth-soft dark:text-neutral-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-tg-green" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="rounded-2xl border border-cream-dark bg-cream/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
              <h3 className="font-display text-lg font-semibold text-earth dark:text-neutral-100">{content.ritualTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{content.ritual}</p>
              <p className="mt-4 rounded-xl bg-tg-green/10 px-4 py-3 text-sm text-tg-green">{content.tip}</p>
              <Link
                to="/routines"
                className="mt-4 inline-block text-sm font-semibold text-tg-green underline-offset-4 hover:underline"
              >
                {t.pages.seeRoutinesLink}
              </Link>
            </aside>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to="/boutique"
              className="rounded-full border border-cream-dark px-4 py-2 text-sm font-medium text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
            >
              {t.nav.shopAll} →
            </Link>
            {Object.keys(universePageContent)
              .filter((id) => id !== universeId)
              .map((id) => (
                <Link
                  key={id}
                  to={getUniversePath(id)}
                  className="rounded-full border border-cream-dark px-4 py-2 text-sm font-medium text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
                >
                  {t.universes[id].title} →
                </Link>
              ))}
          </div>
        </div>
      </section>

      <ShopCtaBand
        title={t.universe.ctaTitle}
        lead={content.tip}
        primaryTo="/routines"
        primaryLabel={t.pages.seeAllRoutines}
        secondaryTo="/quiz"
        secondaryLabel={t.quiz.homeCta}
      />
    </>
  )
}
