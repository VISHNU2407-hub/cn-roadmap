import { CheckCircle2, Clock3, Flame, CalendarCheck } from 'lucide-react'
import { useApp } from '../app-context'

export function StatsRow() {
  const { state, totalMinutes } = useApp()
  const completed = state.completed.length

  // Current roadmap week = the week containing the first incomplete day.
  const currentDay =
    Array.from({ length: 28 }, (_, i) => i + 1).find((id) => !state.completed.includes(id)) ?? 28
  const week = Math.ceil(currentDay / 7)
  const weekDays = Array.from({ length: 7 }, (_, i) => (week - 1) * 7 + i + 1)
  const weekDone = weekDays.filter((d) => state.completed.includes(d)).length
  const weekPct = Math.round((weekDone / 7) * 100)

  const stats = [
    {
      icon: <CheckCircle2 size={16} />,
      label: 'Days completed',
      value: `${completed}/28`,
      detail: completed === 0 ? 'Start with Day 1' : `${Math.round((completed / 28) * 100)}% of the journey`,
    },
    {
      icon: <Clock3 size={16} />,
      label: 'Study time logged',
      value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      detail: '60 minutes per lesson',
    },
    {
      icon: <Flame size={16} className={state.streak > 0 ? 'flame-lit' : ''} />,
      label: 'Current streak',
      value: `${state.streak} ${state.streak === 1 ? 'day' : 'days'}`,
      detail: state.lastStudyDate ? `Last studied ${state.lastStudyDate}` : 'No sessions yet',
    },
    {
      icon: <CalendarCheck size={16} />,
      label: `Week ${week} progress`,
      value: `${weekPct}%`,
      detail: `${weekDone} of 7 days done`,
    },
  ]

  return (
    <section className="stats-row" aria-label="Statistics">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon">{s.icon}</div>
          <div className="stat-body">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-detail">{s.detail}</span>
          </div>
        </div>
      ))}
    </section>
  )
}
