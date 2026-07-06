import { Link } from 'react-router-dom'
import OptimizedImage from './OptimizedImage'
import { formatPrice } from '../lib/format'
import { getBundlePath } from '../data/routes'
import { getBundleImage } from '../data/illustrationManifest'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'
import IllustrationImage from './IllustrationImage'

export default function BundlesSection({ compact = false }) {
  const { locale, t } = useLocale()
  const { addBundle } = useCart()
  const { catalog } = useShopConfig()
  const { bundles } = catalog

  return (
    <section id={compact ? undefined : 'bundles'} className={compact ? '' : 'section-padding scroll-mt-20'}>
      <div className="mx-auto max-w-6xl">
        {!compact ? (
          <div className="mb-10 max-w-xl px-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{t.bundles.kicker}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100 sm:text-4xl">
              {t.bundles.title}
            </h2>
          </div>
        ) : null}

        <div className={`grid gap-6 sm:grid-cols-2 ${compact ? '' : 'px-4 sm:px-6'}`}>
          {bundles.map((bundle) => (
            <article
              key={bundle.id}
              id={bundle.id}
              className="overflow-hidden rounded-2xl border border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-950"
            >
              <Link to={getBundlePath(bundle.id)} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5efe6] dark:bg-neutral-900">
                  <IllustrationImage
                    name={getBundleImage(bundle.id) ?? bundle.image}
                    alt={bundle.name}
                    fit="cover"
                    size="card"
                    wrapperClassName="h-full w-full"
                    className="transition duration-500 group-hover:scale-[1.02]"
                    fallback={
                      <OptimizedImage
                        src={bundle.image}
                        alt={bundle.name}
                        fit="cover"
                        size="card"
                        wrapperClassName="h-full w-full"
                        className="transition duration-500 group-hover:scale-[1.02]"
                      />
                    }
                  />
                </div>
              </Link>
              <div className="p-5">
                <Link to={getBundlePath(bundle.id)} className="group block">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-tg-green group-hover:underline">
                    {bundle.name}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-earth group-hover:text-tg-green dark:text-neutral-100">
                    {bundle.tagline[locale]}
                  </h3>
                </Link>
                <p className="mt-2 text-sm text-earth-soft dark:text-neutral-400">{bundle.description[locale]}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="font-display text-xl font-semibold text-earth dark:text-neutral-100">
                    {formatPrice(bundle.price)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={getBundlePath(bundle.id)}
                      className="rounded-full border border-cream-dark px-4 py-2.5 text-sm font-semibold text-earth-soft transition hover:border-tg-green hover:text-tg-green dark:border-neutral-700"
                    >
                      {t.bundles.view}
                    </Link>
                    <button
                      type="button"
                      onClick={() => addBundle(bundle.id)}
                      className="rounded-full bg-tg-green px-5 py-2.5 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
                    >
                      {t.bundles.add}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
