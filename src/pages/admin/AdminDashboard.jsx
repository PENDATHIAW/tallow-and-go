import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { formatPrice } from '../../lib/format'
import { getAdminCredentials, logoutAdmin } from '../../lib/admin'
import { computeStats, fetchAdminOrders, updateOrderStatus } from '../../lib/orders'
import { useLocale } from '../../context/LocaleContext'

export default function AdminDashboard() {
  const { t, locale } = useLocale()
  const credentials = getAdminCredentials()
  const [orders, setOrders] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  if (!credentials) {
    return <Navigate to="/admin" replace />
  }

  useEffect(() => {
    let active = true
    fetchAdminOrders(credentials).then((res) => {
      if (!active) return
      if (res.ok) {
        setOrders(res.orders)
        setItems(res.items)
      } else {
        setError(res.message ?? t.admin.dbError)
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = computeStats(orders, items)

  const refresh = async () => {
    setLoading(true)
    const res = await fetchAdminOrders(credentials)
    if (res.ok) {
      setOrders(res.orders)
      setItems(res.items)
      setError('')
    }
    setLoading(false)
  }

  const handleStatus = async (orderId, status) => {
    await updateOrderStatus(credentials, orderId, status)
    refresh()
  }

  return (
    <div className="min-h-screen bg-tg-cream dark:bg-neutral-950">
      <header className="border-b border-cream-dark bg-white-warm px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/brand/logo-monogram.png" alt="" className="h-10 w-10 rounded-full" />
            <div>
              <h1 className="font-display text-xl font-semibold text-earth dark:text-neutral-100">{t.admin.dashboard}</h1>
              <p className="text-xs text-earth-soft">{t.admin.welcome}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={refresh} className="rounded-full border border-cream-dark px-4 py-2 text-sm dark:border-neutral-700">
              {t.admin.refresh}
            </button>
            <button
              type="button"
              onClick={() => {
                logoutAdmin()
                window.location.href = '/admin'
              }}
              className="rounded-full bg-earth px-4 py-2 text-sm text-tg-ivory"
            >
              {t.admin.logout}
            </button>
            <Link to="/" className="rounded-full border border-cream-dark px-4 py-2 text-sm dark:border-neutral-700">
              {t.admin.backShop}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {error ? <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label={t.admin.totalSales} value={formatPrice(stats.totalRevenue)} />
          <StatCard label={t.admin.orderCount} value={String(stats.orderCount)} />
          <StatCard label={t.admin.pending} value={String(orders.filter((o) => o.status === 'pending').length)} />
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold text-earth dark:text-neutral-100">{t.admin.orders}</h2>
            {loading ? (
              <p className="mt-4 text-sm text-earth-soft">{t.admin.loading}</p>
            ) : orders.length === 0 ? (
              <p className="mt-4 text-sm text-earth-soft">{t.admin.noOrders}</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-2xl border border-cream-dark bg-white-warm p-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-earth dark:text-neutral-100">{order.order_number}</p>
                        <p className="text-sm text-earth-soft">
                          {order.customer_name} · {order.customer_phone}
                        </p>
                        <p className="text-xs text-earth-soft/80">
                          {order.locality_label} · {order.payment_method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-semibold">{formatPrice(order.total)}</p>
                        <p className="text-xs capitalize text-tg-green">{order.status}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatus(order.id, status)}
                          className="rounded-full border border-cream-dark px-3 py-1 text-xs dark:border-neutral-700"
                        >
                          {t.admin.status[status]}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-earth dark:text-neutral-100">{t.admin.topProducts}</h2>
            <ul className="mt-4 space-y-2">
              {stats.topProducts.map((p) => (
                <li
                  key={p.name}
                  className="flex justify-between rounded-xl border border-cream-dark bg-white-warm px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <span>{p.name}</span>
                  <span className="font-semibold">{p.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-cream-dark bg-white-warm p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-earth-soft">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-earth dark:text-neutral-100">{value}</p>
    </div>
  )
}
