import { useCallback, useEffect, useState } from 'react'
import type { AppState, Theme } from '../types'

const STORAGE_KEY = 'netpath-state-v2'

export const EMPTY_STATE: AppState = {
  completed: [],
  streak: 0,
  lastStudyDate: null,
  theme: 'dark',
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
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('netpath-state-v1')
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_STATE
    return {
      ...EMPTY_STATE,
      ...parsed,
      completed: Array.isArray(parsed.completed)
        ? parsed.completed.filter((n) => typeof n === 'number' && n >= 1 && n <= 28)
        : [],
      streak: typeof parsed.streak === 'number' && parsed.streak >= 0 ? parsed.streak : 0,
      lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : null,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
    }
  } catch {
    return EMPTY_STATE
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: (s.theme === 'dark' ? 'light' : 'dark') as Theme }))
  }, [])

  const completeLesson = useCallback((id: number) => {
    setState((s) => {
      if (s.completed.includes(id)) return s
      return recordStreak({ ...s, completed: [...s.completed, id].sort((a, b) => a - b) })
    })
  }, [])

  const uncompleteLesson = useCallback((id: number) => {
    setState((s) => ({ ...s, completed: s.completed.filter((n) => n !== id) }))
  }, [])

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...EMPTY_STATE, theme: s.theme }))
  }, [])

  return { state, toggleTheme, completeLesson, uncompleteLesson, resetProgress }
}

export type AppStateApi = ReturnType<typeof useAppState>
