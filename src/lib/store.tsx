import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Entry, LedgerState } from './types'
import { seedState } from '../data/seed'

const KEY = 'khatamitra-v1'

interface Store {
  state: LedgerState
  addEntry: (customerId: string, type: Entry['type'], amount: number, note: string) => void
  addCustomer: (name: string, phone: string, area: string) => string
  resetDemo: () => void
}

const Ctx = createContext<Store | null>(null)

function load(): LedgerState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as LedgerState
  } catch { /* fall through to seed */ }
  return seedState
}

let counter = 1000
const uid = () => `u${Date.now().toString(36)}${counter++}`

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LedgerState>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full/blocked */ }
  }, [state])

  const store = useMemo<Store>(() => ({
    state,
    addEntry: (customerId, type, amount, note) =>
      setState((s) => ({
        ...s,
        entries: [...s.entries, { id: uid(), customerId, type, amount, daysAgo: 0, note: note || (type === 'credit' ? 'Udhaar' : 'Payment') }],
      })),
    addCustomer: (name, phone, area) => {
      const id = uid()
      setState((s) => ({ ...s, customers: [...s.customers, { id, name, phone, area }] }))
      return id
    },
    resetDemo: () => setState(seedState),
  }), [state])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useLedger(): Store {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLedger outside provider')
  return ctx
}
