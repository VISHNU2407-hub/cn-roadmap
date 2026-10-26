import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'
import { useApp } from '../app-context'
import { STUDY_BLOCKS } from '../types'

const PHASE_SECONDS = STUDY_BLOCKS.map((b) => b.minutes * 60)

function fmt(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

interface Props {
  lessonId: number
}

export function Timer({ lessonId }: Props) {
  const { timerState, saveTimer, logTimeStudied } = useApp()
  const persisted = timerState?.lessonId === lessonId ? timerState : null

  const [phaseIndex, setPhaseIndex] = useState(persisted?.phaseIndex ?? 0)
  const [secondsLeft, setSecondsLeft] = useState(persisted?.secondsLeft ?? PHASE_SECONDS[0])
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const completedLogged = useRef(false)

  const persist = useCallback(
    (phase: number, left: number, isRunning: boolean) => {
      saveTimer({
        lessonId,
        phaseIndex: phase,
        secondsLeft: left,
        running: isRunning,
        startedAt: isRunning ? Date.now() : null,
      })
    },
    [lessonId, saveTimer],
  )

  // Load persisted state for a different lesson or after a refresh.
  useEffect(() => {
    if (persisted && persisted.phaseIndex === phaseIndex && persisted.secondsLeft === secondsLeft)
      return
    if (persisted) {
      setPhaseIndex(persisted.phaseIndex)
      setSecondsLeft(persisted.secondsLeft)
      setRunning(false)
      setFinished(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  // Pause + persist whenever the component unmounts or the lesson changes.
  useEffect(() => {
    return () => {
      if (runningRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        // save the session honestly: running=false, preserving elapsed time
        persist(phaseRef.current, secondsLeftRef.current, false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  const intervalRef = useRef<number | undefined>(undefined)
  const secondsLeftRef = useRef(secondsLeft)
  secondsLeftRef.current = secondsLeft
  const runningRef = useRef(running)
  runningRef.current = running
  const phaseRef = useRef(phaseIndex)
  phaseRef.current = phaseIndex

  const finishSession = useCallback(() => {
    setRunning(false)
    clearInterval(intervalRef.current)
    setFinished(true)
    if (!completedLogged.current) {
      completedLogged.current = true
      logTimeStudied(lessonId, 3600)
    }
    saveTimer(null)
  }, [lessonId, logTimeStudied, saveTimer])

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1
        // block boundary
        if (phaseIndex < PHASE_SECONDS.length - 1) {
          const next = phaseIndex + 1
          setPhaseIndex(next)
          persist(next, PHASE_SECONDS[next], running)
          return PHASE_SECONDS[next]
        }
        // schedule completion outside setState
        queueMicrotask(finishSession)
        return 0
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, phaseIndex, persist, finishSession])

  // Persist running progress every 5 seconds so a refresh resumes where possible.
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => persist(phaseIndex, secondsLeftRef.current, true), 5000)
    return () => clearInterval(id)
  }, [running, phaseIndex, persist])

  const start = () => {
    completedLogged.current = false
    setRunning(true)
    persist(phaseIndex, secondsLeft, true)
  }
  const pause = () => {
    setRunning(false)
    persist(phaseIndex, secondsLeft, false)
  }
  const reset = () => {
    setRunning(false)
    clearInterval(intervalRef.current)
    setPhaseIndex(0)
    setSecondsLeft(PHASE_SECONDS[0])
    setFinished(false)
    completedLogged.current = false
    saveTimer(null)
  }

  const block = STUDY_BLOCKS[phaseIndex]
  const totalThisPhase = PHASE_SECONDS[phaseIndex]
  const phasePct = ((totalThisPhase - secondsLeft) / totalThisPhase) * 100
  const overallPct =
    (PHASE_SECONDS.slice(0, phaseIndex).reduce((a, b) => a + b, 0) + (totalThisPhase - secondsLeft)) /
    3600

  if (finished) {
    return (
      <div className="timer-finished" role="status">
        <CheckCircle2 size={20} className="accent" />
        <div>
          <strong>Session complete — 60 minutes logged.</strong>
          <p>Take a breath, then mark the lesson complete if you haven't yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`timer ${running ? 'timer-running' : ''}`} aria-label="60-minute study timer">
      <div className="timer-top">
        <span className="timer-label">
          <TimerIcon size={14} />
          {running ? 'In progress' : 'Ready'} · {block.label}
        </span>
        <span className="timer-clock" role="timer" aria-live="off">
          {fmt(secondsLeft)}
        </span>
      </div>

      <div className="timer-blocks" aria-hidden="true">
        {STUDY_BLOCKS.map((b, i) => (
          <div className={`timer-block ${i === phaseIndex ? 'active' : i < phaseIndex ? 'past' : ''}`} key={b.label}>
            <div className="timer-block-track">
              <div
                className="timer-block-fill"
                style={{ width: i === phaseIndex ? `${phasePct}%` : i < phaseIndex ? '100%' : '0%' }}
              />
            </div>
            <div className="timer-block-caption">
              <span>{b.label}</span>
              <span>{b.minutes}m</span>
            </div>
          </div>
        ))}
      </div>

      <p className="timer-hint">{block.hint}</p>

      <div className="timer-controls">
        {!running ? (
          <button className="btn-primary btn-sm" onClick={start} disabled={secondsLeft <= 0}>
            <Play size={14} /> {secondsLeft !== PHASE_SECONDS[phaseIndex] ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button className="btn-ghost btn-sm" onClick={pause}>
            <Pause size={14} /> Pause
          </button>
        )}
        <button className="btn-ghost btn-sm" onClick={reset}>
          <RotateCcw size={14} /> Reset
        </button>
        <span className="timer-overall" title={`${Math.round(overallPct * 100)}% of today's hour`}>
          {Math.round(overallPct * 100)}% of 60 min
        </span>
      </div>
    </div>
  )
}
