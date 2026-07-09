export default function Spinner({ label = 'A carregar…' }) {
  return (
    <div className="flex items-center gap-3 text-desk-paper2/70 py-10 justify-center">
      <span className="w-4 h-4 border-2 border-desk-paper2/30 border-t-amber-stamp rounded-full animate-spin" />
      <span className="font-mono text-sm">{label}</span>
    </div>
  )
}
