import { Link } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'

const footerLinks = [
  { to: '/univers/visage', key: 'skin' },
  { to: '/univers/corps', key: 'body' },
  { to: '/routines', key: 'routines' },
  { to: '/coffrets', key: 'bundles' },
]

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-cream-dark bg-earth px-4 py-12 text-tg-ivory sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <img src="/brand/logo-monogram.png" alt="" className="mx-auto h-10 w-10 rounded-full sm:mx-0" />
            <p className="mt-3 font-display text-lg font-semibold">{t.footer.tagline}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-tg-ivory/60">{t.footer.made}</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 sm:justify-end">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-tg-ivory/80 transition hover:text-white">
                {t.nav[link.key]}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-tg-ivory/10 pt-6 text-center sm:text-left">
          <a href={`mailto:${t.footer.contact}`} className="text-sm text-tg-ivory/80 transition hover:text-white">
            {t.footer.contact}
          </a>
        </div>
      </div>
    </footer>
  )
}
