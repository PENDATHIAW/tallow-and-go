const SESSION_KEY = 'tg-admin-session'

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'penda'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Mariemediatta10#'

export function loginAdmin(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const session = { user: username, password, at: Date.now() }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return true
  }
  return false
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    if (Date.now() - session.at > 8 * 60 * 60 * 1000) {
      logoutAdmin()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function getAdminCredentials() {
  const session = getAdminSession()
  if (!session) return null
  return { user: session.user, password: session.password }
}
