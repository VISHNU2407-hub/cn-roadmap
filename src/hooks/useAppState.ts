import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppState, Theme, TimerState, WrongAnswer } from '../types'

const STORAGE_KEY = 'netpath-state-v1'
const TIMER_KEY = 'netpath-timer-v1'

export const EMPTY_STATE: AppState = {
  completed: [],
  notes: {},
  secondsStudied: {},
  wrongAnswers: [],
  attempts: {},
  streak: 0,
  lastStudyDate: null,
  theme: 'dark',
  celebratedWeeks: [],
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

/** Safely parse persisted state; corruption or empty data falls back to defaults. */
function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_STATE
    return {
      ...EMPTY_STATE,
      ...parsed,
      completed: Array.isArray(parsed.completed)
        ? parsed.completed.filter((n) => typeof n === 'number' && n >= 1 && n <= 28)
        : [],
      notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      secondsStudied:
        parsed.secondsStudied && typeof parsed.secondsStudied === 'object'
          ? Object.fromEntries(
              Object.entries(parsed.secondsStudied).filter(([, v]) => typeof v === 'number'),
            )
          : {},
      wrongAnswers: Array.isArray(parsed.wrongAnswers) ? parsed.wrongAnswers : [],
      attempts: parsed.attempts && typeof parsed.attempts === 'object' ? parsed.attempts : {},
      streak: typeof parsed.streak === 'number' && parsed.streak >= 0 ? parsed.streak : 0,
      lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : null,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      celebratedWeeks: Array.isArray(parsed.celebratedWeeks)
        ? parsed.celebratedWeeks.filter((n) => typeof n === 'number')
        : [],
    }
  } catch {
    return EMPTY_STATE
  }
}

/** Timer persisted so a refresh resumes/reduces gracefully instead of pretending to run. */
function loadTimer(): { saved: TimerState | null; killed: boolean } {
  try {
    const raw = localStorage.getItem(TIMER_KEY)
    if (!raw) return { saved: null, killed: false }
    const t = JSON.parse(raw) as TimerState
    if (
      typeof t !== 'object' ||
      t === null ||
      typeof t.lessonId !== 'number' ||
      typeof t.phaseIndex !== 'number' ||
      typeof t.secondsLeft !== 'number'
    ) {
      return { saved: null, killed: false }
    }
    // If it was running while the page was closed, account for the elapsed wall-clock.
    if (t.running && typeof t.startedAt === 'number') {
      const elapsedMs = Date.now() - t.startedAt
      if (elapsedMs > 2000) {
        localStorage.removeItem(TIMER_KEY)
        return { saved: null, killed: true }
      }
    }
    return { saved: { ...t, running: false, startedAt: null }, killed: false }
  } catch {
    return { saved: null, killed: false }
  }
}

function recordStreak(state: AppState): AppState {
  const today = todayKey()
  if (state.lastStudyDate === today) return state
  const streak = state.lastStudyDate === yesterdayKey() ? state.streak + 1 : 1
  return { ...state, streak, lastStudyDate: today }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)
  const [timerState, setTimerState] = useState<TimerState | null>(() => loadTimer().saved)
  const [timerInterrupted, setTimerInterrupted] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  const saveTimer = useCallback((t: TimerState | null) => {
    setTimerState(t)
    if (t) localStorage.setItem(TIMER_KEY, JSON.stringify(t))
    else localStorage.removeItem(TIMER_KEY)
  }, [])

  const markInterrupted = useCallback(() => {
    const { saved, killed } = loadTimer()
    setTimerState(saved)
    setTimerInterrupted(killed)
  }, [])

  // Once per app load: detect a timer that was mid-run when the page closed/refreshed.
  useEffect(() => {
    markInterrupted()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: (s.theme === 'dark' ? 'light' : 'dark') as Theme }))
  }, [])

  const completeLesson = useCallback((id: number) => {
    setState((s) => {
      const wasDone = s.completed.includes(id)
      const secs = Math.round(s.secondsStudied[id] ?? 0)
      const base: AppState = wasDone
        ? s
        : { ...s, completed: [...s.completed, id].sort((a, b) => a - b) }
      // A completed lesson always accounts for its hour; manual timer study may exceed it.
      const studied = secs >= 3300 ? secs : wasDone ? secs : Math.max(secs, 3600)
      let next: AppState = { ...base, secondsStudied: { ...base.secondsStudied, [id]: studied } }
      if (!wasDone) next = recordStreak(next)
      return next
    })
  }, [])

  const uncompleteLesson = useCallback((id: number) => {
    setState((s) => ({ ...s, completed: s.completed.filter((n) => n !== id) }))
  }, [])

  const saveNotes = useCallback((id: number, text: string) => {
    setState((s) => ({ ...s, notes: { ...s.notes, [id]: text } }))
  }, [])

  const logTimeStudied = useCallback((id: number, seconds: number) => {
    setState((s) => {
      const prev = s.secondsStudied[id] ?? 0
      const merged = s.completed.includes(id) ? prev : Math.max(prev, seconds)
      const next = { ...s, secondsStudied: { ...s.secondsStudied, [id]: merged } }
      if (s.lastStudyDate !== todayKey()) return recordStreak(next)
      return next
    })
  }, [])

  const logWrongAnswer = useCallback((question: string, topic: WrongAnswer['topic']) => {
    setState((s) => {
      if (s.wrongAnswers.some((w) => w.question === question && w.topic === topic)) return s
      return {
        ...s,
        wrongAnswers: [...s.wrongAnswers, { question, topic, date: todayKey() }].slice(-60),
      }
    })
  }, [])

  const logAttempt = useCallback((question: string, verdict: 'correct' | 'missed') => {
    setState((s) => ({
      ...s,
      attempts: { ...s.attempts, [question]: { verdict, date: todayKey() } },
    }))
  }, [])

  const clearWrongAnswers = useCallback(() => {
    setState((s) => ({ ...s, wrongAnswers: [], attempts: {} }))
  }, [])

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...EMPTY_STATE, theme: s.theme }))
    localStorage.removeItem(TIMER_KEY)
    setTimerState(null)
    setTimerInterrupted(false)
  }, [])

  const celebrateWeek = useCallback((week: number) => {
    setState((s) =>
      s.celebratedWeeks.includes(week) ? s : { ...s, celebratedWeeks: [...s.celebratedWeeks, week] },
    )
  }, [])

  const totalSeconds = useMemo(
    () => Object.values(state.secondsStudied).reduce((a, b) => a + b, 0),
    [state.secondsStudied],
  )

  return {
    state,
    timerState,
    timerInterrupted,
    saveTimer,
    markInterrupted,
    toggleTheme,
    completeLesson,
    uncompleteLesson,
    saveNotes,
    logTimeStudied,
    logWrongAnswer,
    logAttempt,
    clearWrongAnswers,
    resetProgress,
    celebrateWeek,
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
  }
}

export type AppStateApi = ReturnType<typeof useAppState>
