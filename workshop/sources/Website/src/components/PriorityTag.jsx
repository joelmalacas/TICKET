const COLORS = {
  baixa: 'bg-alert-baixa',
  media: 'bg-alert-media',
  alta: 'bg-alert-alta',
  critica: 'bg-alert-critica',
}

const LABELS = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
}

export default function PriorityTag({ prioridade }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-desk-paper2">
      <span className={`w-2 h-2 rounded-full ${COLORS[prioridade] || 'bg-desk-line'}`} />
      {LABELS[prioridade] || prioridade}
    </span>
  )
}
