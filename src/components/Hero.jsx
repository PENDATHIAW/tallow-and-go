import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import IllustrationImage from './IllustrationImage'
import { illustrations } from '../data/illustrations'
import { formatPrice } from '../lib/format'
import { useShopConfig } from '../context/ShopConfigContext'
import { useLocale } from '../context/LocaleContext'

export default function Hero() {
  const { t } = useLocale()
  const { catalog, heroContent } = useShopConfig()
  const minPrice = Math.min(...catalog.products.map((p) => p.price))

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tg-cream via-white-warm to-cream dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-tg-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-tg-gold/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-tg-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">
            <Sparkles className="h-3.5 w-3.5" />
            {heroContent.kicker ?? t.hero.kicker}
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] text-earth dark:text-neutral-100 sm:text-5xl lg:text-6xl">
            {heroContent.title ?? t.hero.title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-earth-soft dark:text-neutral-400">
            {heroContent.subtitle ?? t.hero.subtitle}
          </p>
          <p className="mt-3 text-sm font-medium text-tg-green">
            {t.hero.from} {formatPrice(minPrice)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/univers/visage"
              className="inline-flex items-center gap-2 rounded-full bg-tg-green px-7 py-3.5 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
            >
              {heroContent.cta ?? t.hero.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full border border-cream-dark bg-white-warm px-6 py-3.5 text-sm font-semibold text-earth dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {t.quiz.homeCta}
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cream-dark bg-white-warm p-4 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
            <IllustrationImage
              name={illustrations.pages.homeWhy}
              alt="Tallow & Go"
              fit="contain"
              className="aspect-[4/5] w-full"
              size="full"
              priority
              loading="eager"
              fallback={
                <img src="/brand/logo-full.png" alt="Tallow & Go" className="mx-auto max-h-80 object-contain" />
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
