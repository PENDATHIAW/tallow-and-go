import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products } from '../data/catalog'
import { formatPrice } from '../lib/format'
import { useLocale } from '../context/LocaleContext'

export default function Hero() {
  const { t } = useLocale()
  const minPrice = Math.min(...products.map((p) => p.price))

  return (
    <section className="relative overflow-hidden bg-tg-cream dark:bg-neutral-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-tg-green">{t.hero.kicker}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-earth dark:text-neutral-100 sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-earth-soft dark:text-neutral-400">
            {t.hero.subtitle}
          </p>
          <p className="mt-3 text-sm text-earth-soft/80 dark:text-neutral-500">
            {t.hero.from} {formatPrice(minPrice)}
          </p>
          <Link
            to="/univers/visage"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-tg-green px-7 py-3.5 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
          >
            {t.hero.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <img
            src="/brand/logo-full.png"
            alt="Tallow & Go"
            className="max-h-72 w-auto object-contain sm:max-h-96"
          />
        </div>
      </div>
    </section>
  )
}
