import { products } from '../data/products'
import { useLocale } from '../context/LocaleContext'

export default function Products() {
  const { locale, t } = useLocale()

  return (
    <section id="produits" className="section-padding bg-cream dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{t.products.kicker}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-earth dark:text-neutral-100 sm:text-5xl">
            {t.products.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-earth-soft dark:text-neutral-400">{t.products.subtitle}</p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="product-card group flex flex-col overflow-hidden rounded-[1.25rem] border border-cream-dark/80 bg-white-warm transition duration-500 hover:-translate-y-1.5 hover:border-tg-green/20 hover:shadow-[0_32px_64px_rgba(35,74,52,0.14)] dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-tg-gold/20"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="relative aspect-square overflow-hidden bg-[#f0e8dc] dark:bg-neutral-900">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="product-shine pointer-events-none absolute inset-0" />
                {product.featured ? (
                  <span className="absolute left-3 top-3 rounded-full bg-tg-green px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-tg-ivory">
                    {t.products.bestSeller}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-tg-green">{product.name}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-earth dark:text-neutral-100">
                      {product.tagline[locale]}
                    </h3>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-earth-soft dark:text-neutral-500">{product.size}</span>
                </div>

                <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-wider text-tallow-deep dark:text-tg-gold/80">
                  {locale === 'fr' ? product.packaging : product.packagingEn}
                </p>

                <div className="mt-4 space-y-3 border-t border-cream-dark/60 pt-4 dark:border-neutral-800">
                  <div>
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-earth/60 dark:text-neutral-500">
                      {t.products.composition}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-earth-soft dark:text-neutral-400">
                      {product.composition.join(' · ')}
                    </p>
                  </div>
                  <ul className="space-y-1">
                    {product.benefits[locale].map((benefit) => (
                      <li key={benefit} className="text-xs text-earth-soft dark:text-neutral-400">
                        — {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    className="w-full rounded-full border border-tg-green/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-tg-green transition group-hover:border-tg-green group-hover:bg-tg-green group-hover:text-tg-ivory dark:border-tg-gold/30 dark:text-tg-gold dark:group-hover:border-tg-gold dark:group-hover:bg-tg-gold dark:group-hover:text-neutral-950"
                  >
                    {t.products.shop}
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
