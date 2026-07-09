import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketsApi } from '../api/tickets'
import { useAuth } from '../context/AuthContext'

const PRIORIDADES = ['baixa', 'media', 'alta', 'critica']

export default function NewTicket() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ titulo: '', descricao: '', categoria: '', prioridade: 'media' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await ticketsApi.create(form, session.token)
      navigate('/')
    } catch (err) {
      setError(err?.data?.[0] || err?.data?.error || 'Não foi possível criar o ticket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display font-bold text-2xl mb-1">Abrir novo ticket</h1>
      <p className="text-desk-paper2/60 text-sm mb-6">Descreve o problema com o máximo de detalhe possível.</p>

      <form onSubmit={handleSubmit} className="stub p-6 space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
            Título
          </label>
          <input
            value={form.titulo}
            onChange={update('titulo')}
            required
            className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm"
            placeholder="ex: Não consigo aceder ao email"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
            Descrição
          </label>
          <textarea
            value={form.descricao}
            onChange={update('descricao')}
            required
            rows={5}
            className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm resize-none"
            placeholder="Explica o que aconteceu, quando começou e o que já tentaste."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
              Categoria
            </label>
            <input
              value={form.categoria}
              onChange={update('categoria')}
              required
              className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm"
              placeholder="ex: Rede, Software…"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-desk-paper2/60 mb-1.5">
              Prioridade
            </label>
            <select
              value={form.prioridade}
              onChange={update('prioridade')}
              className="focus-ring w-full bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm font-mono"
            >
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-alert-critica text-sm font-mono">{String(error)}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="focus-ring bg-amber-stamp text-desk-ink font-display font-semibold px-5 py-2.5 rounded-sm hover:bg-amber-stamp/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'A criar…' : 'Criar ticket'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="focus-ring px-5 py-2.5 rounded-sm text-sm text-desk-paper2/70 hover:text-desk-paper transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
