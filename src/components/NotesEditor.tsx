import { useEffect, useRef, useState } from 'react'
import { Check, PenLine } from 'lucide-react'

interface Props {
  lessonId: number
  initial: string
  onSave: (text: string) => void
}

export function NotesEditor({ lessonId, initial, onSave }: Props) {
  const [value, setValue] = useState(initial)
  const [saved, setSaved] = useState(false)
  const lastSaved = useRef(initial)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const valueRef = useRef(initial)
  valueRef.current = value

  // Reset local copy when switching lessons.
  useEffect(() => {
    setValue(initial)
    lastSaved.current = initial
    setSaved(false)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      // flush unsaved text synchronously on lesson switch
      if (lastSaved.current !== valueRef.current) {
        lastSaved.current = valueRef.current
        onSaveRef.current(valueRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  // keep a stable ref to onSave for the unmount flush
  const onSaveRef = useRef(onSave)
  onSaveRef.current = onSave

  useEffect(() => {
    if (value === lastSaved.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      lastSaved.current = value
      onSave(value)
      setSaved(true)
      setTimeout(() => setSaved(false), 1600)
    }, 700)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="notes">
      <div className="notes-head">
        <span className="notes-label">
          <PenLine size={13} /> Lesson notes
        </span>
        <span className={`notes-saved ${saved ? 'visible' : ''}`} role="status" aria-live="polite">
          <Check size={12} /> Saved
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Key points, port numbers, your own analogies, self-assessment (Day 7…)"
        rows={6}
        aria-label="Notes for this lesson (autosaves)"
      />
    </div>
  )
}
