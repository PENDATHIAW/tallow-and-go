import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getEdenSession, onEdenAuthChange } from '../../lib/eden'

export default function EdenProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    let active = true
    getEdenSession().then((value) => {
      if (active) setSession(value)
    })
    const unsubscribe = onEdenAuthChange((value) => setSession(value))
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-sm text-[#7A7168]">
        Ouverture d’EDEN…
      </div>
    )
  }

  if (!session) return <Navigate to="/eden-admin" replace />
  return children
}
