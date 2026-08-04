import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getEdenSession, isEdenAdmin, logoutEden, onEdenAuthChange } from '../../lib/eden'

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll']

export default function EdenProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')
  const timerRef = useRef(null)

  useEffect(() => {
    let active = true

    const evaluate = async (session) => {
      if (!session) {
        if (active) setStatus('denied')
        return
      }
      const admin = await isEdenAdmin()
      if (!active) return
      if (!admin) {
        await logoutEden()
        if (active) setStatus('denied')
        return
      }
      setStatus('authorized')
    }

    getEdenSession().then(evaluate)
    const unsubscribe = onEdenAuthChange(evaluate)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (status !== 'authorized') return undefined

    const resetTimer = () => {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(async () => {
        await logoutEden()
        setStatus('denied')
      }, INACTIVITY_LIMIT_MS)
    }

    resetTimer()
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }))
    return () => {
      window.clearTimeout(timerRef.current)
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [status])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-sm text-[#7A7168]">
        Ouverture d’EDEN…
      </div>
    )
  }

  if (status === 'denied') return <Navigate to="/eden-admin" replace />
  return children
}
