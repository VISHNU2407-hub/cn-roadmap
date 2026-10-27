import { useCallback, useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
  EMPTY_STATE,
  canonicalJson,
  nextTheme,
  recordStreak,
  sanitize,
  systemTheme,
} from '../lib/state'
import type { AppState, ResolvedTheme } from '../types'

const SAVE_DEBOUNCE_MS = 500
const RETRY_MS = 3000
const LEGACY_KEYS = ['netpath-state-v2', 'netpath-state-v1']

function stateDoc(uid: string) {
  return doc(db, 'users', uid, 'state', 'main')
}

function errorMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string })?.code
  if (code === 'permission-denied') {
    return 'Sync blocked: Firestore rules rejected the request. Publish your security rules in the Firebase console.'
  }
  if (code === 'unavailable') {
    return 'Cannot reach Firestore — your changes are not being saved. Check your connection.'
  }
  if (code === 'failed-precondition') {
    return 'Firestore database is not set up. Create it in the Firebase console.'
  }
  return fallback
}

export function useAppState(uid: string | null) {
  const [state, setState] = useState<AppState>(EMPTY_STATE)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(systemTheme)

  const stateRef = useRef(state)
  stateRef.current = state
  const ownerRef = useRef<string | null>(uid)
  const remoteJsonRef = useRef<string | null>(null)
  const timerRef = useRef<number | null>(null)

  // Remove all legacy browser storage — progress lives only in Firestore.
  useEffect(() => {
    try {
      for (const key of LEGACY_KEYS) localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }, [])

  // Realtime subscription: opens on one device → updates live everywhere.
  useEffect(() => {
    ownerRef.current = uid
    remoteJsonRef.current = null
    stateRef.current = EMPTY_STATE
    setState(EMPTY_STATE)
    setSyncError(null)
    if (!uid) {
      setLoading(false)
      return
    }
    setLoading(true)

    const unsub = onSnapshot(
      stateDoc(uid),
      {
        next: (snap) => {
          if (ownerRef.current !== uid) return
          if (!snap.exists()) {
            // First visit: seed the document with whatever local state exists.
            const seed = stateRef.current
            setDoc(stateDoc(uid), { ...seed, updatedAt: Date.now() })
              .then(() => {
                if (ownerRef.current === uid) remoteJsonRef.current = canonicalJson(seed)
              })
              .catch((err) => {
                console.error('Failed to seed Firestore doc:', err)
                if (ownerRef.current === uid) {
                  setSyncError(errorMessage(err, 'Progress is not saving to Firebase.'))
                }
              })
              .finally(() => {
                if (ownerRef.current === uid) setLoading(false)
              })
            return
          }
          const incoming = sanitize(snap.data())
          const json = canonicalJson(incoming)
          if (json !== remoteJsonRef.current) {
            remoteJsonRef.current = json
            if (json !== canonicalJson(stateRef.current)) setState(incoming)
          }
          setSyncError(null)
          setLoading(false)
        },
        error: (err) => {
          console.error('Firestore snapshot error:', err)
          if (ownerRef.current === uid) {
            setSyncError(errorMessage(err, 'Could not load your saved progress.'))
            setLoading(false)
          }
        },
      },
    )
    return unsub
  }, [uid])

  // Debounced save → with capped-backoff retry until it lands.
  const persist = useCallback(async (u: string) => {
    if (ownerRef.current !== u) return
    const snapshot = stateRef.current
    const json = canonicalJson(snapshot)
    if (json === remoteJsonRef.current) return
    try {
      await setDoc(stateDoc(u), { ...snapshot, updatedAt: Date.now() })
      if (ownerRef.current !== u) return
      remoteJsonRef.current = json
      setSyncError(null)
    } catch (err) {
      console.error('Failed to save progress to Firestore:', err)
      if (ownerRef.current !== u) return
      setSyncError(errorMessage(err, 'Progress is not saving to Firebase.'))
      window.setTimeout(() => {
        void persist(u)
      }, RETRY_MS)
    }
  }, [])

  useEffect(() => {
    if (!uid) return
    if (canonicalJson(state) === remoteJsonRef.current) return
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      void persist(uid)
    }, SAVE_DEBOUNCE_MS)
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [state, uid, persist])

  // Apply theme; follow the OS live while the preference is 'system'.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const apply = () => {
      const resolved: ResolvedTheme = state.theme === 'system' ? (mq.matches ? 'light' : 'dark') : state.theme
      document.documentElement.dataset.theme = resolved
      setResolvedTheme(resolved)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [state.theme])

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: nextTheme(s.theme) }))
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

  const setChecklist = useCallback((keys: string[], value: boolean) => {
    setState((s) => {
      const checklist = { ...s.checklist }
      for (const k of keys) checklist[k] = value
      return { ...s, checklist }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...EMPTY_STATE, theme: s.theme }))
  }, [])

  return {
    state,
    syncError,
    loading,
    resolvedTheme,
    toggleTheme,
    completeLesson,
    uncompleteLesson,
    setChecklist,
    resetProgress,
  }
}

export type AppStateApi = ReturnType<typeof useAppState>
