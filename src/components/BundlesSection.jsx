import { getBundleImage } from '../data/illustrationManifest'
import { formatPrice } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useShopConfig } from '../context/ShopConfigContext'
import IllustrationImage from './IllustrationImage'
import OptimizedImage from './OptimizedImage'

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
              className="overflow-hidden rounded-2xl border border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f5efe6] dark:bg-neutral-900">
                <IllustrationImage
                  name={getBundleImage(bundle.id) ?? bundle.image}
                  alt={bundle.name}
                  fit="cover"
                  size="card"
                  wrapperClassName="h-full w-full"
                  fallback={
                    <OptimizedImage
                      src={bundle.image}
                      alt={bundle.name}
                      fit="cover"
                      size="card"
                      wrapperClassName="h-full w-full"
                    />
                  }
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-tg-green">{bundle.name}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-earth dark:text-neutral-100">
                  {bundle.tagline[locale]}
                </h3>
                <p className="mt-2 text-sm text-earth-soft dark:text-neutral-400">{bundle.description[locale]}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="font-display text-xl font-semibold text-earth dark:text-neutral-100">
                    {formatPrice(bundle.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addBundle(bundle.id)}
                    className="rounded-full bg-tg-green px-5 py-2.5 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
                  >
                    {t.bundles.add}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
