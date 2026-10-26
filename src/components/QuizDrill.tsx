import { useMemo, useState } from 'react'
import { CircleCheck, CircleX, Eye, RotateCcw, BrainCog, ListChecks } from 'lucide-react'
import { useApp } from '../app-context'
import { LESSONS } from '../data/curriculum'
import type { Category, InterviewQuestion } from '../types'

interface Props {
  questions: InterviewQuestion[]
  /** mock/assessment shows a strengths & gaps summary at the end */
  mode?: 'drill' | 'assessment'
}

type Verdict = 'correct' | 'missed'

export function QuizDrill({ questions, mode = 'drill' }: Props) {
  const { logAttempt, logWrongAnswer } = useApp()
  const [attemptText, setAttemptText] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({})

  const answered = Object.keys(revealed).length
  const marked = Object.keys(verdicts).length
  const gotIt = Object.values(verdicts).filter((v) => v === 'correct').length
  const missed = marked - gotIt
  const allMarked = marked === questions.length

  const reveal = (i: number) => setRevealed((r) => ({ ...r, [i]: true }))

  const mark = (i: number, v: Verdict) => {
    setVerdicts((prev) => ({ ...prev, [i]: v }))
    logAttempt(questions[i].q, v)
    if (v === 'missed') logWrongAnswer(questions[i].q, questions[i].topic)
  }

  const retry = (i: number) => {
    setVerdicts((prev) => {
      const n = { ...prev }
      delete n[i]
      return n
    })
    setRevealed((r) => ({ ...r, [i]: false }))
  }

  return (
    <div className="drill">
      <div className="drill-progress" role="status">
        <ListChecks size={14} />
        <span>
          {answered}/{questions.length} revealed · {gotIt} got it · {missed} missed
        </span>
      </div>

      <ol className="drill-list">
        {questions.map((q, i) => {
          const open = revealed[i]
          const v = verdicts[i]
          return (
            <li className="drill-item" key={q.q}>
              <div className="drill-q">
                <span className="drill-num">{i + 1}</span>
                <div className="drill-q-body">
                  <p className="drill-question">{q.q}</p>
                  <span className="drill-topic">{q.topic}</span>
                </div>
              </div>

              {!open && (
                <div className="drill-attempt">
                  <textarea
                    value={attemptText[i] ?? ''}
                    onChange={(e) => setAttemptText((a) => ({ ...a, [i]: e.target.value }))}
                    placeholder="Type your answer from memory (or write bullet points) — reveal is disabled until you attempt."
                    rows={2}
                    aria-label={`Your attempt for question ${i + 1}`}
                  />
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => reveal(i)}
                    disabled={(attemptText[i] ?? '').trim().length < 3}
                    title={
                      (attemptText[i] ?? '').trim().length < 3
                        ? 'Attempt first — type at least a few words'
                        : 'Show model answer'
                    }
                  >
                    <Eye size={14} /> Reveal answer
                  </button>
                </div>
              )}

              {open && (
                <div className="drill-answer">
                  <strong>Model answer</strong>
                  <p>{q.a}</p>
                </div>
              )}

              {open && v === undefined && (
                <div className="drill-verdict">
                  <span className="drill-verdict-label">Self-mark:</span>
                  <button className="verdict-btn correct" onClick={() => mark(i, 'correct')}>
                    <CircleCheck size={14} /> Got it
                  </button>
                  <button className="verdict-btn missed" onClick={() => mark(i, 'missed')}>
                    <CircleX size={14} /> Missed it
                  </button>
                  <button className="btn-ghost btn-sm" onClick={() => retry(i)}>
                    <RotateCcw size={13} /> Retry
                  </button>
                </div>
              )}
              {open && v !== undefined && (
                <div className={`drill-verdict pinned ${v}`}>
                  {v === 'correct' ? (
                    <>
                      <CircleCheck size={14} /> Marked: got it
                      <button className="btn-ghost btn-sm" onClick={() => retry(i)}>
                        <RotateCcw size={13} /> Change
                      </button>
                    </>
                  ) : (
                    <>
                      <CircleX size={14} /> Marked: missed — added to your weak topics
                      <button className="btn-ghost btn-sm" onClick={() => retry(i)}>
                        <RotateCcw size={13} /> Change
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {mode === 'assessment' && allMarked && (
        <AssessmentSummary gotIt={gotIt} missedIds={Object.entries(verdicts).filter(([, v]) => v === 'missed').map(([i]) => Number(i))} questions={questions} />
      )}
      {mode === 'drill' && allMarked && (
        <div className="drill-done" role="status">
          <BrainCog size={16} />
          <span>
            Quiz finished — <strong>{gotIt}/{questions.length}</strong> correct.{' '}
            {missed > 0
              ? 'Your missed questions were logged to weak topics; revisit them during Days 22–26.'
              : 'Perfect recall — outstanding.'}
          </span>
        </div>
      )}
    </div>
  )
}

function AssessmentSummary({
  gotIt,
  missedIds,
  questions,
}: {
  gotIt: number
  missedIds: number[]
  questions: InterviewQuestion[]
}) {
  const missedTopics = [...new Set(missedIds.map((i) => questions[i].topic))]
  const allTopics: Category[] = ['Fundamentals', 'Transport', 'Application', 'IP & Routing', 'Security']
  const strongTopics = allTopics.filter((t) => !missedTopics.includes(t))
  const weakDays = useMemo(() => {
    const topics = new Set(missedTopics)
    return LESSONS.filter((l) => l.questions.some((q) => topics.has(q.topic)))
      .map((l) => l.id)
      .slice(0, 8)
  }, [missedTopics.join(',')])

  const pct = Math.round((gotIt / questions.length) * 100)
  const level =
    pct >= 85 ? 'Interview ready' : pct >= 65 ? 'Nearly there' : 'Needs another pass'

  return (
    <div className="assessment-summary">
      <h3>
        <CircleCheck size={16} /> Final assessment: {gotIt}/{questions.length} ({pct}%)
      </h3>
      <p className="assessment-level">{level}</p>
      <div className="assessment-grid">
        <div>
          <h4>Strengths</h4>
          {strongTopics.length === 0 ? (
            <p>Every topic had a miss — one more revision pass will pay off.</p>
          ) : (
            <ul>
              {strongTopics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4>Gaps to revisit</h4>
          {missedTopics.length === 0 ? (
            <p>None — flawless run. Keep it sharp with the flashcards weekly.</p>
          ) : (
            <ul>
              {missedTopics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="assessment-next">
        Recommended next: CIDR practice sets, HTTP/2 vs HTTP/3, DNSSEC & DoH/DoT, NAT traversal
        (STUN/TURN), and TLS 1.3 details — matched to the gaps above.
      </p>
      {weakDays.length > 0 && (
        <p className="assessment-next">Consider revisiting days: {weakDays.join(', ')}.</p>
      )}
    </div>
  )
}
