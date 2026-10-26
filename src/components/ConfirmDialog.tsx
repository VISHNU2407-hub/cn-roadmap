import { useEffect, useRef } from 'react'
import { TriangleAlert, X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-overlay small" onClick={onCancel}>
      <div
        className="modal confirm"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="confirm-head">
          <span className="confirm-icon" aria-hidden="true">
            <TriangleAlert size={18} />
          </span>
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onCancel} aria-label="Cancel reset">
            <X size={16} />
          </button>
        </header>
        <p className="confirm-body">{body}</p>
        <footer className="confirm-actions">
          <button className="btn-ghost" onClick={onCancel}>
            Keep my progress
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}
