import { useCallback, useEffect, useRef, useState } from 'react'
import { AppContext } from './app-context'
import { useAppState } from './hooks/useAppState'
import { Header, type View } from './components/Header'
import { Hero } from './components/Hero'
import { StatsRow } from './components/StatsRow'
import { Roadmap } from './components/Roadmap'
import { Practice } from './components/Practice'
import { LessonModal } from './components/LessonModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Celebration } from './components/Celebration'

const WEEK_TITLES = [
  'Networking fundamentals',
  'Transport & application layers',
  'IP, routing & web requests',
  'Interview preparation',
]

function weekDays(w: number): number[] {
  return [7 * (w - 1) + 1, 7 * (w - 1) + 2, 7 * (w - 1) + 3, 7 * (w - 1) + 4, 7 * (w - 1) + 5, 7 * (w - 1) + 6, 7 * (w - 1) + 7]
}

export default function App() {
  const app = useAppState()
  const [view, setView] = useState<View>('home')
  const [openLesson, setOpenLesson] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [celebration, setCelebration] = useState<number | null>(null)
  const prevCompleted = useRef<number[] | null>(null)
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (celebrationTimer.current) clearTimeout(celebrationTimer.current) }, [])

  const openLessonById = useCallback((id: number) => {
    setOpenLesson(Math.min(Math.max(id, 1), 28))
  }, [])

  // prev/next navigation from the lesson modal footer
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail
      if (typeof detail === 'number') openLessonById(detail)
    }
    window.addEventListener('netpath:goto', handler)
    return () => window.removeEventListener('netpath:goto', handler)
  }, [openLessonById])

  // Detect a fully-completed week → one-off celebration.
  useEffect(() => {
    const before = prevCompleted.current ?? []
    const now = app.state.completed
    prevCompleted.current = now
    for (let w = 1; w <= 4; w++) {
      const all = weekDays(w).every((d) => now.includes(d))
      if (all && !app.state.celebratedWeeks.includes(w)) {
        app.celebrateWeek(w)
        setCelebration(w)
        if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
        celebrationTimer.current = setTimeout(() => setCelebration(null), 7000)
        break
      }
    }
    if (before.length === now.length) {
      // no change; also celebrate on load is skipped because celebratedWeeks persists
      void before
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.state.completed, app.state.celebratedWeeks])

  return (
    <AppContext.Provider value={app}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header view={view} setView={setView} onReset={() => setConfirmOpen(true)} />

      <main id="main" className="main">
        {view === 'home' && (
          <div className="home">
            <Hero onOpenLesson={openLessonById} />
            <StatsRow />
            <section className="home-weeks" aria-label="Week overview">
              <h2 className="home-h2">Your four weeks</h2>
              <div className="home-week-grid">
                {WEEK_TITLES.map((title, i) => {
                  const w = i + 1
                  return (
                    <button key={w} className="home-week-card" onClick={() => setView('roadmap')}>
                      <span className="hw-num">Week {w}</span>
                      <span className="hw-title">{title}</span>
                      <span className="hw-sub">
                        Days {7 * i + 1}–{w * 7}
                      </span>
                      <span className="hw-cta">Open roadmap →</span>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {view === 'roadmap' && <Roadmap onOpenLesson={openLessonById} />}
        {view === 'practice' && <Practice onOpenLesson={openLessonById} />}
      </main>

      <footer className="footer">
        <p>
          NetPath — a 28-day Computer Networks study companion. Progress, notes and quiz results
          are stored locally in your browser; nothing is uploaded anywhere.
        </p>
      </footer>

      {openLesson !== null && <LessonModal lessonId={openLesson} onClose={() => setOpenLesson(null)} />}

      <ConfirmDialog
        open={confirmOpen}
        title="Reset all progress?"
        body="This permanently clears completed lessons, notes, timer records, quiz results, your streak and weekly celebrations. Your theme choice is kept. This cannot be undone."
        confirmLabel="Reset everything"
        onConfirm={() => {
          app.resetProgress()
          prevCompleted.current = null
          setConfirmOpen(false)
          setOpenLesson(null)
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {celebration !== null && <Celebration week={celebration} onClose={() => setCelebration(null)} />}
    </AppContext.Provider>
  )
}
