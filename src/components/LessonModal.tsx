import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, ListChecks, Target, X } from 'lucide-react'
import { useApp } from '../app-context'
import { getLesson } from '../data/curriculum'

interface Props {
  lessonId: number
  onClose: () => void
}

export function LessonModal({ lessonId, onClose }: Props) {
  const lesson = getLesson(Math.min(Math.max(lessonId, 1), 28))
  const { state, completeLesson, uncompleteLesson, setChecklist } = useApp()
  const isDone = state.completed.includes(lesson.id)
  const checklistKey = `d${lesson.id}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const prevDisabled = lesson.id <= 1
  const nextDisabled = lesson.id >= 28

  const checklistItems = lesson.checklist.map((c) => `${checklistKey}:${c}`)
  const allChecked = checklistItems.length > 0 && checklistItems.every((c) => state.checklist[c])
  const checkedCount = checklistItems.filter((c) => state.checklist[c]).length

  const markComplete = () => {
    completeLesson(lesson.id)
    setChecklist(checklistItems, true)
  }

  const undoComplete = () => {
    uncompleteLesson(lesson.id)
    setChecklist(checklistItems, false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal slim"
        role="dialog"
        aria-modal="true"
        aria-label={`Lesson: Day ${lesson.id} — ${lesson.topic}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <div className="modal-head-text">
            <span className="modal-kicker">
              Week {lesson.week} · Day {lesson.id} · {lesson.category}
            </span>
            <h2>{lesson.topic}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close lesson">
            <X size={18} />
          </button>
        </header>

        <div className="modal-body">
          <section className="modal-section" aria-label="Learning objective">
            <p className="objective-line">
              <Target size={14} />
              <strong>Objective:</strong> {lesson.objective}
            </p>
          </section>

          <div className="modal-grid">
            <section aria-label="Subtopics">
              <h3 className="section-title">What you'll cover</h3>
              <ul className="cover-list">
                {lesson.subtopics.map((s, i) => (
                  <li key={s}>
                    <span className="cover-num">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <aside aria-label="Checklist">
              <h3 className="section-title">
                <ListChecks size={14} /> Checkpoints
              </h3>
              <ul className="checklist">
                {lesson.checklist.map((c) => {
                  const key = `${checklistKey}:${c}`
                  return (
                    <li key={c}>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={!!state.checklist[key]}
                          onChange={(e) => setChecklist([key], e.target.checked)}
                        />
                        <span>{c}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
              <p className={`checklist-hint ${allChecked ? 'ok' : ''}`}>
                {allChecked
                  ? 'All checkpoints hit — mark the day complete.'
                  : `${checkedCount} of ${checklistItems.length} ticked`}
              </p>
            </aside>
          </div>
        </div>

        <footer className="modal-foot">
          <div className="modal-nav">
            <button
              className="btn-ghost btn-sm"
              onClick={() =>
                prevDisabled ? undefined : window.dispatchEvent(new CustomEvent('netpath:goto', { detail: lesson.id - 1 }))
              }
              disabled={prevDisabled}
              title="Previous lesson"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              className={`btn-primary btn-sm ${isDone ? 'btn-done' : ''}`}
              onClick={isDone ? undoComplete : markComplete}
            >
              {isDone ? (
                <>
                  <X size={14} /> Undo complete
                </>
              ) : (
                <>
                  <Check size={14} /> Mark complete
                </>
              )}
            </button>
            <button
              className="btn-ghost btn-sm"
              onClick={() =>
                nextDisabled ? undefined : window.dispatchEvent(new CustomEvent('netpath:goto', { detail: lesson.id + 1 }))
              }
              disabled={nextDisabled}
              title="Next lesson"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
          <span className="modal-foot-hint">Day {lesson.id} of 28</span>
        </footer>
      </div>
    </div>
  )
}
