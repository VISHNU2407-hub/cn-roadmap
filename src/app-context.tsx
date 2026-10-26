import { createContext, useContext } from 'react'
import type { AppStateApi } from './hooks/useAppState'

export const AppContext = createContext<AppStateApi | null>(null)

export function useApp(): AppStateApi {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppContext.Provider')
  return ctx
}
