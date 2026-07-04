import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ProductCarousel from '../../components/admin/ProductCarousel'
import { loginAdmin, getAdminSession } from '../../lib/admin'
import { useLocale } from '../../context/LocaleContext'

export default function AdminLogin() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (getAdminSession()) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (loginAdmin(username.trim(), password)) {
      navigate('/admin/dashboard')
    } else {
      setError(t.admin.loginError)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-earth px-4 py-12">
      <div className="w-full max-w-md text-center">
        <img src="/brand/logo-full.png" alt="Tallow & Go" className="mx-auto max-h-32 object-contain" />
        <h1 className="mt-6 font-display text-2xl font-semibold text-tg-ivory">{t.admin.loginTitle}</h1>
        <p className="mt-2 text-sm text-tg-ivory/70">{t.admin.loginSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-tg-ivory/80">{t.admin.username}</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-tg-ivory outline-none focus:border-tg-gold"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-tg-ivory/80">{t.admin.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-tg-ivory outline-none focus:border-tg-gold"
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-full bg-tg-gold py-3.5 text-sm font-semibold text-earth transition hover:bg-white"
          >
            {t.admin.loginButton}
          </button>
        </form>

        <ProductCarousel />
      </div>
    </div>
  )
}
