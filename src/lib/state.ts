import type { AppState, ResolvedTheme, Theme } from '../types'

export const EMPTY_STATE: AppState = {
  completed: [],
  streak: 0,
  lastStudyDate: null,
  theme: 'system',
  checklist: {},
}

/** YYYY-MM-DD in the user's local timezone (UTC keys made early-morning study count as yesterday). */
export function toLocalDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return toLocalDateKey(new Date())
}

export function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return toLocalDateKey(d)
}

export function systemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return 'dark'
}

/** Field-by-field validation; unknown fields dropped, corruption falls back to defaults. */
export function sanitize(raw: unknown): AppState {
  if (typeof raw !== 'object' || raw === null) return EMPTY_STATE
  const parsed = raw as Partial<AppState>
  const checklist: Record<string, boolean> = {}
  if (typeof parsed.checklist === 'object' && parsed.checklist !== null) {
    for (const [k, v] of Object.entries(parsed.checklist)) {
      if (typeof v === 'boolean') checklist[k] = v
    }
  }
  return {
    completed: Array.isArray(parsed.completed)
      ? parsed.completed.filter((n) => typeof n === 'number' && n >= 1 && n <= 28)
      : [],
    streak: typeof parsed.streak === 'number' && parsed.streak >= 0 ? parsed.streak : 0,
    lastStudyDate: typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : null,
    theme:
      parsed.theme === 'light' || parsed.theme === 'dark' || parsed.theme === 'system'
        ? parsed.theme
        : 'system',
    checklist,
  }
}

/** Canonical JSON for equality checks (stable key order, no `updatedAt` leak). */
export function canonicalJson(state: AppState): string {
  return JSON.stringify(sanitize(state))
}

export function recordStreak(state: AppState): AppState {
  const today = todayKey()
  if (state.lastStudyDate === today) return state
  const streak = state.lastStudyDate === yesterdayKey() ? state.streak + 1 : 1
  return { ...state, streak, lastStudyDate: today }
}

/** Opposite of the currently effective theme (resolves `system` via the OS). */
export function nextTheme(theme: Theme): Theme {
  const current = theme === 'system' ? systemTheme() : theme
  return current === 'dark' ? 'light' : 'dark'
}
