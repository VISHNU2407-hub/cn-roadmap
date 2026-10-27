import { useCallback, useEffect, useState } from 'react'
import { AppContext } from './app-context'
import { useAppState } from './hooks/useAppState'
import { Header, type View } from './components/Header'
import { Hero } from './components/Hero'
import { StatsRow } from './components/StatsRow'
import { Roadmap } from './components/Roadmap'
import { LessonModal } from './components/LessonModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { WEEKS } from './types'
import { LESSONS } from './data/curriculum'

export default function App() {
  const app = useAppState()
  const [view, setViewState] = useState<View>('home')
  const [openLesson, setOpenLesson] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const openLessonById = useCallback((id: number) => {
    setOpenLesson(Math.min(Math.max(id, 1), 28))
  }, [])

  const setView = useCallback((v: View) => {
    setViewState(v)
    setOpenLesson(null)
  }, [])

  // Deep links: #home, #roadmap, #day-1..#day-28
  useEffect(() => {
    const applyHash = () => {
      const h = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      const m = h.match(/^day-(\d{1,2})$/)
      if (m) {
        const id = Math.min(Math.max(Number(m[1]), 1), 28)
        setViewState('roadmap')
        setOpenLesson(id)
        return
      }
      setViewState(h === 'roadmap' ? 'roadmap' : 'home')
      setOpenLesson(null)
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  useEffect(() => {
    const target =
      openLesson !== null ? `#day-${openLesson}` : view === 'roadmap' ? '#roadmap' : '#home'
    if (window.location.hash !== target) window.history.replaceState(null, '', target)
  }, [view, openLesson])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail
      if (typeof detail === 'number') openLessonById(detail)
    }
    window.addEventListener('netpath:goto', handler)
    return () => window.removeEventListener('netpath:goto', handler)
  }, [openLessonById])

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
                {WEEKS.map((w) => {
                  const days = LESSONS.filter((l) => l.week === w.week)
                  const done = days.filter((d) => app.state.completed.includes(d.id)).length
                  const pct = Math.round((done / 7) * 100)
                  return (
                    <button key={w.week} className="home-week-card" onClick={() => setView('roadmap')}>
                      <span className="hw-top">
                        <span className="hw-num">Week {w.week}</span>
                        <span className="hw-count">
                          {done}/7
                        </span>
                      </span>
                      <span className="hw-title">{w.title}</span>
                      <span className="hw-sub">{w.description}</span>
                      <span className="hw-bar" aria-hidden="true">
                        <span className="hw-bar-fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="hw-cta">{done === 7 ? 'Week complete ✓' : 'Open roadmap →'}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        )}

        {view === 'roadmap' && <Roadmap onOpenLesson={openLessonById} />}
      </main>

      <footer className="footer">
        <p>
          CN Roadmap — a 4-week Computer Networks roadmap. Progress is stored locally in your browser;
          nothing is uploaded anywhere.
        </p>
      </footer>

      {openLesson !== null && <LessonModal lessonId={openLesson} onClose={() => setOpenLesson(null)} />}

      <ConfirmDialog
        open={confirmOpen}
        title="Reset all progress?"
        body="This permanently clears completed days, your streak and checklist state. Your theme choice is kept. This cannot be undone."
        confirmLabel="Reset everything"
        onConfirm={() => {
          app.resetProgress()
          setConfirmOpen(false)
          setOpenLesson(null)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </AppContext.Provider>
  )
}
