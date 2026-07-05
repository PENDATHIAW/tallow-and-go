import { homeIngredients } from '../data/pageContent'
import { useLocale } from '../context/LocaleContext'

export default function HomeIngredients() {
  const { locale } = useLocale()
  const content = homeIngredients[locale] ?? homeIngredients.fr

  return (
    <section className="section-padding bg-cream dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{content.kicker}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100">{content.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-earth-soft dark:text-neutral-400">{content.lead}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-cream-dark bg-white-warm p-5 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <p className="font-display text-xl font-semibold text-tg-green">{item.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
