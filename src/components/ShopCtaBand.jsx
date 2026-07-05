import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'

export default function ShopCtaBand({ title, lead, primaryTo, primaryLabel, secondaryTo, secondaryLabel }) {
  const { t } = useLocale()

  return (
    <section className="border-y border-cream-dark bg-cream dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-earth dark:text-neutral-100">{title}</h2>
          <p className="mt-2 max-w-xl text-sm text-earth-soft dark:text-neutral-400">{lead}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={primaryTo}
            className="inline-flex items-center gap-2 rounded-full bg-tg-green px-6 py-3 text-sm font-semibold text-tg-ivory"
          >
            {primaryLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryTo ? (
            <Link
              to={secondaryTo}
              className="inline-flex items-center gap-2 rounded-full border border-cream-dark px-6 py-3 text-sm font-semibold text-earth-soft dark:border-neutral-700"
            >
              {secondaryLabel ?? t.quiz.homeCta}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
