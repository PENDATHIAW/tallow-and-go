import { Link } from 'react-router-dom'
import OptimizedImage from './OptimizedImage'
import { formatPrice } from '../lib/format'
import { getProductPath } from '../data/routes'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'

export default function RoutinesSection({ compact = false }) {
  const { locale, t } = useLocale()
  const { addRoutine } = useCart()
  const { catalog } = useShopConfig()
  const { routines, getRoutineProducts } = catalog
  const list = compact ? routines.slice(0, 3) : routines

  return (
    <section id={compact ? undefined : 'routines'} className={`${compact ? '' : 'section-padding scroll-mt-20'} bg-cream dark:bg-neutral-900`}>
      <div className="mx-auto max-w-6xl">
        {!compact ? (
          <div className="mb-10 max-w-xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{t.routines.kicker}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100 sm:text-4xl">
              {t.routines.title}
            </h2>
          </div>
        ) : null}

        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${compact ? '' : 'px-4 sm:px-6'}`}>
          {list.map((routine) => {
            const prods = getRoutineProducts(routine.id)
            const total = prods.reduce((s, p) => s + p.price, 0)
            const info = t.routines.items[routine.id]
            const cover = prods[0]

            return (
              <article
                key={routine.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-950"
              >
                {cover ? (
                  <Link to={getProductPath(cover.id)} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#f5efe6] dark:bg-neutral-900">
                      <OptimizedImage
                        src={cover.image}
                        alt={cover.name}
                        fit="cover"
                        size="card"
                        wrapperClassName="h-full w-full"
                        className="transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-earth/50 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-display text-xl font-semibold text-white">{info.title}</h3>
                        <p className="mt-0.5 text-sm text-white/85">{info.desc}</p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="border-b border-cream-dark p-5 dark:border-neutral-800">
                    <h3 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">{info.title}</h3>
                    <p className="mt-1 text-sm text-earth-soft dark:text-neutral-400">{info.desc}</p>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <ol className="flex-1 space-y-2">
                    {prods.map((p, i) => (
                      <li key={p.id} className="flex items-center gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tg-green/10 text-xs font-bold text-tg-green">
                          {i + 1}
                        </span>
                        <Link to={getProductPath(p.id)} className="text-earth-soft hover:text-tg-green dark:text-neutral-300">
                          <span className="font-semibold text-earth dark:text-neutral-100">{p.name}</span>
                          {' — '}
                          {p.tagline[locale]}
                        </Link>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-cream-dark pt-4 dark:border-neutral-800">
                    <span className="text-sm font-semibold text-earth dark:text-neutral-100">{formatPrice(total)}</span>
                    <button
                      type="button"
                      onClick={() => addRoutine(routine.productIds)}
                      className="rounded-full bg-tg-green px-4 py-2 text-xs font-semibold text-tg-ivory transition hover:bg-tg-green-light"
                    >
                      {t.routines.addAll}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
