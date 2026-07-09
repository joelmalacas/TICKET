import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'

export default function Register() {
  const [role, setRole] = useState('USER')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const minLength = role === 'ADMIN' ? 8 : 5

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password.length < minLength) {
      setError(`A palavra-passe precisa de pelo menos ${minLength} caracteres.`)
      return
    }

    setLoading(true)
    try {
      if (role === 'ADMIN') await authApi.registerAdmin(username, email, password)
      else await authApi.registerUser(username, email, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err?.data?.error || 'Não foi possível criar a conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-accent mb-3" />
          <h1 className="font-display font-bold text-2xl">Criar conta</h1>
          <p className="text-desk-paper2/60 text-sm mt-1 font-mono">Regista o teu acesso ao balcão</p>
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
                Nome de utilizador
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm text-desk-paper placeholder:text-desk-paper2/30"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm text-desk-paper placeholder:text-desk-paper2/30"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
                Palavra-passe (mín. {minLength} caracteres)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm text-desk-paper placeholder:text-desk-paper2/30"
              />
            </div>

            {error && <p className="text-alert-critica text-sm font-mono">{error}</p>}
            {success && <p className="text-teal-accent text-sm font-mono">Conta criada. A redirecionar…</p>}

            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full bg-teal-accent text-desk-ink font-display font-semibold py-2.5 rounded-sm hover:bg-teal-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'A criar…' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-desk-paper2/60 mt-5">
          Já tens conta?{' '}
          <Link to="/login" className="text-amber-stamp hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
