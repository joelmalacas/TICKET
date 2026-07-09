import { Link } from 'react-router-dom'
import StatusStamp from './StatusStamp'
import PriorityTag from './PriorityTag'

export default function TicketStub({ ticket }) {
  const codigo = `T-${String(ticket.id).padStart(5, '0')}`

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="stub focus-ring flex items-stretch overflow-hidden hover:border-teal-accent/60 transition-colors group"
    >
      <div className="flex-1 p-5 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-mono text-xs text-desk-paper2/70 tracking-wider">{codigo}</span>
          <PriorityTag prioridade={ticket.prioridade} />
        </div>
        <h3 className="font-display font-semibold text-lg text-desk-paper truncate group-hover:text-teal-accent transition-colors">
          {ticket.titulo}
        </h3>
        <p className="text-sm text-desk-paper2/80 mt-1 line-clamp-2">{ticket.descricao}</p>
        <div className="mt-3 text-xs font-mono text-desk-paper2/50 uppercase tracking-wide">
          {ticket.categoria}
        </div>
      </div>

      <div className="stub-tear w-32 shrink-0 flex flex-col items-center justify-center gap-2 px-3 border-l-2 border-dashed border-desk-line/70">
        <StatusStamp estado={ticket.estado} />
      </div>
    </Link>
  )
}
