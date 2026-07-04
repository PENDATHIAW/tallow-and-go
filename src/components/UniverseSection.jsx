import { useState } from 'react'
import { getProductsByUniverse } from '../data/catalog'
import { useLocale } from '../context/LocaleContext'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

export default function UniverseSection({ universeId }) {
  const { t } = useLocale()
  const [selected, setSelected] = useState(null)
  const items = getProductsByUniverse(universeId)

  if (items.length === 0) return null

  return (
    <section id={universeId} className="section-padding scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-green">{t.universes[universeId].title}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-earth dark:text-neutral-100 sm:text-4xl">
            {t.universes[universeId].title}
          </h2>
          <p className="mt-2 text-sm text-earth-soft dark:text-neutral-400">{t.universes[universeId].desc}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {selected ? <ProductModal product={selected} onClose={() => setSelected(null)} /> : null}
    </section>
  )
}
