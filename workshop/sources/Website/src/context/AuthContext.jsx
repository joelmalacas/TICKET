import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

const STORAGE_KEY = 'ticketdesk.session'

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession())

  const persist = (data) => {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    else localStorage.removeItem(STORAGE_KEY)
    setSession(data)
  }

  const login = useCallback(async (role, username, password) => {
    const res =
      role === 'ADMIN'
        ? await authApi.loginAdmin(username, password)
        : await authApi.loginUser(username, password)

    const data = {
      token: res.Token,
      role,
      user: res.User,
    }
    persist(data)
    return data
  }, [])

  const logout = useCallback(async () => {
    if (session) {
      try {
        await authApi.logout(session.role, session.token)
      } catch {
        // mesmo que falhe no servidor, limpamos a sessão local
      }
    }
    persist(null)
  }, [session])

  const value = {
    session,
    isAuthenticated: !!session?.token,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
