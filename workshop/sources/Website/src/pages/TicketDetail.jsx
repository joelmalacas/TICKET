import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketsApi } from '../api/tickets'
import { respostasApi } from '../api/respostas'
import { useAuth } from '../context/AuthContext'
import StatusStamp from '../components/StatusStamp'
import PriorityTag from '../components/PriorityTag'
import Spinner from '../components/Spinner'

const ESTADOS = ['aberto', 'em analise', 'aguardar resposta', 'resolvido', 'cancelado']

function unwrap(res, isArrayOfObjects = false) {
  if (!res) return null
  if (Array.isArray(res)) {
    return res.find((v) => (isArrayOfObjects ? Array.isArray(v) : typeof v === 'object')) ?? null
  }
  if (typeof res === 'object' && res.RESPOSTA) return res.RESPOSTA
  return res
}

export default function TicketDetail() {
  const { id } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [respostas, setRespostas] = useState([])
  const [error, setError] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [atualizandoEstado, setAtualizandoEstado] = useState(false)

  const carregar = useCallback(() => {
    ticketsApi
      .get(id, session.token)
      .then((res) => setTicket(unwrap(res)))
      .catch((err) => setError(err?.data?.[0] || 'Ticket não encontrado.'))

    respostasApi
      .list(id, session.token)
      .then((res) => setRespostas(unwrap(res, true) || []))
      .catch(() => setRespostas([]))
  }, [id, session.token])

  useEffect(() => {
    carregar()
  }, [carregar])

  const handleEstado = async (novoEstado) => {
    setAtualizandoEstado(true)
    try {
      await ticketsApi.updateEstado(id, novoEstado, session.token)
      setTicket((t) => ({ ...t, estado: novoEstado }))
    } catch (err) {
      setError('Não foi possível atualizar o estado.')
    } finally {
      setAtualizandoEstado(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Eliminar este ticket definitivamente?')) return
    try {
      await ticketsApi.remove(id, session.token)
      navigate('/')
    } catch {
      setError('Não foi possível eliminar o ticket.')
    }
  }

  const handleResposta = async (e) => {
    e.preventDefault()
    if (!mensagem.trim()) return
    setEnviando(true)
    try {
      await respostasApi.create(id, mensagem, session.token)
      setMensagem('')
      carregar()
    } catch {
      setError('Não foi possível enviar a resposta.')
    } finally {
      setEnviando(false)
    }
  }

  if (error && !ticket) {
    return <p className="text-alert-critica font-mono text-sm">{error}</p>
  }

  if (!ticket) return <Spinner label="A abrir o bilhete…" />

  const codigo = `T-${String(ticket.id).padStart(5, '0')}`

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="focus-ring text-sm text-desk-paper2/60 hover:text-desk-paper mb-4 inline-flex items-center gap-1"
      >
        ← Voltar
      </button>

      <div className="stub p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-desk-paper2/60 tracking-wider">{codigo}</span>
          <StatusStamp estado={ticket.estado} />
        </div>

        <h1 className="font-display font-bold text-2xl mb-2">{ticket.titulo}</h1>

        <div className="flex items-center gap-4 mb-4 text-xs font-mono text-desk-paper2/60 uppercase">
          <span>{ticket.categoria}</span>
          <PriorityTag prioridade={ticket.prioridade} />
        </div>

        <p className="text-desk-paper/90 whitespace-pre-wrap leading-relaxed">{ticket.descricao}</p>

        {session.role === 'ADMIN' && (
          <div className="mt-6 pt-5 border-t border-desk-line/60 flex items-center gap-3 flex-wrap">
            <label className="text-xs font-mono uppercase tracking-wide text-desk-paper2/60">
              Alterar estado:
            </label>
            <select
              value={ticket.estado}
              disabled={atualizandoEstado}
              onChange={(e) => handleEstado(e.target.value)}
              className="focus-ring bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-1.5 text-sm font-mono"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <button
              onClick={handleDelete}
              className="focus-ring ml-auto text-sm text-alert-critica/90 hover:text-alert-critica"
            >
              Eliminar ticket
            </button>
          </div>
        )}
      </div>

      <h2 className="font-display font-semibold text-lg mb-3">Respostas</h2>

      {error && <p className="text-alert-critica font-mono text-sm mb-3">{error}</p>}

      <div className="space-y-3 mb-6">
        {respostas.length === 0 && (
          <p className="text-desk-paper2/50 text-sm font-mono">Ainda sem respostas neste ticket.</p>
        )}
        {respostas.map((r) => (
          <div key={r.id} className="bg-desk-panel/60 border border-desk-line/60 rounded-sm p-4">
            <p className="text-desk-paper/90 whitespace-pre-wrap">{r.mensagem}</p>
            {r.created_at && (
              <p className="text-xs font-mono text-desk-paper2/40 mt-2">{r.created_at}</p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleResposta} className="stub p-4 flex gap-3">
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={2}
          placeholder="Escreve uma resposta…"
          className="focus-ring flex-1 bg-desk-ink/60 border border-desk-line rounded-sm px-3 py-2 text-sm resize-none"
        />
        <button
          type="submit"
          disabled={enviando}
          className="focus-ring self-end bg-teal-accent text-desk-ink font-display font-semibold px-4 py-2 rounded-sm hover:bg-teal-accent/90 transition-colors disabled:opacity-50"
        >
          {enviando ? '…' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
