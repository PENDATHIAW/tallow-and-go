import { useLocale } from '../context/LocaleContext'

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-cream-dark bg-earth px-4 py-12 text-tg-ivory sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <img src="/brand/logo-monogram.png" alt="" className="mx-auto h-10 w-10 rounded-full sm:mx-0" />
          <p className="mt-3 font-display text-lg font-semibold">{t.footer.tagline}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-tg-ivory/60">{t.footer.made}</p>
        </div>
        <a href={`mailto:${t.footer.contact}`} className="text-sm text-tg-ivory/80 transition hover:text-white">
          {t.footer.contact}
        </a>
      </div>
    </footer>
  )
}
