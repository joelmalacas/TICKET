import { useEffect, useState } from 'react'
import { authApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { session } = useAuth()
  const [info, setInfo] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    authApi
      .info(session.role, session.token)
      .then((res) => {
        const data = res?.success?.[0] || res?.success
        setInfo(data)
        setForm((f) => ({ ...f, username: data?.username || '', email: data?.email || '' }))
      })
      .catch(() => setError('Não foi possível carregar o perfil.'))
  }, [session])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)
    try {
      await authApi.update(session.role, session.token, form)
      setSuccess(true)
    } catch (err) {
      setError('Não foi possível atualizar os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display font-bold text-2xl mb-1">O teu perfil</h1>
      <p className="text-desk-paper2/60 text-sm mb-6 font-mono uppercase">
        {session.role === 'ADMIN' ? 'Conta de administrador' : 'Conta de utilizador'}
      </p>

      {info?.created_at && (
        <p className="text-xs font-mono text-desk-paper2/40 mb-4">Membro desde {info.created_at}</p>
      )}

      <form onSubmit={handleSubmit} className="stub p-6 space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
            Nome de utilizador
          </label>
          <input
            value={form.username}
            onChange={update('username')}
            className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
            Nova palavra-passe
          </label>
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="Deixa em branco para manter a atual"
            className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-alert-critica text-sm font-mono">{error}</p>}
        {success && <p className="text-teal-accent text-sm font-mono">Dados atualizados.</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring bg-amber-stamp text-desk-ink font-display font-semibold px-5 py-2.5 rounded-sm hover:bg-amber-stamp/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'A guardar…' : 'Guardar alterações'}
        </button>
      </form>
    </div>
  )
}
