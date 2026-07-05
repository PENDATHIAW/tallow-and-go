import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { homeHowItWorks } from '../data/pageContent'
import { useLocale } from '../context/LocaleContext'

export default function HomeHowItWorks() {
  const { locale } = useLocale()
  const content = homeHowItWorks[locale] ?? homeHowItWorks.fr

  return (
    <section className="section-padding bg-white-warm dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{content.kicker}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100">{content.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-earth-soft dark:text-neutral-400">{content.lead}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <article
              key={step.title}
              className="relative rounded-2xl border border-cream-dark bg-tg-cream/40 p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="font-display text-4xl font-semibold text-tg-green/30">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-earth dark:text-neutral-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{step.desc}</p>
            </article>
          ))}
        </div>

        <Link
          to="/livraison"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-tg-green"
        >
          {content.cta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
