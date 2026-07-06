import IllustrationImage from './IllustrationImage'
import { illustrations } from '../data/illustrations'

export default function HomeStory({ title, lead, points }) {
  return (
    <section className="section-padding-compact overflow-hidden bg-cream dark:bg-neutral-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">Notre histoire</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-earth-soft dark:text-neutral-400">{lead}</p>
          <ul className="mt-6 space-y-3">
            {points?.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-earth-soft dark:text-neutral-300">
                <span className="mt-0.5 text-tg-gold">◆</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 overflow-hidden rounded-3xl border border-cream-dark bg-cream dark:border-neutral-800 dark:bg-neutral-950 lg:order-2">
          <IllustrationImage
            name={illustrations.pages.routines}
            alt={title}
            fit="cover"
            size="full"
            className="aspect-[4/3] w-full"
            wrapperClassName="aspect-[4/3] w-full"
          />
        </div>
      </div>
    </section>
  )
}
