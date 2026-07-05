import { homeFounderQuote } from '../data/pageContent'
import { useLocale } from '../context/LocaleContext'

export default function HomeFounderQuote() {
  const { locale } = useLocale()
  const content = homeFounderQuote[locale] ?? homeFounderQuote.fr

  return (
    <section className="relative overflow-hidden bg-tg-green px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-tg-gold/20 blur-3xl" />
      <blockquote className="relative mx-auto max-w-3xl text-center">
        <p className="font-display text-2xl font-medium leading-relaxed text-tg-ivory sm:text-3xl">
          &ldquo;{content.quote}&rdquo;
        </p>
        <footer className="mt-6">
          <p className="text-sm font-semibold text-tg-gold">{content.name}</p>
          <p className="text-xs text-tg-ivory/70">{content.role}</p>
        </footer>
      </blockquote>
    </section>
  )
}
