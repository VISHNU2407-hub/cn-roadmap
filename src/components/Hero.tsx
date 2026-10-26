import { ArrowRight, Check, Flame, TrendingUp } from 'lucide-react'
import { useApp } from '../app-context'
import { getLesson } from '../data/curriculum'

interface Props {
  onOpenLesson: (id: number) => void
}

export function Hero({ onOpenLesson }: Props) {
  const { state } = useApp()
  const completed = state.completed.length
  const pct = Math.round((completed / 28) * 100)
  const nextId = Array.from({ length: 28 }, (_, i) => i + 1).find(
    (id) => !state.completed.includes(id),
  ) ?? 28
  const next = getLesson(nextId)
  const currentDay = nextId // first incomplete day IS the current day
  const allDone = completed === 28

  return (
    <section className="hero" aria-label="Overall progress">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-card">
        <p className="eyebrow">28-day roadmap · 1 hour per day</p>
        <h1>Master Computer Networks in 28 Days</h1>
        <p className="hero-sub">One hour a day. Learn the fundamentals. Crack the interview.</p>

        <div className="hero-progress" role="group" aria-label="Overall progress">
          <div className="progress-meta">
            <span className="progress-count">
              <Check size={14} className="accent" /> {completed} of 28 days complete
            </span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <div
              className="progress-fill"
              style={{ width: `${pct}%` }}
              data-testid="hero-progress-fill"
            />
          </div>
        </div>

        <div className="hero-next">
          {allDone ? (
            <div className="hero-next-info">
              <TrendingUp size={16} className="accent" />
              <div>
                <span className="hero-next-label">Journey complete</span>
                <span className="hero-next-topic">Review your weak topics in Practice to stay sharp.</span>
              </div>
            </div>
          ) : (
            <div className="hero-next-info">
              <Flame size={16} className="accent" />
              <div>
                <span className="hero-next-label">Next up · Day {currentDay}</span>
                <span className="hero-next-topic">{next.topic}</span>
              </div>
            </div>
          )}
          <button className="btn-primary" onClick={() => onOpenLesson(nextId)}>
            {allDone ? 'Review Day 28' : 'Continue learning'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
