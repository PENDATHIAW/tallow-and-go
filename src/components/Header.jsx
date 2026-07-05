import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { to: '/', key: 'home', end: true },
  { to: '/univers/visage', key: 'skin' },
  { to: '/univers/corps', key: 'body' },
  { to: '/univers/essentiels', key: 'essentials' },
  { to: '/univers/nomades', key: 'nomades' },
  { to: '/routines', key: 'routines' },
  { to: '/coffrets', key: 'bundles' },
  { to: '/quiz', key: 'quiz' },
]

const navClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-tg-green dark:text-neutral-300 ${
    isActive ? 'text-tg-green' : 'text-earth-soft'
  }`

export default function Header() {
  const [open, setOpen] = useState(false)
  const { locale, switchLocale, t } = useLocale()
  const { theme, toggle } = useTheme()
  const { count, setOpen: setCartOpen } = useCart()

  return (
    <header className="sticky top-0 z-50 glass border-b border-cream-dark/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/brand/logo-monogram.png" alt="" className="h-9 w-9 rounded-full object-cover" />
          <span>
            <span className="block font-display text-lg font-semibold leading-none tracking-wide text-earth dark:text-neutral-100">
              Tallow & Go
            </span>
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.22em] text-tg-green">
              {t.header.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {t.nav[link.key]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchLocale(locale === 'fr' ? 'en' : 'fr')}
            className="hidden rounded-full border border-cream-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-earth-soft transition hover:border-tg-green hover:text-tg-green sm:inline-flex dark:border-neutral-700"
            aria-label={t.header.switchLang}
          >
            {locale === 'fr' ? 'EN' : 'FR'}
          </button>

          <button
            type="button"
            onClick={toggle}
            className="hidden rounded-full border border-cream-dark p-2 text-earth-soft sm:inline-flex dark:border-neutral-700"
            aria-label={theme === 'light' ? t.header.darkMode : t.header.lightMode}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-tg-green px-4 py-2 text-sm font-semibold text-tg-ivory transition hover:bg-tg-green-light"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t.header.cart}</span>
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-tg-gold text-[0.65rem] font-bold text-white">
                {count}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="inline-flex rounded-full border border-cream-dark p-2 text-earth lg:hidden dark:border-neutral-700"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.header.menuClose : t.header.menuOpen}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-cream-dark bg-white-warm px-4 py-4 lg:hidden dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  {t.nav[link.key]}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  switchLocale(locale === 'fr' ? 'en' : 'fr')
                  setOpen(false)
                }}
                className="text-sm font-medium text-earth-soft"
              >
                {locale === 'fr' ? 'English (EN)' : 'Français (FR)'}
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
