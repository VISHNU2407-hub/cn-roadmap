import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpenCheck, ChevronLeft, ChevronRight, Check, Clock3, Info, Lightbulb, X, ListChecks, Keyboard } from 'lucide-react'
import { useApp } from '../app-context'
import { getLesson } from '../data/curriculum'
import { Diagram } from './Diagram'
import { NotesEditor } from './NotesEditor'
import { QuizDrill } from './QuizDrill'
import { Timer } from './Timer'
import { STUDY_BLOCKS } from '../types'

interface Props {
  lessonId: number
  onClose: () => void
}

export function LessonModal({ lessonId, onClose }: Props) {
  const lesson = getLesson(Math.min(Math.max(lessonId, 1), 28))
  const {
    state,
    completeLesson,
    uncompleteLesson,
    saveNotes,
    timerState,
    timerInterrupted,
  } = useApp()
  const isDone = state.completed.includes(lesson.id)
  const [openQ, setOpenQ] = useState<number | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const checklistKey = `d${lesson.id}`
  const hasQuiz = lesson.quiz && lesson.quiz.length > 0
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setChecked({})
    setOpenQ(null)
  }, [lesson.id])

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

  // focus the dialog on open for keyboard accessibility
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const prevDisabled = lesson.id <= 1
  const nextDisabled = lesson.id >= 28

  const checklistItems = useMemo(
    () => lesson.checklist.map((c) => `${checklistKey}:${c}`),
    [lesson.checklist, checklistKey],
  )
  const allChecked = checklistItems.every((c) => checked[c])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Lesson: Day ${lesson.id} — ${lesson.topic}`}
        tabIndex={-1}
        ref={dialogRef}
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
              <Info size={14} />
              <strong>Objective:</strong> {lesson.objective}
            </p>
          </section>

          <section className="modal-section" aria-label="60-minute study plan">
            <h3 className="section-title">
              <Clock3 size={14} /> Time plan — 60 minutes
            </h3>
            <div className="time-plan">
              {STUDY_BLOCKS.map((b, i) => (
                <div className="time-plan-block" key={b.label}>
                  <span className="time-plan-mins">{b.minutes}m</span>
                  <span className="time-plan-label">{b.label}</span>
                  <span className="time-plan-hint">{b.hint}</span>
                  <span className="time-plan-step">{i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-grid" aria-label="Study aids">
            <div>
              <h3 className="section-title">Study plan · concept summary</h3>
              <div className="lesson-summary">
                {lesson.summary.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <h3 className="section-title">
                <Lightbulb size={14} /> Key terminology
              </h3>
              <dl className="terms">
                {lesson.terms.map((t) => (
                  <div className="term" key={t.term}>
                    <dt>{t.term}</dt>
                    <dd>{t.def}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside>
              <h3 className="section-title">
                <ListChecks size={14} /> Topic checklist
              </h3>
              <ul className="checklist">
                {lesson.checklist.map((c) => {
                  const key = `${checklistKey}:${c}`
                  return (
                    <li key={c}>
                      <label className="check-item">
                        <input
                          type="checkbox"
                          checked={!!checked[key]}
                          onChange={(e) => setChecked((s) => ({ ...s, [key]: e.target.checked }))}
                        />
                        <span>{c}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
              <p className={`checklist-hint ${allChecked ? 'ok' : ''}`}>
                {allChecked ? 'Checklist complete — nice.' : 'Tick items as you cover them.'}
              </p>

              {timerInterrupted && (
                <p className="timer-interrupted" role="alert">
                  A running session was interrupted by a page reload — it was stopped rather than
                  guessed. Press Start to begin a fresh block whenever you’re ready.
                </p>
              )}
              <Timer key={`timer-${lesson.id}`} lessonId={lesson.id} />
            </aside>
          </section>

          {lesson.diagram && (
            <section className="modal-section" aria-label="Diagram">
              <h3 className="section-title">Diagram to remember</h3>
              <Diagram kind={lesson.diagram} />
            </section>
          )}

          <section className="modal-section" aria-label="Interview questions">
            <h3 className="section-title">
              <BookOpenCheck size={14} /> Interview questions
            </h3>
            <div className="qa-list">
              {lesson.questions.map((q, i) => (
                <div className={`qa ${openQ === i ? 'open' : ''}`} key={q.q}>
                  <button
                    className="qa-q"
                    onClick={() => setOpenQ(openQ === i ? null : i)}
                    aria-expanded={openQ === i}
                  >
                    <ChevronRight size={14} className="qa-chevron" />
                    <span>{q.q}</span>
                  </button>
                  {openQ === i && <p className="qa-a">{q.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {hasQuiz && (
            <section className="modal-section" aria-label="Quiz activity">
              <h3 className="section-title">
                <Keyboard size={14} /> {lesson.id === 27 ? 'Mock interview — attempt before revealing' : lesson.id === 28 ? 'Final assessment — without notes' : 'Mixed quiz — answer from memory'}
              </h3>
              <QuizDrill
                questions={lesson.quiz!}
                mode={lesson.id === 28 ? 'assessment' : 'drill'}
              />
            </section>
          )}

          <section className="modal-section" aria-label="Notes">
            <NotesEditor
              key={`notes-${lesson.id}`}
              lessonId={lesson.id}
              initial={state.notes[lesson.id] ?? ''}
              onSave={(text) => saveNotes(lesson.id, text)}
            />
          </section>
        </div>

        <footer className="modal-foot">
          <div className="modal-nav">
            <button className="btn-ghost btn-sm" onClick={() => prevDisabled ? undefined : window.dispatchEvent(new CustomEvent('netpath:goto', { detail: lesson.id - 1 }))} disabled={prevDisabled} title="Previous lesson">
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              className={`btn-primary btn-sm ${isDone ? 'btn-done' : ''}`}
              onClick={() => (isDone ? uncompleteLesson(lesson.id) : completeLesson(lesson.id))}
              title={timerState?.lessonId === lesson.id && timerState.running ? 'Timer will be paused and saved' : undefined}
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
            <button className="btn-ghost btn-sm" onClick={() => nextDisabled ? undefined : window.dispatchEvent(new CustomEvent('netpath:goto', { detail: lesson.id + 1 }))} disabled={nextDisabled} title="Next lesson">
              Next <ChevronRight size={14} />
            </button>
          </div>
          {state.notes[lesson.id] && isDone && (
            <span className="modal-foot-hint">Notes and completion are saved throughout the app.</span>
          )}
        </footer>
      </div>
    </div>
  )
}
