import { Droplets, Factory, Leaf, Sparkles } from 'lucide-react'
import { lineupImage, traceKeys } from '../data/products'
import { useLocale } from '../context/LocaleContext'

const icons = {
  farm: Leaf,
  process: Factory,
  tallow: Droplets,
  skin: Sparkles,
}

export default function Traceability() {
  const { t } = useLocale()

  return (
    <section id="traceabilite" className="relative overflow-hidden bg-tg-green text-tg-ivory">
      <img
        src={lineupImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07] mix-blend-luminosity"
      />
      <div className="section-padding relative">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-tg-gold">{t.trace.kicker}</p>
            <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{t.trace.title}</h2>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-tg-ivory/65">{t.trace.subtitle}</p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {traceKeys.map((key, index) => {
              const Icon = icons[key]
              const item = t.trace[key]
              return (
                <article
                  key={key}
                  className="reveal group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:border-tg-gold/30 hover:bg-white/[0.07]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-tg-gold/40 bg-tg-gold/10 transition group-hover:border-tg-gold/60 group-hover:bg-tg-gold/15">
                    <Icon className="h-5 w-5 text-tg-gold" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-display text-2xl font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-tg-ivory/75">{item.desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
