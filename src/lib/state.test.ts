import { describe, expect, it } from 'vitest'
import {
  EMPTY_STATE,
  canonicalJson,
  nextTheme,
  recordStreak,
  sanitize,
  systemTheme,
  toLocalDateKey,
  todayKey,
  yesterdayKey,
} from './state'

describe('sanitize', () => {
  it('returns defaults for null/garbage', () => {
    expect(sanitize(null)).toEqual(EMPTY_STATE)
    expect(sanitize('nope')).toEqual(EMPTY_STATE)
    expect(sanitize(42)).toEqual(EMPTY_STATE)
  })

  it('keeps valid fields', () => {
    const s = sanitize({
      completed: [1, 3, 28],
      streak: 4,
      lastStudyDate: '2026-10-27',
      theme: 'light',
      checklist: { 'd1:x': true },
    })
    expect(s.completed).toEqual([1, 3, 28])
    expect(s.streak).toBe(4)
    expect(s.lastStudyDate).toBe('2026-10-27')
    expect(s.theme).toBe('light')
    expect(s.checklist).toEqual({ 'd1:x': true })
  })

  it('filters out-of-range and non-number completed ids', () => {
    const s = sanitize({ completed: [0, 1, 29, 'x', 5, null, 28] })
    expect(s.completed).toEqual([1, 5, 28])
  })

  it('drops unknown fields such as updatedAt', () => {
    const s = sanitize({ completed: [2], updatedAt: 12345 })
    expect('updatedAt' in s).toBe(false)
  })

  it('falls back to system theme for invalid theme values', () => {
    expect(sanitize({ theme: 'blue' }).theme).toBe('system')
    expect(sanitize({}).theme).toBe('system')
    expect(sanitize({ theme: 'system' }).theme).toBe('system')
  })

  it('rejects negative streak and non-boolean checklist values', () => {
    const s = sanitize({ streak: -3, checklist: { a: 'yes', b: true, c: 0 } })
    expect(s.streak).toBe(0)
    expect(s.checklist).toEqual({ b: true })
  })
})

describe('canonicalJson', () => {
  it('ignores unknown fields when comparing', () => {
    const a = sanitize({ completed: [1], updatedAt: 1 })
    const b = sanitize({ completed: [1], updatedAt: 999 })
    expect(canonicalJson(a)).toBe(canonicalJson(b))
  })
})

describe('recordStreak', () => {
  it('starts a streak on first study', () => {
    const s = recordStreak({ ...EMPTY_STATE, lastStudyDate: null })
    expect(s.streak).toBe(1)
    expect(s.lastStudyDate).toBe(todayKey())
  })

  it('keeps streak unchanged when already studied today', () => {
    const s = recordStreak({ ...EMPTY_STATE, streak: 7, lastStudyDate: todayKey() })
    expect(s.streak).toBe(7)
    expect(s.lastStudyDate).toBe(todayKey())
  })

  it('increments when last studied yesterday', () => {
    const s = recordStreak({ ...EMPTY_STATE, streak: 3, lastStudyDate: yesterdayKey() })
    expect(s.streak).toBe(4)
  })

  it('resets to 1 after a gap', () => {
    const s = recordStreak({ ...EMPTY_STATE, streak: 9, lastStudyDate: '2020-01-01' })
    expect(s.streak).toBe(1)
    expect(s.lastStudyDate).toBe(todayKey())
  })
})

describe('date keys', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(toLocalDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(toLocalDateKey(new Date(2026, 11, 31))).toBe('2026-12-31')
  })

  it('yesterday is one calendar day before today', () => {
    const today = new Date()
    const expected = new Date(today)
    expected.setDate(expected.getDate() - 1)
    expect(yesterdayKey()).toBe(toLocalDateKey(expected))
  })

  it('todayKey matches a 10-char date pattern', () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('theme', () => {
  it('systemTheme returns dark or light', () => {
    expect(['dark', 'light']).toContain(systemTheme())
  })

  it('nextTheme flips from explicit and resolved-system values', () => {
    expect(nextTheme('dark')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('system')).toBe(systemTheme() === 'dark' ? 'light' : 'dark')
  })
})
