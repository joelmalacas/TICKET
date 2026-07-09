import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ticketsApi } from '../api/tickets'
import { useAuth } from '../context/AuthContext'
import TicketStub from '../components/TicketStub'
import Spinner from '../components/Spinner'

const ESTADOS = ['aberto', 'em analise', 'aguardar resposta', 'resolvido', 'cancelado']

export default function Dashboard() {
  const { session } = useAuth()
  const [tickets, setTickets] = useState(null)
  const [error, setError] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    let cancelado = false
    ticketsApi
      .list(session.token)
      .then((res) => {
        if (cancelado) return
        // API devolve algo como ['TICKET', [...]]
        const lista = Array.isArray(res) ? res.find((v) => Array.isArray(v)) || [] : []
        setTickets(lista)
      })
      .catch((err) => setError(err?.data?.error || 'Não foi possível carregar os tickets.'))
    return () => {
      cancelado = true
    }
  }, [session.token])

  const filtrados = useMemo(() => {
    if (!tickets) return []
    return tickets.filter((t) => {
      const passaEstado = filtroEstado === 'todos' || t.estado === filtroEstado
      const passaBusca =
        !busca ||
        t.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
        t.categoria?.toLowerCase().includes(busca.toLowerCase())
      return passaEstado && passaBusca
    })
  }, [tickets, filtroEstado, busca])

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl">
            {session.role === 'ADMIN' ? 'Todos os tickets' : 'Os teus tickets'}
          </h1>
          <p className="text-desk-paper2/60 text-sm mt-1">
            {tickets ? `${filtrados.length} de ${tickets.length} bilhete(s)` : 'A carregar…'}
          </p>
        </div>
        {session.role === 'USER' && (
          <Link
            to="/tickets/novo"
            className="focus-ring bg-amber-stamp text-desk-ink font-display font-semibold text-sm px-4 py-2 rounded-sm hover:bg-amber-stamp/90 transition-colors"
          >
            + Novo ticket
          </Link>
        )}
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar por título ou categoria…"
          className="focus-ring flex-1 min-w-[220px] bg-desk-panel border border-desk-line rounded-sm px-3 py-2 text-sm placeholder:text-desk-paper2/40"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="focus-ring bg-desk-panel border border-desk-line rounded-sm px-3 py-2 text-sm font-mono"
        >
          <option value="todos">Todos os estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-alert-critica font-mono text-sm mb-4">{error}</p>}

      {!tickets && !error && <Spinner label="A carregar bilhetes…" />}

      {tickets && filtrados.length === 0 && (
        <div className="stub p-10 text-center text-desk-paper2/60">
          <p className="font-display text-lg mb-1">Sem tickets para mostrar</p>
          <p className="text-sm">
            {session.role === 'USER'
              ? 'Cria o teu primeiro ticket para começares.'
              : 'Ainda não há bilhetes que correspondam a este filtro.'}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {filtrados.map((t) => (
          <TicketStub key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  )
}
