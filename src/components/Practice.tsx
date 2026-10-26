import { useMemo, useState } from 'react'
import { ChevronRight, Download, Filter, FlipHorizontal, Search, Zap } from 'lucide-react'
import { useApp } from '../app-context'
import { ALL_QUESTIONS, LESSONS } from '../data/curriculum'
import { FLASHCARDS } from '../data/flashcards'

const TOPICS = ['All', 'Fundamentals', 'Transport', 'Application', 'IP & Routing', 'Security'] as const

export function Practice({ onOpenLesson }: { onOpenLesson: (id: number) => void }) {
  const { state, clearWrongAnswers } = useApp()
  const [tab, setTab] = useState<'bank' | 'weak' | 'cards'>('bank')
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('All')
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_QUESTIONS.filter(
      (x) =>
        (topic === 'All' || x.topic === topic) &&
        (!q || x.q.toLowerCase().includes(q) || x.a.toLowerCase().includes(q)),
    )
  }, [query, topic])

  const weak = state.wrongAnswers
  const card = FLASHCARDS[cardIdx % FLASHCARDS.length]

  return (
    <div className="practice">
      <header className="practice-head">
        <h1>Interview practice</h1>
        <div className="practice-tabs" role="tablist" aria-label="Practice sections">
          <button role="tab" aria-selected={tab === 'bank'} className={tab === 'bank' ? 'active' : ''} onClick={() => setTab('bank')}>
            <Zap size={14} /> Question bank
          </button>
          <button role="tab" aria-selected={tab === 'weak'} className={tab === 'weak' ? 'active' : ''} onClick={() => setTab('weak')}>
            <Filter size={14} /> Weak topics {weak.length > 0 && <span className="count">{weak.length}</span>}
          </button>
          <button role="tab" aria-selected={tab === 'cards'} className={tab === 'cards' ? 'active' : ''} onClick={() => setTab('cards')}>
            <FlipHorizontal size={14} /> Flashcards
          </button>
        </div>
      </header>

      {tab === 'bank' && (
        <>
          <div className="filters-row">
            <label className="search-box">
              <Search size={14} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions and answers…"
                aria-label="Search interview questions"
              />
            </label>
            <div className="topic-pills" role="group" aria-label="Filter by topic">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  className={`pill ${topic === t ? 'active' : ''}`}
                  onClick={() => setTopic(t)}
                  aria-pressed={topic === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-note">No questions match “{query || topic}”. Try a different search.</p>
          ) : (
            <div className="qa-list bank">
              {filtered.map((x, i) => (
                <div className={`qa ${openIdx === i ? 'open' : ''}`} key={`${x.q}-${x.day}`}>
                  <button className="qa-q" onClick={() => setOpenIdx(openIdx === i ? null : i)} aria-expanded={openIdx === i}>
                    <ChevronRight size={14} className="qa-chevron" />
                    <span>{x.q}</span>
                    <span className="qa-meta">
                      Day {x.day} · {x.topic}
                      <button
                        className="mini-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenLesson(x.day)
                        }}
                        aria-label={`Open Day ${x.day} lesson`}
                      >
                        open lesson
                      </button>
                    </span>
                  </button>
                  {openIdx === i && <p className="qa-a">{x.a}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'weak' && (
        <>
          <p className="section-note">
            Collected automatically from quizzes, mocks and assessments you marked as <em>missed</em>.
          </p>
          {weak.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji" aria-hidden="true">🎯</span>
              <h2>No weak topics logged yet</h2>
              <p>Answer interview questions in a lesson quiz or the mock interview — anything you miss lands here for targeted revision.</p>
              <button className="btn-primary btn-sm" onClick={() => onOpenLesson(7)}>
                Try the Day 7 quiz
              </button>
            </div>
          ) : (
            <>
              <ul className="weak-list">
                {weak.map((w, i) => (
                  <li key={i} className="weak-item">
                    <span className="weak-topic">{w.topic}</span>
                    <span className="weak-q">{w.question}</span>
                    <button
                      className="mini-btn"
                      onClick={() => {
                        const l = LESSONS.find((l) => l.questions.some((q) => q.q === w.question) || (l.quiz ?? []).some((q) => q.q === w.question))
                        if (l) onOpenLesson(l.id)
                      }}
                    >
                      revisit lesson
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn-ghost btn-sm" onClick={clearWrongAnswers}>
                Clear weakness log (after re-visiting)
              </button>
            </>
          )}
        </>
      )}

      {tab === 'cards' && (
        <>
          <p className="section-note">{FLASHCARDS.length} cards of definitions and comparisons. Guess, flip, check.</p>
          <div className="flashcard-stage">
            <button
              className={`flashcard ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label={`Flashcard: ${flipped ? 'showing answer' : 'showing definition prompt'}. Click to flip.`}
            >
              {flipped ? (
                <span className="flash-back">{card.back}</span>
              ) : (
                <span className="flash-front">{card.front}</span>
              )}
            </button>
            <div className="flash-controls">
              <span className="qa-meta">
                Card {(cardIdx % FLASHCARDS.length) + 1} / {FLASHCARDS.length} · {card.topic}
              </span>
              <div className="flash-btns">
                <button className="btn-ghost btn-sm" onClick={() => { setCardIdx((c) => (c - 1 + FLASHCARDS.length) % FLASHCARDS.length); setFlipped(false) }}>
                  Previous
                </button>
                <button className="btn-primary btn-sm" onClick={() => { setCardIdx((c) => (c + 1) % FLASHCARDS.length); setFlipped(false) }}>
                  Next card
                </button>
                <button className="btn-ghost btn-sm" onClick={() => { setCardIdx(Math.floor(Math.random() * FLASHCARDS.length)); setFlipped(false) }}>
                  Shuffle
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <section className="practice-export">
        <h2 className="section-title">Export the roadmap</h2>
        <p className="section-note">Download the full 28-day plan as a printable Markdown outline.</p>
        <button
          className="btn-ghost btn-sm"
          onClick={() => {
            const md = [
              '# NetPath — 28-Day Computer Networks Interview Roadmap',
              '',
              ...LESSONS.map((l) =>
                [
                  `## Day ${l.id} (Week ${l.week}) — ${l.topic}`,
                  `- Objective: ${l.objective}`,
                  `- Study: ${l.subtopics.map((s) => `\`${s}\``).join(' · ')}`,
                  `- Time: 35m learn · 10m notes · 15m recall`,
                  `- Interview questions:`,
                  ...l.questions.map((q) => `  - ${q.q}`),
                  '',
                ].join('\n'),
              ),
            ].join('\n')
            const blob = new Blob([md], { type: 'text/markdown' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'netpath-28-day-roadmap.md'
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
          }}
        >
          <Download size={14} /> Download roadmap (.md)
        </button>
      </section>
    </div>
  )
}
