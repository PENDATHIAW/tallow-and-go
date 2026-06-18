import { ArrowRight } from 'lucide-react'
import { lineupImage } from '../data/products'
import { useLocale } from '../context/LocaleContext'

export default function Hero() {
  const { t } = useLocale()

  return (
    <section className="hero-cinematic relative min-h-[100svh] overflow-hidden">
      <div className="hero-media absolute inset-0">
        <img
          src={lineupImage}
          alt="Gamme Tallow & Go — SAFAA, AURA, SHINY, NOOR, SOFT KISS"
          className="hero-ken-burns absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      </div>

      <div className="hero-overlay absolute inset-0" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6 lg:pb-28">
        <p className="reveal text-xs font-semibold uppercase tracking-[0.28em] text-tg-gold">{t.hero.kicker}</p>
        <h1 className="reveal reveal-d1 mt-5 max-w-4xl font-display text-balance text-5xl font-semibold leading-[1.02] text-tg-ivory sm:text-6xl lg:text-[5.25rem]">
          {t.hero.title}
        </h1>
        <p className="reveal reveal-d2 mt-6 max-w-lg text-base leading-relaxed text-tg-ivory/80 sm:text-lg">
          {t.hero.subtitle}
        </p>

        <div className="reveal reveal-d2 mt-10 flex flex-wrap gap-3">
          <a
            href="#produits"
            className="inline-flex items-center gap-2 rounded-full bg-tg-ivory px-7 py-3.5 text-sm font-semibold tracking-wide text-tg-green transition hover:bg-white hover:shadow-[0_8px_32px_rgba(250,248,244,0.25)]"
          >
            {t.hero.cta1}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#traceabilite"
            className="inline-flex items-center rounded-full border border-tg-ivory/25 bg-tg-ivory/5 px-7 py-3.5 text-sm font-semibold tracking-wide text-tg-ivory backdrop-blur-sm transition hover:border-tg-ivory/50 hover:bg-tg-ivory/10"
          >
            {t.hero.cta2}
          </a>
        </div>

        <div className="reveal reveal-d2 mt-16 hidden items-end justify-between border-t border-tg-ivory/15 pt-6 sm:flex">
          <p className="max-w-xs text-xs leading-relaxed tracking-wide text-tg-ivory/55">{t.hero.scrollHint}</p>
          <div className="hero-scroll-indicator flex flex-col items-center gap-2" aria-hidden="true">
            <span className="h-10 w-px bg-gradient-to-b from-transparent via-tg-gold/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
