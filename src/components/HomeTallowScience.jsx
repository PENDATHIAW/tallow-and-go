import { homeTallowScience } from '../data/pageContent'
import IllustrationImage from './IllustrationImage'
import { illustrations } from '../data/illustrations'
import { useLocale } from '../context/LocaleContext'

export default function HomeTallowScience() {
  const { locale } = useLocale()
  const content = homeTallowScience[locale] ?? homeTallowScience.fr

  return (
    <section className="section-padding-compact bg-white-warm dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-3xl">
          <IllustrationImage
            name={illustrations.pages.homeWhy}
            alt={content.title}
            fit="cover"
            size="full"
            className="aspect-[4/5] w-full"
            wrapperClassName="aspect-[4/5] w-full"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{content.kicker}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100">{content.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-earth-soft dark:text-neutral-400">{content.lead}</p>
          <ul className="mt-6 space-y-4">
            {content.points.map((point) => (
              <li key={point.title} className="rounded-xl border border-cream-dark bg-cream/40 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="font-semibold text-earth dark:text-neutral-100">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{point.desc}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-medium text-tg-green">{content.trustLine}</p>
        </div>
      </div>
    </section>
  )
}
