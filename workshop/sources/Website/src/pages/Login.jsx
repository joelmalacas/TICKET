import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [role, setRole] = useState('USER')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(role, username, password)
      navigate('/')
    } catch (err) {
      setError(err?.data?.error || 'Credenciais inválidas. Verifica os dados e tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-stamp mb-3" />
          <h1 className="font-display font-bold text-2xl">Balcão de Tickets</h1>
          <p className="text-desk-paper2/60 text-sm mt-1 font-mono">Levanta o teu bilhete de acesso</p>
        </div>

        <div className="stub p-6">
          <div className="flex mb-6 border border-desk-line rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setRole('USER')}
              className={`flex-1 py-2 text-sm font-mono uppercase tracking-wide transition-colors ${
                role === 'USER' ? 'bg-teal-accent/20 text-desk-paper' : 'text-desk-paper2/60'
              }`}
            >
              Utilizador
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`flex-1 py-2 text-sm font-mono uppercase tracking-wide transition-colors ${
                role === 'ADMIN' ? 'bg-amber-stamp/20 text-desk-paper' : 'text-desk-paper2/60'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
                Utilizador ou email
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm text-desk-paper placeholder:text-desk-paper2/30"
                placeholder="ex: joao.silva"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
                Palavra-passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm text-desk-paper placeholder:text-desk-paper2/30"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-alert-critica text-sm font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full bg-amber-stamp text-desk-ink font-display font-semibold py-2.5 rounded-sm hover:bg-amber-stamp/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'A validar…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-desk-paper2/60 mt-5">
          Ainda não tens conta?{' '}
          <Link to="/registo" className="text-teal-accent hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
