import { trustPillars } from '../data/pageContent'
import { useLocale } from '../context/LocaleContext'

export default function TrustBar() {
  const { locale } = useLocale()
  const pillars = trustPillars[locale] ?? trustPillars.fr

  return (
    <section className="border-y border-cream-dark bg-white-warm py-10 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {pillars.map((p) => (
          <div key={p.title} className="text-center lg:text-left">
            <h3 className="font-display text-base font-semibold text-earth dark:text-neutral-100">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
