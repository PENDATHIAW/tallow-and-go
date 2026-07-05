import { universes } from '../data/catalog'
import { useLocale } from '../context/LocaleContext'

export default function UniverseNav() {
  const { t } = useLocale()

  return (
    <section className="border-b border-cream-dark bg-white-warm py-10 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        {universes.map((u) => (
          <a
            key={u.id}
            href={`#${u.id}`}
            className="group overflow-hidden rounded-2xl border border-cream-dark bg-tg-ivory transition hover:border-tg-green/30 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="aspect-[4/3] overflow-hidden bg-tg-cream dark:bg-neutral-800">
              <img
                src={u.image}
                alt=""
                className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-earth dark:text-neutral-100">
                {t.universes[u.id].title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-earth-soft dark:text-neutral-400">
                {t.universes[u.id].desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
