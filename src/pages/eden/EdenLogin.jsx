import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getEdenSession, loginEden } from '../../lib/eden'

function EdenMark() {
  return (
    <svg width="48" height="64" viewBox="0 0 34 46" fill="none" aria-hidden="true">
      <path d="M17 3c6 7 4 11 0 16s-6 8-1 13" stroke="#B8863F" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M22 10c3 6 1 9-2 13s-3 6 0 9" stroke="#B8863F" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
      <path d="M10 38c0-3 3-4 5-2s4 3 6 1 3-4 1-5" stroke="#B8863F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function EdenLogin() {
  const navigate = useNavigate()
  const [knownSession, setKnownSession] = useState(undefined)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getEdenSession().then(setKnownSession)
  }, [])

  if (knownSession) return <Navigate to="/eden-admin/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await loginEden(email.trim(), password)
    setLoading(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/eden-admin/dashboard', { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-12 text-[#2E2A26]">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center">
        <div className="text-center">
          <div className="mx-auto flex justify-center"><EdenMark /></div>
          <div className="mt-2 text-3xl tracking-[0.42em]">EDEN</div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#A69C91]">Gestion privée · 7 Odyssées · 21 senteurs</p>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-5 border border-[#E5DED4] bg-white p-6 shadow-[0_16px_50px_rgba(46,42,38,0.06)]">
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#7A7168]">Email administratrice</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full border border-[#E5DED4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B8863F]"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#7A7168]">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full border border-[#E5DED4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B8863F]"
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E2A26] px-4 py-4 text-xs uppercase tracking-[0.25em] text-[#FAF7F2] transition hover:bg-[#B8863F] disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Entrer dans EDEN'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-[#A69C91]">
          Cet espace utilise Supabase Auth. Les recettes, clientes, ventes et marges ne sont jamais intégrées au code public.
        </p>
      </div>
    </main>
  )
}
