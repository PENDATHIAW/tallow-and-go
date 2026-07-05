import { Link } from 'react-router-dom'
import { openSupportWhatsApp } from '../lib/whatsapp'
import { useLocale } from '../context/LocaleContext'

export default function Footer() {
  const { locale, t } = useLocale()

  return (
    <footer className="border-t border-cream-dark bg-earth px-4 py-12 text-tg-ivory sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/brand/logo-monogram.png" alt="" className="h-10 w-10 rounded-full" />
            <p className="mt-3 font-display text-lg font-semibold">{t.footer.tagline}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-tg-ivory/60">{t.footer.made}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-tg-ivory/60">{t.footer.shop}</p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/univers/visage" className="text-sm text-tg-ivory/80 hover:text-white">{t.nav.skin}</Link>
              <Link to="/univers/corps" className="text-sm text-tg-ivory/80 hover:text-white">{t.nav.body}</Link>
              <Link to="/routines" className="text-sm text-tg-ivory/80 hover:text-white">{t.nav.routines}</Link>
              <Link to="/coffrets" className="text-sm text-tg-ivory/80 hover:text-white">{t.nav.bundles}</Link>
              <Link to="/quiz" className="text-sm text-tg-ivory/80 hover:text-white">{t.quiz.kicker}</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-tg-ivory/60">{t.footer.help}</p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/faq" className="text-sm text-tg-ivory/80 hover:text-white">{t.footer.faq}</Link>
              <Link to="/livraison" className="text-sm text-tg-ivory/80 hover:text-white">{t.footer.delivery}</Link>
              <button
                type="button"
                onClick={() => openSupportWhatsApp(locale)}
                className="text-left text-sm text-tg-ivory/80 hover:text-white"
              >
                {t.whatsapp.label}
              </button>
              <a href={`mailto:${t.footer.contact}`} className="text-sm text-tg-ivory/80 hover:text-white">{t.footer.contact}</a>
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-tg-ivory/60">{t.footer.legal}</p>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/cgv" className="text-sm text-tg-ivory/80 hover:text-white">{t.footer.terms}</Link>
              <Link to="/retours" className="text-sm text-tg-ivory/80 hover:text-white">{t.footer.returns}</Link>
              <Link to="/confidentialite" className="text-sm text-tg-ivory/80 hover:text-white">{t.footer.privacy}</Link>
            </nav>
          </div>
        </div>

        <p className="mt-10 border-t border-tg-ivory/10 pt-6 text-center text-xs text-tg-ivory/50">
          © {new Date().getFullYear()} Tallow & Go · {t.footer.made}
        </p>
      </div>
    </footer>
  )
}
