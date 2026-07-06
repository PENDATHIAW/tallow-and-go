import { Droplets, Leaf, Sparkles, Truck } from 'lucide-react'
import { trustPillars } from '../data/pageContent'
import { useLocale } from '../context/LocaleContext'

const icons = [Leaf, Sparkles, Droplets, Truck]

export default function TrustBar() {
  const { locale } = useLocale()
  const pillars = trustPillars[locale] ?? trustPillars.fr

  return (
    <section className="border-y border-cream-dark bg-white-warm py-8 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {pillars.map((p, index) => {
          const Icon = icons[index] ?? Leaf
          return (
            <div key={p.title} className="flex gap-4 lg:block lg:text-left">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tg-green/10 text-tg-green">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-earth dark:text-neutral-100">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{p.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
