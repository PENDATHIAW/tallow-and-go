import { useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import BundlesSection from '../components/BundlesSection'
import { bundles, getProduct } from '../data/catalog'
import { bundlesPageContent } from '../data/pageContent'
import { formatPrice } from '../lib/format'
import { useLocale } from '../context/LocaleContext'

export default function BundlesPage() {
  const { locale, t } = useLocale()
  const content = bundlesPageContent[locale] ?? bundlesPageContent.fr

  useEffect(() => {
    document.title = `${t.bundles.title} — Tallow & Go`
  }, [t.bundles.title])

  return (
    <>
      <PageHero
        kicker={t.bundles.kicker}
        title={t.bundles.title}
        subtitle={content.intro}
        image="/illustrations/coffrets-hero.jpg"
        imageAlt={t.bundles.title}
      />
      <section className="section-padding pt-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: t.pages.home, href: '/' }, { label: t.bundles.title }]} />

          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {bundles.map((bundle) => (
              <article key={bundle.id} className="rounded-2xl border border-cream-dark bg-cream/40 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <h3 className="font-display text-lg font-semibold text-earth dark:text-neutral-100">{bundle.name}</h3>
                <p className="mt-2 text-sm text-earth-soft dark:text-neutral-400">
                  {bundle.id === 'mama-bear' ? content.mamaBearDetail : content.edenDetail}
                </p>
                {bundle.productIds.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm text-earth-soft">
                    {bundle.productIds.map((id) => {
                      const p = getProduct(id)
                      return p ? (
                        <li key={id}>
                          — {p.name} · {formatPrice(p.price)}
                        </li>
                      ) : null
                    })}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
        <BundlesSection />
      </section>
    </>
  )
}
