import { Link, NavLink, Navigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Package, PenLine, Store } from 'lucide-react'
import { getAdminCredentials, logoutAdmin } from '../../lib/admin'
import { useLocale } from '../../context/LocaleContext'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, labelKey: 'navOrders' },
  { to: '/admin/products', icon: Package, labelKey: 'navProducts' },
  { to: '/admin/content', icon: PenLine, labelKey: 'navContent' },
]

export default function AdminLayout({ title, children }) {
  const { t } = useLocale()
  const credentials = getAdminCredentials()

  if (!credentials) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-tg-cream dark:bg-neutral-950 lg:flex">
      <aside className="border-b border-cream-dark bg-white-warm dark:border-neutral-800 dark:bg-neutral-900 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <img src="/brand/logo-monogram.png" alt="" className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-display text-lg font-semibold text-earth dark:text-neutral-100">Tallow & Go</p>
            <p className="text-xs text-earth-soft">{t.admin.loginSubtitle}</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4 lg:pb-6">
          {navItems.map(({ to, icon: Icon, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-tg-green text-tg-ivory'
                    : 'text-earth-soft hover:bg-cream dark:hover:bg-neutral-800'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {t.admin[labelKey]}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-cream-dark px-4 py-4 dark:border-neutral-800 lg:block">
          <Link
            to="/"
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-earth-soft hover:bg-cream dark:hover:bg-neutral-800"
          >
            <Store className="h-4 w-4" />
            {t.admin.backShop}
          </Link>
          <button
            type="button"
            onClick={() => {
              logoutAdmin()
              window.location.href = '/admin'
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-earth-soft hover:bg-cream dark:hover:bg-neutral-800"
          >
            <LogOut className="h-4 w-4" />
            {t.admin.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-cream-dark bg-white-warm px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 lg:px-8">
          <h1 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">{title}</h1>
          <div className="flex gap-2 lg:hidden">
            <Link to="/" className="rounded-full border border-cream-dark px-3 py-2 text-xs dark:border-neutral-700">
              {t.admin.backShop}
            </Link>
            <button
              type="button"
              onClick={() => {
                logoutAdmin()
                window.location.href = '/admin'
              }}
              className="rounded-full border border-cream-dark px-3 py-2 text-xs dark:border-neutral-700"
            >
              {t.admin.logout}
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
