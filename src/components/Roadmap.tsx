import { BookOpen, Check, ChevronRight, Flag, LockOpen, PenLine, Sparkles, Timer, Zap } from 'lucide-react'
import { useApp } from '../app-context'
import { LESSONS } from '../data/curriculum'
import { WEEKS } from '../types'
import type { Lesson } from '../types'

interface Props {
  onOpenLesson: (id: number) => void
}

const weekIcon = (w: number) => {
  const map = [BookOpen, Zap, Flag, Sparkles]
  const Icon = map[w - 1]
  return <Icon size={16} />
}

function firstIncomplete(state: { completed: number[] }): number {
  for (let id = 1; id <= 28; id++) if (!state.completed.includes(id)) return id
  return 29 // all done
}

export function DayCard({
  lesson,
  onOpenLesson,
  timeline,
}: {
  lesson: Lesson
  onOpenLesson: (id: number) => void
  timeline: boolean
}) {
  const { state, timerState } = useApp()
  const isDone = state.completed.includes(lesson.id)
  const isCurrent = firstIncomplete(state) === lesson.id
  const status: 'done' | 'current' | 'upcoming' = isDone ? 'done' : isCurrent ? 'current' : 'upcoming'
  const timerHere = timerState?.lessonId === lesson.id

  return (
    <article
      className={`day-card status-${status} ${timeline ? 'in-timeline' : ''}`}
      aria-label={`Day ${lesson.id}: ${lesson.topic} — ${status}`}
    >
      <div className="day-gutter" aria-hidden="true">
        <span className="day-node">{isDone ? <Check size={13} strokeWidth={3} /> : lesson.id}</span>
      </div>

      <button className="day-main" onClick={() => onOpenLesson(lesson.id)}>
        <div className="day-head">
          <span className="day-number">Day {lesson.id}</span>
          <span className={`day-badge badge-${status}`}>
            {status === 'done' ? 'completed' : status === 'current' ? 'current' : 'upcoming'}
            {timerHere && <Timer size={12} />}
          </span>
        </div>
        <h3 className="day-topic">{lesson.topic}</h3>
        <p className="day-objective">{lesson.objective}</p>
        <ul className="day-subtopics">
          {lesson.subtopics.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </button>

      <footer className="day-foot">
        <span className="day-meta">
          <Timer size={13} /> 60 min · 3 blocks
        </span>
        <span className="day-meta">
          <PenLine size={13} /> {lesson.questions.length}
          {lesson.quiz ? ` + ${lesson.quiz.length}` : ''} questions
        </span>
        <span className="day-foot-actions">
          <span className={`done-pill ${isDone ? 'is-done' : ''}`} title={isDone ? 'Completed' : 'Upcoming'}>
            {status === 'current' ? <LockOpen size={13} /> : <Check size={13} />}
            {status === 'done' ? 'Done' : status === 'current' ? 'Open lesson' : 'Upcoming'}
          </span>
          <button className="icon-chevron" onClick={() => onOpenLesson(lesson.id)} aria-label={`Open Day ${lesson.id}: ${lesson.topic}`}>
            <ChevronRight size={16} />
          </button>
        </span>
      </footer>
    </article>
  )
}

export function Roadmap({ onOpenLesson }: Props) {
  const { state } = useApp()
  return (
    <div className="roadmap">
      {WEEKS.map((w) => {
        const days = LESSONS.filter((l) => l.week === w.week)
        const doneCount = days.filter((d) => state.completed.includes(d.id)).length
        return (
          <section className="week-section" key={w.week} aria-label={`Week ${w.week}: ${w.title}`}>
            <header className="week-header">
              <div className="week-chip">{weekIcon(w.week)}</div>
              <div className="week-titles">
                <h2>
                  <span className="week-kicker">Week {w.week}</span>
                  {w.title}
                </h2>
                <p>{w.description}</p>
              </div>
              <div className="week-progress">
                <span>{doneCount}/7</span>
                <small>days done</small>
              </div>
            </header>
            <div className="timeline">
              {days.map((l) => (
                <DayCard key={l.id} lesson={l} onOpenLesson={onOpenLesson} timeline />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
