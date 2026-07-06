import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import ShopCtaBand from '../components/ShopCtaBand'
import { illustrations } from '../data/illustrations'
import { getUniversePath } from '../data/routes'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'

const universeFilters = ['all', 'skin', 'body', 'essentials', 'nomades']

export default function ShopPage() {
  const { t } = useLocale()
  const { catalog } = useShopConfig()
  const { products } = catalog
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    document.title = `${t.shop.title} — Tallow & Go`
  }, [t.shop.title])

  const filtered = useMemo(() => {
    if (filter === 'nomades') return products.filter((p) => p.nomade)
    if (filter === 'all') return products
    return products.filter((p) => p.universe === filter)
  }, [filter, products])

  return (
    <>
      <PageHero
        kicker={t.shop.kicker}
        title={t.shop.title}
        subtitle={t.shop.lead}
        image={illustrations.pages.bundles}
        imageAlt={t.shop.title}
      />

      <section className="section-padding-compact pt-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: t.shop.title }]} />

          <div className="mt-8 flex flex-wrap gap-2">
            {universeFilters.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === id
                    ? 'bg-tg-green text-tg-ivory'
                    : 'border border-cream-dark text-earth-soft hover:border-tg-green hover:text-tg-green dark:border-neutral-700'
                }`}
              >
                {id === 'all' ? t.shop.filterAll : t.universes[id].title}
                {id !== 'all' ? (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({id === 'nomades' ? products.filter((p) => p.nomade).length : products.filter((p) => p.universe === id).length})
                  </span>
                ) : (
                  <span className="ml-1.5 text-xs opacity-70">({products.length})</span>
                )}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-earth-soft dark:text-neutral-400">
            {filtered.length} {filtered.length > 1 ? t.shop.productCountPlural : t.shop.productCount}
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} linkMode priority={index < 4} />
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-3 border-t border-cream-dark pt-10 dark:border-neutral-800">
            {universeFilters.filter((id) => id !== 'all' && id !== filter).map((id) => (
              <Link
                key={id}
                to={id === 'nomades' ? getUniversePath('nomades') : getUniversePath(id)}
                className="rounded-full border border-cream-dark px-4 py-2 text-sm font-medium text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
              >
                {t.universes[id].title} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ShopCtaBand
        title={t.quiz.homeTitle}
        lead={t.shop.quizLead}
        primaryTo="/quiz"
        primaryLabel={t.quiz.homeCta}
        secondaryTo="/routines"
        secondaryLabel={t.pages.seeAllRoutines}
      />
    </>
  )
}
