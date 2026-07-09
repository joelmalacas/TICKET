import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { session, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkCls = ({ isActive }) =>
    `px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
      isActive ? 'text-amber-stamp' : 'text-desk-paper2/80 hover:text-desk-paper'
    }`

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-desk-line/70 bg-desk-panel/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-stamp" />
            <span className="font-display font-bold tracking-tight text-lg">Balcão de Tickets</span>
          </Link>

          {isAuthenticated && (
            <nav className="flex items-center gap-1">
              <NavLink to="/" end className={linkCls}>Dashboard</NavLink>
              {session?.role === 'USER' && (
                <NavLink to="/tickets/novo" className={linkCls}>Novo ticket</NavLink>
              )}
              <NavLink to="/perfil" className={linkCls}>Perfil</NavLink>
              <span className="mx-2 h-4 w-px bg-desk-line" />
              <span className="font-mono text-xs text-desk-paper2/60 uppercase mr-2">
                {session?.role === 'ADMIN' ? 'Admin' : 'Utilizador'} · {session?.user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="focus-ring px-3 py-1.5 rounded-sm text-sm font-medium text-alert-critica/90 hover:text-alert-critica border border-transparent hover:border-alert-critica/40 transition-colors"
              >
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">{children}</main>

      <footer className="border-t border-desk-line/60 py-5 text-center text-xs font-mono text-desk-paper2/40">
        Balcão de Tickets — gestão interna de suporte
      </footer>
    </div>
  )
}
