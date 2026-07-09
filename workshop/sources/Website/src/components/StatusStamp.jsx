const STYLES = {
  'aberto': 'text-teal-accent',
  'em analise': 'text-amber-stamp',
  'aguardar resposta': 'text-amber-stamp',
  'resolvido': 'text-desk-paper',
  'cancelado': 'text-alert-critica',
}

const LABELS = {
  'aberto': 'Aberto',
  'em analise': 'Em análise',
  'aguardar resposta': 'A aguardar resposta',
  'resolvido': 'Resolvido',
  'cancelado': 'Cancelado',
}

export default function StatusStamp({ estado }) {
  const cls = STYLES[estado] || 'text-desk-paper2'
  const label = LABELS[estado] || estado
  return <span className={`stamp text-[11px] ${cls}`}>{label}</span>
}
