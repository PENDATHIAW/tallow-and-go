import { Link } from 'react-router-dom'
import { illustrations } from '../data/illustrations'
import { universeCards } from '../data/pageContent'
import { useLocale } from '../context/LocaleContext'
import IllustrationImage from './IllustrationImage'

export default function UniverseNavCards({ compact = false }) {
  const { t } = useLocale()

  return (
    <section className={compact ? 'py-8' : 'border-b border-cream-dark bg-white-warm py-10 dark:border-neutral-800 dark:bg-neutral-950'}>
      <div className={`mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-4'}`}>
        {universeCards.map((u) => (
          <Link
            key={u.id}
            to={u.path}
            className="group overflow-hidden rounded-2xl border border-cream-dark bg-tg-ivory transition hover:border-tg-green/30 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="aspect-[4/3] overflow-hidden bg-tg-cream dark:bg-neutral-800">
              <IllustrationImage
                name={illustrations.universes[u.id]}
                alt={t.universes[u.id].title}
                fit="contain"
                className="transition duration-500 group-hover:scale-105"
                fallback={
                  <img
                    src={u.image}
                    alt=""
                    className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
                  />
                }
              />
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-earth dark:text-neutral-100">
                {t.universes[u.id].title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-earth-soft dark:text-neutral-400">
                {t.universes[u.id].desc}
              </p>
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-tg-green">
                {t.pages.explore} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
