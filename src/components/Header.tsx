import { Flame, Moon, Sun, RotateCcw, Map, Network } from 'lucide-react'
import { useApp } from '../app-context'

export type View = 'home' | 'roadmap'

interface Props {
  view: View
  setView: (v: View) => void
  onReset: () => void
}

export function Header({ view, setView, onReset }: Props) {
  const { state, toggleTheme } = useApp()
  const dark = state.theme === 'dark'

  const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Dashboard', icon: <Network size={15} /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Map size={15} /> },
  ]

  return (
    <header className="header">
      <div className="header-inner">
        <button className="brand" onClick={() => setView('home')} aria-label="CN Roadmap home">
          <span className="brand-mark" aria-hidden="true">
            <Network size={17} strokeWidth={2.4} />
          </span>
          <span className="brand-text">
            <span className="brand-name">CN Roadmap</span>
            <span className="brand-sub">4-week roadmap to CN interview readiness</span>
          </span>
        </button>

        <div className="header-right">
          <div className="streak-chip" title="Current study streak">
            <Flame size={14} className={state.streak > 0 ? 'flame-lit' : 'flame-dim'} />
            <strong>{state.streak}</strong>
            <span>day streak</span>
          </div>

          <nav className="view-tabs" aria-label="Sections">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`view-tab ${view === t.id ? 'active' : ''}`}
                onClick={() => setView(t.id)}
                aria-current={view === t.id ? 'page' : undefined}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <button className="icon-btn" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="icon-btn" onClick={onReset} aria-label="Reset all progress" title="Reset progress">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
