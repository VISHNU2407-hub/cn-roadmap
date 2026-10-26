import { PartyPopper, X } from 'lucide-react'

interface Props {
  week: number
  onClose: () => void
}

export function Celebration({ week, onClose }: Props) {
  return (
    <div className="celebration" role="status" aria-live="polite">
      <PartyPopper size={18} />
      <div>
        <strong>Week {week} complete!</strong>
        <p>Every day of week {week} is done. Momentum is the whole game — keep it rolling.</p>
      </div>
      <button className="icon-btn" onClick={onClose} aria-label="Dismiss celebration">
        <X size={15} />
      </button>
    </div>
  )
}
